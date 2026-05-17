"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Grid3X3, Calendar, Trash2, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts";
import { getLayouts, deleteLayout } from "@/lib/storage";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";
import type { Layout } from "@/types";

export default function PlannerListPage() {
  const { user } = useAuth();
  const [layouts, setLayouts] = useState<Layout[]>([]);

  useEffect(() => {
    if (!user) return;
    setLayouts(getLayouts(user.id));
  }, [user]);

  function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus layout "${name}"?`)) return;
    deleteLayout(id);
    setLayouts((prev) => prev.filter((l) => l.id !== id));
    toast.success("Layout dihapus.");
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">Perencana Layout</h1>
          <p className="text-text-muted mt-1">Rancang tata letak kebunmu secara visual</p>
        </div>
        <Button asChild>
          <Link href="/planner/new">
            <Plus className="w-4 h-4" />
            Buat Layout
          </Link>
        </Button>
      </div>

      {layouts.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl py-20 text-center">
          <div className="text-5xl mb-4">🌿</div>
          <h3 className="text-xl font-bold text-text-dark mb-2">Belum ada layout</h3>
          <p className="text-text-muted mb-6 max-w-sm mx-auto">
            Buat layout pertamamu untuk merencanakan tata letak kebun secara visual.
          </p>
          <Button asChild>
            <Link href="/planner/new">
              <Plus className="w-4 h-4" />
              Buat Layout Baru
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {layouts.map((layout) => (
            <div
              key={layout.id}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all group"
            >
              {/* Thumbnail */}
              <Link href={`/planner/${layout.id}`}>
                <div className="h-40 bg-sage-50 flex items-center justify-center relative overflow-hidden">
                  {layout.thumbnail ? (
                    <img src={layout.thumbnail} alt={layout.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <Grid3X3 className="w-10 h-10 text-sage-200 mx-auto mb-2" />
                      <p className="text-xs text-text-muted">{layout.widthM}m × {layout.heightM}m</p>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-text-dark/0 group-hover:bg-text-dark/5 transition-colors" />
                </div>
              </Link>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-text-dark">{layout.name}</h3>
                    <p className="text-xs text-text-muted capitalize">{layout.spaceType} · {layout.widthM}m × {layout.heightM}m</p>
                  </div>
                  <div className="flex gap-1">
                    <Link
                      href={`/planner/${layout.id}`}
                      className="p-1.5 rounded-lg text-text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(layout.id, layout.name)}
                      className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                  <Calendar className="w-3 h-3" />
                  <span>Diperbarui {formatDate(layout.updatedAt)}</span>
                </div>
                <p className="text-xs text-text-muted mt-1">
                  {layout.plants.length} tanaman
                </p>
              </div>
            </div>
          ))}

          {/* Add new card */}
          <Link href="/planner/new">
            <div className="border-2 border-dashed border-border rounded-2xl h-full min-h-[200px] flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all group cursor-pointer">
              <div className="w-12 h-12 rounded-2xl bg-sage-50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-text-muted group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm text-text-muted group-hover:text-primary font-medium transition-colors">Buat Layout Baru</p>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
