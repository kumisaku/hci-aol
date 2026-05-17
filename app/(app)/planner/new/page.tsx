"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Home, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlannerEditor } from "@/components/planner/PlannerEditor";
import { useAuth } from "@/lib/contexts";
import { generateId, todayISO } from "@/lib/utils";
import type { Layout } from "@/types";
import { cn } from "@/lib/utils";

const spaceOptions = [
  { value: "balkon", label: "Balkon", icon: Building2, emoji: "🏢" },
  { value: "teras", label: "Teras", icon: Home, emoji: "🏠" },
  { value: "halaman", label: "Halaman", icon: Trees, emoji: "🌳" },
  { value: "indoor", label: "Indoor", icon: Home, emoji: "🪴" },
];

export default function NewPlannerPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showSetup, setShowSetup] = useState(true);
  const [setup, setSetup] = useState({
    name: "Kebun Balkonku",
    spaceType: "balkon",
    widthM: 3,
    heightM: 2,
  });
  const [layout, setLayout] = useState<Layout | null>(null);

  function createLayout() {
    if (!user) return;
    const newLayout: Layout = {
      id: generateId(),
      userId: user.id,
      name: setup.name,
      spaceType: setup.spaceType,
      widthM: setup.widthM,
      heightM: setup.heightM,
      cellSizeCm: 30,
      plants: [],
      sunZones: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLayout(newLayout);
    setShowSetup(false);
  }

  if (!showSetup && layout) {
    return <PlannerEditor initialLayout={layout} isNew />;
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-dark">Buat Layout Baru</h1>
        <p className="text-text-muted mt-1">Atur dimensi dan jenis ruang kebunmu</p>
      </div>

      <div className="bg-white rounded-2xl border border-border p-6 space-y-5 shadow-soft">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Nama Layout</label>
          <input
            type="text"
            value={setup.name}
            onChange={(e) => setSetup({ ...setup, name: e.target.value })}
            className="w-full h-10 rounded-lg border border-border px-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Contoh: Kebun Balkonku"
          />
        </div>

        {/* Space type */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">Jenis Ruang</label>
          <div className="grid grid-cols-4 gap-2">
            {spaceOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSetup({ ...setup, spaceType: opt.value })}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded-xl border-2 text-center transition-all",
                  setup.spaceType === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-xs font-medium text-text-dark">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Lebar
              <span className="font-normal text-text-muted ml-1">({setup.widthM} m)</span>
            </label>
            <input
              type="range"
              min={1} max={10} step={0.5}
              value={setup.widthM}
              onChange={(e) => setSetup({ ...setup, widthM: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>1m</span><span>10m</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Panjang
              <span className="font-normal text-text-muted ml-1">({setup.heightM} m)</span>
            </label>
            <input
              type="range"
              min={1} max={10} step={0.5}
              value={setup.heightM}
              onChange={(e) => setSetup({ ...setup, heightM: parseFloat(e.target.value) })}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-text-muted mt-1">
              <span>1m</span><span>10m</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-sage-50 rounded-xl p-4 text-center">
          <p className="text-sm text-text-muted">Ukuran area</p>
          <p className="text-2xl font-bold text-primary mt-1">{setup.widthM} × {setup.heightM} m</p>
          <p className="text-xs text-text-muted mt-0.5">= {(setup.widthM * setup.heightM).toFixed(1)} m²</p>
        </div>

        <Button className="w-full" size="lg" onClick={createLayout} disabled={!setup.name.trim()}>
          Buat Layout
        </Button>
      </div>
    </div>
  );
}
