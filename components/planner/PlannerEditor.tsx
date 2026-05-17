"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Save, Undo2, Redo2, Sun, Cloud, CloudOff, Trash2,
  Paintbrush, MousePointer, Search, X, ChevronLeft, ChevronRight,
  AlertTriangle, Leaf
} from "lucide-react";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts";
import { saveLayout } from "@/lib/storage";
import { generateId } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import plantsData from "@/data/plants.json";
import type { Layout, PlacedPlant, SunZone, Plant } from "@/types";

const plants = plantsData as Plant[];

type SunType = "sunny" | "partial" | "shaded";
type ToolMode = "select" | "paint-sunny" | "paint-partial" | "paint-shaded";

const sunColors: Record<SunType, string> = {
  sunny: "bg-sun-yellow/50 border-sun-yellow",
  partial: "bg-orange-200/50 border-orange-300",
  shaded: "bg-shade-blue/50 border-shade-blue",
};

const sunLabels: Record<SunType, string> = {
  sunny: "Sinar Penuh",
  partial: "Sebagian",
  shaded: "Teduh",
};

function DraggablePlantItem({ plant }: { plant: Plant }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${plant.id}`,
    data: { type: "palette", plantId: plant.id },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={cn(
        "flex items-center gap-2 p-2 rounded-xl cursor-grab active:cursor-grabbing select-none",
        "hover:bg-sage-100 transition-colors",
        isDragging && "opacity-50"
      )}
    >
      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-border">
        <img
          src={plant.imageUrl}
          alt={plant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=60&h=60&fit=crop`;
          }}
          draggable={false}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-text-dark truncate">{plant.name}</p>
        <p className="text-[10px] text-text-muted">{plant.spacingCm}cm jarak</p>
      </div>
    </div>
  );
}

