"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Sun, Cloud, CloudOff, Droplets, Clock, Ruler, Star, Plus,
  ChevronLeft, ChevronRight, Leaf, AlertTriangle, Play, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth, useLang } from "@/lib/contexts";
import { savePlantInGarden, getPlantsInGarden } from "@/lib/storage";
import { generateTasksForPlant } from "@/lib/scheduler";
import { saveTasks, getTasks } from "@/lib/storage";
import { generateId, todayISO } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import plantsData from "@/data/plants.json";
import type { Plant, PlantInGarden } from "@/types";

const lightMap = {
  full: { label: "Sinar Penuh (>6 jam)", icon: Sun, color: "text-amber-500" },
  partial: { label: "Sebagian (3-6 jam)", icon: Cloud, color: "text-sky-500" },
  shade: { label: "Teduh (<3 jam)", icon: CloudOff, color: "text-slate-400" },
};

const diffLabels = ["", "Sangat Mudah", "Mudah", "Sedang", "Sulit", "Sangat Sulit"];

export default function PlantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useLang();
  const [imgIdx, setImgIdx] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [plantingDate, setPlantingDate] = useState(todayISO());
  const [alreadyAdded, setAlreadyAdded] = useState(false);

  const plant = (plantsData as Plant[]).find((p) => p.id === id);

  useEffect(() => {
    if (!user || !plant) return;
    const pigs = getPlantsInGarden(user.id);
    setAlreadyAdded(pigs.some((p) => p.plantId === plant.id));
  }, [user, plant]);

  if (!plant) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">🌿</div>
        <h2 className="text-xl font-bold text-text-dark mb-2">Tanaman tidak ditemukan</h2>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  const images = plant.images ?? [plant.imageUrl];
  const light = lightMap[plant.lightRequirement];
  const companions = (plantsData as Plant[]).filter((p) => plant.companionPlants.includes(p.id));
  const related = (plantsData as Plant[]).filter((p) => p.category === plant.category && p.id !== plant.id).slice(0, 4);

  function handleAddToGarden() {
    if (!user || !plant) {
      toast.error("Masuk terlebih dahulu untuk menambahkan tanaman.");
      return;
    }
    const pig: PlantInGarden = {
      id: generateId(),
      userId: user.id,
      plantId: plant.id,
      plantingDate,
      growthStage: "seedling",
    };
    savePlantInGarden(pig);

    const existingTasks = getTasks(user.id);
    const newTasks = generateTasksForPlant(pig, plant, user.id);
    saveTasks([...existingTasks, ...newTasks]);

    setAlreadyAdded(true);
    setShowModal(false);
    toast.success(`${plant.name} ditambahkan ke kebunmu! 🌱`);
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-muted hover:text-text-dark transition-colors mb-5 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Database Tanaman
      </button>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div className="space-y-3">
          <div className="relative rounded-2xl overflow-hidden bg-sage-50 h-72 sm:h-80">
            <img
              src={images[imgIdx]}
              alt={plant.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop`;
              }}
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={cn("w-2 h-2 rounded-full transition-all", i === imgIdx ? "bg-white" : "bg-white/50")}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={cn("w-16 h-16 rounded-xl overflow-hidden border-2 transition-all", i === imgIdx ? "border-primary" : "border-border")}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop`;
                  }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <Badge className="mb-2 capitalize">{plant.category}</Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">{plant.name}</h1>
              <p className="text-text-muted italic">{plant.latinName}</p>
            </div>
          </div>

          <p className="text-text-dark text-sm leading-relaxed mb-5">{plant.description}</p>

          {/* Quick facts */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-sage-50">
              <light.icon className={cn("w-5 h-5 flex-shrink-0", light.color)} />
              <div>
                <p className="text-xs text-text-muted">Cahaya</p>
                <p className="text-xs font-semibold text-text-dark">{light.label}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-sage-50">
              <Droplets className="w-5 h-5 text-sky-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-text-muted">Siram</p>
                <p className="text-xs font-semibold text-text-dark">Tiap {plant.waterFrequency} hari</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-sage-50">
              <Ruler className="w-5 h-5 text-violet-500 flex-shrink-0" />
              <div>
                <p className="text-xs text-text-muted">Jarak Tanam</p>
                <p className="text-xs font-semibold text-text-dark">{plant.spacingCm} cm</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-sage-50">
              <Clock className="w-5 h-5 text-accent flex-shrink-0" />
              <div>
                <p className="text-xs text-text-muted">Waktu Panen</p>
                <p className="text-xs font-semibold text-text-dark">{plant.timeToHarvestDays} hari</p>
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-sage-50">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className={cn("w-4 h-4", i <= plant.difficulty ? "fill-sun-yellow text-sun-yellow" : "text-border")} />
              ))}
            </div>
            <span className="text-sm text-text-dark font-medium">{diffLabels[plant.difficulty]}</span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {alreadyAdded ? (
              <Button variant="secondary" className="flex-1" disabled>
                <Leaf className="w-4 h-4" />
                Sudah di Kebun
              </Button>
            ) : (
              <Button className="flex-1" onClick={() => setShowModal(true)}>
                <Plus className="w-4 h-4" />
                Tambah ke Kebunku
              </Button>
            )}
            <Button variant="outline" asChild>
              <Link href="/planner/new">
                Tambah ke Layout
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-8">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="planting">Cara Menanam</TabsTrigger>
            <TabsTrigger value="care">Perawatan</TabsTrigger>
            <TabsTrigger value="problems">Masalah Umum</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-text-dark mb-3">Tentang {plant.name}</h3>
              <p className="text-sm text-text-dark leading-relaxed">{plant.description}</p>
              {plant.season && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-text-muted">
                    <strong className="text-text-dark">Musim tanam ideal:</strong> {plant.season}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="planting">
            <div className="bg-white rounded-2xl border border-border p-5">
              <h3 className="font-semibold text-text-dark mb-4">Langkah Menanam</h3>
              <ol className="space-y-3">
                {plant.plantingSteps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <p className="text-sm text-text-dark">{step}</p>
                  </li>
                ))}
              </ol>
            </div>
          </TabsContent>

          <TabsContent value="care">
            <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
              <h3 className="font-semibold text-text-dark mb-2">Instruksi Perawatan</h3>
              {Object.entries(plant.careInstructions).map(([key, value]) => {
                const labels: Record<string, string> = { watering: "Penyiraman", fertilizing: "Pemupukan", pruning: "Pemangkasan", harvesting: "Pemanenan" };
                const icons: Record<string, React.ReactNode> = {
                  watering: <Droplets className="w-4 h-4 text-sky-500" />,
                  fertilizing: <Star className="w-4 h-4 text-amber-500" />,
                  pruning: <Leaf className="w-4 h-4 text-emerald-500" />,
                  harvesting: <Clock className="w-4 h-4 text-accent" />,
                };
                return (
                  <div key={key} className="flex gap-3">
                    <div className="w-8 h-8 rounded-xl bg-sage-50 flex items-center justify-center flex-shrink-0">
                      {icons[key]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text-dark">{labels[key] ?? key}</p>
                      <p className="text-sm text-text-muted mt-0.5">{value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="problems">
            <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
              <h3 className="font-semibold text-text-dark mb-2">Masalah Umum & Solusi</h3>
              {plant.commonProblems.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-900">{item.problem}</p>
                      <p className="text-sm text-amber-700 mt-0.5">{item.solution}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Companion plants */}
      {companions.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-text-dark">Tanaman Pendamping</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hidden">
            {companions.map((c) => (
              <Link key={c.id} href={`/plants/${c.id}`}>
                <div className="flex-shrink-0 w-24 text-center">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-1.5 border border-border">
                    <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop`;
                    }} />
                  </div>
                  <p className="text-xs text-text-dark font-medium text-center leading-tight">{c.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Related plants */}
      {related.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-text-dark mb-4">Tanaman Serupa</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((p) => (
              <Link key={p.id} href={`/plants/${p.id}`}>
                <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-card transition-all">
                  <div className="h-28 overflow-hidden">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=150&fit=crop`;
                    }} />
                  </div>
                  <div className="p-2.5">
                    <p className="text-xs font-semibold text-text-dark">{p.name}</p>
                    <p className="text-[10px] text-text-muted">{p.timeToHarvestDays} hari panen</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Add to garden modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah ke Kebun</DialogTitle>
            <DialogDescription>Tentukan kapan kamu mulai menanam {plant.name}.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-sage-50">
              <img src={plant.imageUrl} alt={plant.name} className="w-14 h-14 rounded-xl object-cover" onError={(e) => {
                (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop`;
              }} />
              <div>
                <p className="font-semibold text-text-dark">{plant.name}</p>
                <p className="text-sm text-text-muted">{plant.latinName}</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Tanggal Mulai Tanam</label>
              <input
                type="date"
                value={plantingDate}
                onChange={(e) => setPlantingDate(e.target.value)}
                max={todayISO()}
                className="w-full h-10 rounded-lg border border-border px-3 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <p className="text-xs text-text-muted">
              Jadwal penyiraman, pemupukan, dan panen akan dibuat otomatis berdasarkan tanggal ini.
            </p>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowModal(false)}>Batal</Button>
              <Button className="flex-1" onClick={handleAddToGarden}>
                <Leaf className="w-4 h-4" />
                Tambahkan!
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
