"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Droplets, Sparkles, Clock, Trash2, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/lib/contexts";
import { getPlantsInGarden, removePlantFromGarden, getTasks, savePlantInGarden, saveTasks, getTasks as getTasksFn } from "@/lib/storage";
import { deleteTasksByPlantInGarden } from "@/lib/storage";
import { generateTasksForPlant } from "@/lib/scheduler";
import { generateId, daysSince, formatDate, todayISO } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import plantsData from "@/data/plants.json";
import type { PlantInGarden, Plant, Task } from "@/types";

const stageColors: Record<string, string> = {
  seedling: "bg-emerald-50 text-emerald-700",
  growing: "bg-sky-50 text-sky-700",
  mature: "bg-primary/10 text-primary",
  harvesting: "bg-accent/10 text-accent",
  done: "bg-sage-100 text-text-muted",
};

const stageLabels: Record<string, string> = {
  seedling: "Bibit",
  growing: "Tumbuh",
  mature: "Dewasa",
  harvesting: "Siap Panen",
  done: "Selesai",
};

export default function MyGardenPage() {
  const { user } = useAuth();
  const [pigs, setPigs] = useState<PlantInGarden[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedPig, setSelectedPig] = useState<PlantInGarden | null>(null);

  useEffect(() => {
    if (!user) return;
    setPigs(getPlantsInGarden(user.id));
    setTasks(getTasks(user.id));
  }, [user]);

  function handleRemove(pig: PlantInGarden) {
    if (!confirm(`Hapus ${plants.find((p) => p.id === pig.plantId)?.name ?? "tanaman"} dari kebunmu?`)) return;
    removePlantFromGarden(pig.id);
    deleteTasksByPlantInGarden(pig.id);
    setPigs((prev) => prev.filter((p) => p.id !== pig.id));
    setTasks((prev) => prev.filter((t) => t.plantInGardenId !== pig.id));
    toast.success("Tanaman dihapus dari kebun.");
    if (selectedPig?.id === pig.id) setSelectedPig(null);
  }

  function updateStage(pig: PlantInGarden, stage: PlantInGarden["growthStage"]) {
    const updated = { ...pig, growthStage: stage };
    savePlantInGarden(updated);
    setPigs((prev) => prev.map((p) => (p.id === pig.id ? updated : p)));
    if (selectedPig?.id === pig.id) setSelectedPig(updated);
  }

  const plants = plantsData as Plant[];
  const today = todayISO();

  function getNextTask(pigId: string): Task | undefined {
    return tasks
      .filter((t) => t.plantInGardenId === pigId && !t.completed)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))[0];
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">Kebunku</h1>
          <p className="text-text-muted mt-1">{pigs.length} tanaman aktif</p>
        </div>
        <Button asChild>
          <Link href="/plants">
            <Plus className="w-4 h-4" />
            Tambah Tanaman
          </Link>
        </Button>
      </div>

      {pigs.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl py-20 text-center">
          <div className="text-5xl mb-4">🌱</div>
          <h3 className="text-xl font-bold text-text-dark mb-2">Kebunmu masih kosong</h3>
          <p className="text-text-muted mb-6 max-w-sm mx-auto">
            Mulai dengan menambahkan tanaman pertamamu dari database tanaman.
          </p>
          <Button asChild>
            <Link href="/plants">
              <Plus className="w-4 h-4" />
              Jelajahi Tanaman
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pigs.map((pig) => {
            const plant = plants.find((p) => p.id === pig.plantId);
            if (!plant) return null;
            const nextTask = getNextTask(pig.id);
            const daysPlanted = daysSince(pig.plantingDate);
            const isOverdue = nextTask && nextTask.dueDate < today;

            return (
              <div
                key={pig.id}
                className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all cursor-pointer"
                onClick={() => setSelectedPig(pig)}
              >
                <div className="h-36 overflow-hidden relative">
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop`;
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", stageColors[pig.growthStage])}>
                      {stageLabels[pig.growthStage]}
                    </span>
                  </div>
                  {isOverdue && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Terlambat!
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-text-dark">{plant.name}</h3>
                  <p className="text-xs text-text-muted italic mb-2">{plant.latinName}</p>
                  <p className="text-xs text-text-muted mb-2">Ditanam {daysPlanted} hari lalu</p>
                  {nextTask && (
                    <div className={cn(
                      "flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg",
                      isOverdue ? "bg-red-50 text-red-700" : "bg-sage-50 text-text-muted"
                    )}>
                      {nextTask.type === "water" ? <Droplets className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                      <span>
                        {nextTask.type === "water" ? "Siram" : nextTask.type === "fertilize" ? "Pupuk" : "Panen"} —{" "}
                        {nextTask.dueDate === today ? "Hari ini" : formatDate(nextTask.dueDate)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plant detail modal */}
      <Dialog open={!!selectedPig} onOpenChange={() => setSelectedPig(null)}>
        <DialogContent className="max-w-sm">
          {selectedPig && (() => {
            const plant = plants.find((p) => p.id === selectedPig.plantId);
            if (!plant) return null;
            const pigTasks = tasks.filter((t) => t.plantInGardenId === selectedPig.id && !t.completed)
              .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
              .slice(0, 5);

            return (
              <>
                <DialogHeader>
                  <DialogTitle>{plant.name}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-full h-40 object-cover rounded-xl"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=200&fit=crop`;
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-muted">Tahap:</span>
                    <select
                      value={selectedPig.growthStage}
                      onChange={(e) => updateStage(selectedPig, e.target.value as PlantInGarden["growthStage"])}
                      className="text-sm border border-border rounded-lg px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/30"
                    >
                      {Object.entries(stageLabels).map(([k, v]) => (
                        <option key={k} value={k}>{v}</option>
                      ))}
                    </select>
                  </div>
                  <div className="text-sm text-text-muted">
                    <p>Ditanam: <strong className="text-text-dark">{formatDate(selectedPig.plantingDate)}</strong></p>
                    <p>Sudah {daysSince(selectedPig.plantingDate)} hari</p>
                  </div>
                  {pigTasks.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-text-muted uppercase mb-2">Tugas Mendatang</p>
                      <div className="space-y-1.5">
                        {pigTasks.map((task) => (
                          <div key={task.id} className={cn(
                            "flex items-center gap-2 text-xs px-3 py-2 rounded-xl",
                            task.dueDate < today ? "bg-red-50 text-red-700" : "bg-sage-50 text-text-muted"
                          )}>
                            {task.type === "water" ? <Droplets className="w-3.5 h-3.5" /> : task.type === "fertilize" ? <Sparkles className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                            <span className="flex-1 capitalize">{task.type === "water" ? "Siram" : task.type === "fertilize" ? "Pupuk" : task.type === "harvest" ? "Panen" : task.type}</span>
                            <span>{formatDate(task.dueDate)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/plants/${plant.id}`}>Lihat Detail</Link>
                    </Button>
                    <button
                      onClick={() => handleRemove(selectedPig)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Hapus
                    </button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