function GridCell({
  col, row, placedPlant, sunZone, isSelected, tool, onCellClick, onDrop,
}: {
  col: number; row: number;
  placedPlant?: PlacedPlant;
  sunZone?: SunZone;
  isSelected: boolean;
  tool: ToolMode;
  onCellClick: (col: number, row: number) => void;
  onDrop: (col: number, row: number, plantId: string) => void;
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: `cell-${col}-${row}`,
    data: { col, row },
  });

  const plant = placedPlant ? plants.find((p) => p.id === placedPlant.plantId) : undefined;

  return (
    <div
      ref={setNodeRef}
      onClick={() => onCellClick(col, row)}
      className={cn(
        "relative border border-border/60 transition-all cursor-pointer",
        sunZone && sunColors[sunZone.type],
        !sunZone && "bg-white hover:bg-sage-50",
        isOver && tool === "select" && "bg-primary/10 border-primary",
        isSelected && "ring-2 ring-primary ring-inset",
        tool.startsWith("paint") && "hover:opacity-80",
      )}
      style={{ aspectRatio: "1" }}
    >
      {plant && (
        <div className={cn("absolute inset-0.5 rounded flex items-center justify-center overflow-hidden", isSelected && "ring-2 ring-primary ring-inset")}>
          <img
            src={plant.imageUrl}
            alt={plant.name}
            className="w-full h-full object-cover rounded"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=60&h=60&fit=crop`;
            }}
            draggable={false}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-text-dark/60 text-white text-[8px] text-center py-0.5 leading-tight truncate px-0.5">
            {plant.name.split(" ")[0]}
          </div>
        </div>
      )}
      {isOver && tool === "select" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
}

interface PlannerEditorProps {
  initialLayout: Layout;
  isNew?: boolean;
}

export function PlannerEditor({ initialLayout, isNew = false }: PlannerEditorProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [layout, setLayout] = useState<Layout>(initialLayout);
  const [history, setHistory] = useState<Layout[]>([initialLayout]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [selectedPlantId, setSelectedPlantId] = useState<string | null>(null);
  const [tool, setTool] = useState<ToolMode>("select");
  const [paletteSearch, setPaletteSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const [isPainting, setIsPainting] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const cols = Math.round(layout.widthM / (layout.cellSizeCm / 100));
  const rows = Math.round(layout.heightM / (layout.cellSizeCm / 100));

  const filteredPalette = plants.filter((p) =>
    p.name.toLowerCase().includes(paletteSearch.toLowerCase())
  );

  function pushHistory(newLayout: Layout) {
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(newLayout);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
  }

  function undo() {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setLayout(history[idx]);
    }
  }

  function redo() {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      setLayout(history[idx]);
    }
  }

  function handleCellClick(col: number, row: number) {
    if (tool === "select") {
      const placed = layout.plants.find((p) => p.col === col && p.row === row);
      setSelectedPlantId(placed?.id ?? null);
    } else {
      paintCell(col, row);
    }
  }

  function paintCell(col: number, row: number) {
    const typeMap: Record<ToolMode, SunType | null> = {
      select: null,
      "paint-sunny": "sunny",
      "paint-partial": "partial",
      "paint-shaded": "shaded",
    };
    const sunType = typeMap[tool];
    if (!sunType) return;

    const filtered = layout.sunZones.filter((z) => !(z.col === col && z.row === row));
    const newZones = [...filtered, { col, row, type: sunType }];
    const newLayout = { ...layout, sunZones: newZones, updatedAt: new Date().toISOString() };
    setLayout(newLayout);
  }

  function removeSelectedPlant() {
    if (!selectedPlantId) return;
    const newPlants = layout.plants.filter((p) => p.id !== selectedPlantId);
    const newLayout = { ...layout, plants: newPlants, updatedAt: new Date().toISOString() };
    pushHistory(newLayout);
    setLayout(newLayout);
    setSelectedPlantId(null);
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveDrag(String(event.active.id));
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveDrag(null);
    const { active, over } = event;
    if (!over) return;

    const overData = over.data.current as { col: number; row: number } | undefined;
    if (!overData) return;

    const activeData = active.data.current as { type: string; plantId: string } | undefined;
    if (!activeData) return;

    const { col, row } = overData;
    const plantId = activeData.plantId;

    // Check if cell is already occupied
    const occupied = layout.plants.some((p) => p.col === col && p.row === row);
    if (occupied) {
      toast.error("Sel ini sudah terisi tanaman lain.");
      return;
    }

    const plant = plants.find((p) => p.id === plantId);
    if (!plant) return;

    // Check sunlight zone compatibility
    const zone = layout.sunZones.find((z) => z.col === col && z.row === row);
    if (zone) {
      const lightMap: Record<string, string[]> = {
        full: ["sunny"],
        partial: ["sunny", "partial"],
        shade: ["partial", "shaded"],
      };
      const compatZones = lightMap[plant.lightRequirement] ?? [];
      if (!compatZones.includes(zone.type)) {
        toast.warning(`⚠️ ${plant.name} kurang cocok untuk zona ${sunLabels[zone.type]}.`);
      }
    }

    const newPlacedPlant: PlacedPlant = {
      id: generateId(),
      plantId,
      col,
      row,
      colSpan: 1,
      rowSpan: 1,
    };

    const newLayout = {
      ...layout,
      plants: [...layout.plants, newPlacedPlant],
      updatedAt: new Date().toISOString(),
    };
    pushHistory(newLayout);
    setLayout(newLayout);
  }

  function handleSave() {
    if (!user) return;
    const toSave = { ...layout, userId: user.id, updatedAt: new Date().toISOString() };
    saveLayout(toSave);
    setLayout(toSave);
    toast.success("Layout berhasil disimpan! 💾");
    if (isNew) {
      router.replace(`/planner/${layout.id}`);
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedPlantId) removeSelectedPlant();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const selectedPlant = selectedPlantId
    ? layout.plants.find((p) => p.id === selectedPlantId)
    : null;
  const selectedPlantData = selectedPlant
    ? plants.find((p) => p.id === selectedPlant.plantId)
    : null;

  const activeDragPlant = activeDrag?.startsWith("palette-")
    ? plants.find((p) => `palette-${p.id}` === activeDrag)
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] -mx-4 md:-mx-6 -mt-4 md:-mt-6 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-white border-b border-border flex-shrink-0">
        <input
          type="text"
          value={layout.name}
          onChange={(e) => setLayout({ ...layout, name: e.target.value })}
          className="flex-1 max-w-xs font-semibold text-text-dark bg-transparent border-0 focus:outline-none focus:ring-0 text-base"
        />

        {/* Tool buttons */}
        <div className="flex items-center gap-1 bg-sage-50 rounded-xl p-1 ml-2">
          <button
            onClick={() => setTool("select")}
            className={cn("p-1.5 rounded-lg transition-all", tool === "select" ? "bg-white shadow-soft text-primary" : "text-text-muted hover:text-text-dark")}
            title="Seleksi (S)"
          >
            <MousePointer className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool("paint-sunny")}
            className={cn("p-1.5 rounded-lg transition-all", tool === "paint-sunny" ? "bg-sun-yellow shadow-soft text-amber-900" : "text-text-muted hover:text-amber-500")}
            title="Zona Sinar Penuh"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool("paint-partial")}
            className={cn("p-1.5 rounded-lg transition-all", tool === "paint-partial" ? "bg-orange-200 shadow-soft text-orange-900" : "text-text-muted hover:text-orange-400")}
            title="Zona Sebagian"
          >
            <Cloud className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool("paint-shaded")}
            className={cn("p-1.5 rounded-lg transition-all", tool === "paint-shaded" ? "bg-shade-blue shadow-soft text-blue-900" : "text-text-muted hover:text-blue-400")}
            title="Zona Teduh"
          >
            <CloudOff className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIdx === 0}
            className="p-2 rounded-lg text-text-muted hover:text-text-dark hover:bg-sage-50 disabled:opacity-30 transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIdx === history.length - 1}
            className="p-2 rounded-lg text-text-muted hover:text-text-dark hover:bg-sage-50 disabled:opacity-30 transition-all"
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <Button size="sm" onClick={handleSave}>
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Simpan</span>
        </Button>
      </div>

      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Plant palette */}
        <aside
          className={cn(
            "bg-white border-r border-border flex-shrink-0 flex flex-col transition-all duration-300",
            sidebarOpen ? "w-52" : "w-0 overflow-hidden"
          )}
        >
          <div className="p-3 border-b border-border">
            <p className="text-xs font-semibold text-text-muted uppercase mb-2">Pilih Tanaman</p>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
              <input
                type="text"
                placeholder="Cari..."
                value={paletteSearch}
                onChange={(e) => setPaletteSearch(e.target.value)}
                className="w-full h-8 pl-7 pr-3 text-xs rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {filteredPalette.map((plant) => (
              <DraggablePlantItem key={plant.id} plant={plant} />
            ))}
          </div>
        </aside>

        {/* Toggle sidebar button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="relative z-10 flex-shrink-0 w-5 bg-sage-50 hover:bg-sage-100 border-r border-border flex items-center justify-center transition-colors self-stretch"
        >
          {sidebarOpen ? <ChevronLeft className="w-3 h-3 text-text-muted" /> : <ChevronRight className="w-3 h-3 text-text-muted" />}
        </button>

        {/* Center: Grid canvas */}
        <div className="flex-1 overflow-auto bg-sage-50 p-4 md:p-6">
          <div className="flex flex-col items-center justify-start min-h-full">
            {/* Canvas header */}
            <div className="mb-3 flex items-center gap-4 text-xs text-text-muted flex-wrap">
              <span>{layout.widthM}m × {layout.heightM}m</span>
              <span>{layout.plants.length} tanaman</span>
              <div className="flex items-center gap-2">
                {(["sunny", "partial", "shaded"] as const).map((z) => (
                  <span key={z} className={cn("px-2 py-0.5 rounded-full border text-[10px]", sunColors[z])}>
                    {sunLabels[z]}
                  </span>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div
              className="border border-border rounded-xl overflow-hidden shadow-soft bg-white"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, minmax(40px, 60px))`,
                gridTemplateRows: `repeat(${rows}, minmax(40px, 60px))`,
                gap: "1px",
                backgroundColor: "#E5E0D5",
              }}
            >
              {Array.from({ length: rows }).map((_, row) =>
                Array.from({ length: cols }).map((_, col) => {
                  const placed = layout.plants.find((p) => p.col === col && p.row === row);
                  const zone = layout.sunZones.find((z) => z.col === col && z.row === row);
                  return (
                    <GridCell
                      key={`${col}-${row}`}
                      col={col}
                      row={row}
                      placedPlant={placed}
                      sunZone={zone}
                      isSelected={selectedPlantId === placed?.id}
                      tool={tool}
                      onCellClick={handleCellClick}
                      onDrop={() => {}}
                    />
                  );
                })
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 text-[10px] text-text-muted flex items-center gap-1">
              <span>1 sel = {layout.cellSizeCm}cm × {layout.cellSizeCm}cm</span>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeDragPlant && (
            <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-primary shadow-card opacity-90">
              <img
                src={activeDragPlant.imageUrl}
                alt={activeDragPlant.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=60&h=60&fit=crop`;
                }}
              />
            </div>
          )}
        </DragOverlay>

        {/* Right: Properties panel */}
        <aside className="hidden lg:flex w-52 bg-white border-l border-border flex-shrink-0 flex-col p-4">
          {selectedPlantData ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-text-muted uppercase">Properti</p>
                <button onClick={() => setSelectedPlantId(null)}>
                  <X className="w-4 h-4 text-text-muted" />
                </button>
              </div>
              <div className="w-full h-28 rounded-xl overflow-hidden mb-3">
                <img
                  src={selectedPlantData.imageUrl}
                  alt={selectedPlantData.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=150&fit=crop`;
                  }}
                />
              </div>
              <p className="font-semibold text-text-dark text-sm">{selectedPlantData.name}</p>
              <p className="text-xs text-text-muted italic mb-3">{selectedPlantData.latinName}</p>
              <div className="space-y-2 text-xs text-text-muted">
                <p>Jarak tanam: <strong className="text-text-dark">{selectedPlantData.spacingCm}cm</strong></p>
                <p>Panen: <strong className="text-text-dark">{selectedPlantData.timeToHarvestDays} hari</strong></p>
                <p>Kesulitan: <strong className="text-text-dark">{"★".repeat(selectedPlantData.difficulty)}</strong></p>
              </div>
              <button
                onClick={removeSelectedPlant}
                className="mt-4 w-full flex items-center justify-center gap-2 p-2 rounded-xl border border-red-200 text-red-600 text-xs font-medium hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Hapus dari Layout
              </button>
            </div>
          ) : (
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-3">Info Canvas</p>
              <div className="space-y-2 text-xs text-text-muted">
                <p>Ukuran: <strong className="text-text-dark">{layout.widthM} × {layout.heightM} m</strong></p>
                <p>Sel: <strong className="text-text-dark">{cols} × {rows}</strong></p>
                <p>Tanaman: <strong className="text-text-dark">{layout.plants.length}</strong></p>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-xs font-semibold text-text-muted uppercase mb-2">Mode</p>
                <div className="space-y-1.5">
                  {[
                    { mode: "select" as ToolMode, icon: MousePointer, label: "Pilih & Edit" },
                    { mode: "paint-sunny" as ToolMode, icon: Sun, label: "Zona Sinar Penuh" },
                    { mode: "paint-partial" as ToolMode, icon: Cloud, label: "Zona Sebagian" },
                    { mode: "paint-shaded" as ToolMode, icon: CloudOff, label: "Zona Teduh" },
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setTool(mode)}
                      className={cn(
                        "w-full flex items-center gap-2 p-2 rounded-xl text-xs transition-all text-left",
                        tool === mode ? "bg-primary/10 text-primary font-medium" : "text-text-muted hover:bg-sage-50"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </aside>
      </div>
      </DndContext>
    </div>
  );
}
