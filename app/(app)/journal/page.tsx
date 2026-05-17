"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Camera, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/lib/contexts";
import { getJournalEntries, saveJournalEntry, deleteJournalEntry, getPlantsInGarden } from "@/lib/storage";
import { generateId, formatDate } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import plantsData from "@/data/plants.json";
import type { JournalEntry, PlantInGarden, Plant } from "@/types";

export default function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [pigs, setPigs] = useState<PlantInGarden[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], plantId: "", notes: "", photo: "" });

  useEffect(() => {
    if (!user) return;
    setEntries(getJournalEntries(user.id).sort((a, b) => b.date.localeCompare(a.date)));
    setPigs(getPlantsInGarden(user.id));
  }, [user]);

  const plants = plantsData as Plant[];

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm({ ...form, photo: ev.target?.result as string });
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!user || !form.notes.trim()) return;
    const entry: JournalEntry = {
      id: generateId(),
      userId: user.id,
      date: form.date,
      plantId: form.plantId || undefined,
      notes: form.notes.trim(),
      photo: form.photo || undefined,
      createdAt: new Date().toISOString(),
    };
    saveJournalEntry(entry);
    setEntries((prev) => [entry, ...prev].sort((a, b) => b.date.localeCompare(a.date)));
    setShowModal(false);
    setForm({ date: new Date().toISOString().split("T")[0], plantId: "", notes: "", photo: "" });
    toast.success("Catatan berhasil disimpan!");
  }

  function handleDelete(id: string) {
    if (!confirm("Hapus catatan ini?")) return;
    deleteJournalEntry(id);
    setEntries((prev) => prev.filter((e) => e.id !== id));
    toast.success("Catatan dihapus.");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">Jurnal Kebun</h1>
          <p className="text-text-muted mt-1">Catat perjalanan berkebunmu</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Tambah Catatan
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="border-2 border-dashed border-border rounded-3xl py-20 text-center">
          <div className="text-5xl mb-4">📓</div>
          <h3 className="text-xl font-bold text-text-dark mb-2">Jurnal masih kosong</h3>
          <p className="text-text-muted mb-6">Catat pengalaman, foto, dan catatan berkebunmu.</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Tambah Catatan Pertama
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => {
            const pig = pigs.find((p) => p.id === entry.plantInGardenId || p.plantId === entry.plantId);
            const plant = pig ? plants.find((p) => p.id === pig.plantId) : entry.plantId ? plants.find((p) => p.id === entry.plantId) : null;

            return (
              <div key={entry.id} className="bg-white rounded-2xl border border-border p-4 hover:shadow-soft transition-all">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-sage-50 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-dark">{formatDate(entry.date)}</p>
                      {plant && <p className="text-xs text-text-muted">{plant.name}</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1.5 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {entry.photo && (
                  <img
                    src={entry.photo}
                    alt="Foto kebun"
                    className="w-full h-48 object-cover rounded-xl mb-3"
                  />
                )}
                <p className="text-sm text-text-dark leading-relaxed">{entry.notes}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Add entry modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Catatan Jurnal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Tanggal</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full h-10 rounded-lg border border-border px-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Tanaman (opsional)</label>
              <select
                value={form.plantId}
                onChange={(e) => setForm({ ...form, plantId: e.target.value })}
                className="w-full h-10 rounded-lg border border-border px-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">Tidak terkait tanaman tertentu</option>
                {pigs.map((pig) => {
                  const plant = plants.find((p) => p.id === pig.plantId);
                  return plant ? (
                    <option key={pig.id} value={plant.id}>{plant.name}</option>
                  ) : null;
                })}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Foto (opsional)</label>
              <label className="flex flex-col items-center justify-center gap-2 h-20 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary hover:bg-sage-50 transition-all">
                {form.photo ? (
                  <img src={form.photo} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                ) : (
                  <>
                    <Camera className="w-5 h-5 text-text-muted" />
                    <span className="text-xs text-text-muted">Upload foto</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Catatan</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Tulis catatan berkebunmu di sini..."
                rows={4}
                className="w-full rounded-xl border border-border px-3 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Batal</Button>
              <Button className="flex-1" onClick={handleSave} disabled={!form.notes.trim()}>Simpan</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
