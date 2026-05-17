"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ChevronRight, Droplets, Sparkles, Flame, CheckCircle2, Leaf, Grid3X3, Sprout, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth, useLang } from "@/lib/contexts";
import { getPlantsInGarden, getLayouts, getTasks, saveTask } from "@/lib/storage";
import { getTimeOfDay, daysSince, todayISO } from "@/lib/utils";
import { getRecommendations } from "@/lib/recommendations";
import { getTodayTasks, getOverdueTasks } from "@/lib/scheduler";
import { toast } from "sonner";
import type { PlantInGarden, Task } from "@/types";
import plantsData from "@/data/plants.json";
import tipsData from "@/data/tips.json";

const taskIcons: Record<string, React.ReactNode> = {
  water: <Droplets className="w-4 h-4 text-sky-500" />,
  fertilize: <Sparkles className="w-4 h-4 text-amber-500" />,
  prune: <Leaf className="w-4 h-4 text-emerald-500" />,
  harvest: <Flame className="w-4 h-4 text-accent" />,
};

const taskLabels: Record<string, string> = {
  water: "Siram",
  fertilize: "Pupuk",
  prune: "Pangkas",
  harvest: "Panen",
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const [loading, setLoading] = useState(true);
  const [plants, setPlants] = useState<PlantInGarden[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [layoutCount, setLayoutCount] = useState(0);
  const [tip, setTip] = useState(tipsData[0]);

  useEffect(() => {
    if (!user) return;
    const pigs = getPlantsInGarden(user.id);
    const allTasks = getTasks(user.id);
    const layouts = getLayouts(user.id);
    setPlants(pigs);
    setTasks(allTasks);
    setLayoutCount(layouts.length);
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setTip(tipsData[dayOfYear % tipsData.length]);
    setLoading(false);
  }, [user]);

  const timeOfDay = getTimeOfDay();
  const greetings: Record<string, string> = {
    pagi: "Selamat Pagi",
    siang: "Selamat Siang",
    sore: "Selamat Sore",
    malam: "Selamat Malam",
  };
  const greeting = greetings[timeOfDay];

  const todayTasks = getTodayTasks(tasks);
  const overdueTasks = getOverdueTasks(tasks);
  const allDueTasks = [...overdueTasks, ...todayTasks].slice(0, 5);

  const recommendations = user?.assessment
    ? getRecommendations(plantsData as never, user.assessment, 3)
    : [];

  function completeTask(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updated = { ...task, completed: true, completedAt: new Date().toISOString() };
    saveTask(updated);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    toast.success("Tugas selesai! 🎉");
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Greeting */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">
            {greeting}, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-text-muted mt-1">
            {plants.length === 0
              ? "Mulai perjalanan berkebunmu hari ini."
              : `Kamu punya ${plants.length} tanaman di kebun.`}
          </p>
        </div>
        <Button asChild>
          <Link href="/plants">
            <Plus className="w-4 h-4" />
            Tambah
          </Link>
        </Button>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Tanaman Aktif", value: plants.length, icon: Sprout, color: "text-primary bg-primary/10" },
          { label: "Layout Saya", value: layoutCount, icon: Grid3X3, color: "text-accent bg-accent/10" },
          { label: "Tugas Hari Ini", value: todayTasks.length, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50" },
          { label: "Terlambat", value: overdueTasks.length, icon: Flame, color: overdueTasks.length > 0 ? "text-red-500 bg-red-50" : "text-text-muted bg-sage-50" },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold text-text-dark">{stat.value}</p>
                <p className="text-xs text-text-muted">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's tasks */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Tugas Hari Ini</CardTitle>
              <Link href="/calendar" className="text-xs text-primary hover:underline flex items-center gap-1">
                Lihat semua <ChevronRight className="w-3 h-3" />
              </Link>
            </CardHeader>
            <CardContent className="pt-3">
              {allDueTasks.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <p className="text-text-muted text-sm">Tidak ada tugas hari ini!</p>
                  <p className="text-xs text-text-muted mt-1">Tambah tanaman untuk mendapat jadwal perawatan.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {allDueTasks.map((task) => {
                    const plant = plantsData.find((p) => p.id === task.plantId);
                    const isOverdue = task.dueDate < todayISO();
                    return (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-sage-50 hover:bg-sage-100 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-soft">
                          {taskIcons[task.type] ?? <Leaf className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-dark">
                            {taskLabels[task.type]} — {plant?.name ?? "Tanaman"}
                          </p>
                          {isOverdue && (
                            <Badge variant="danger" className="text-[10px] mt-0.5">Terlambat</Badge>
                          )}
                        </div>
                        <button
                          onClick={() => completeTask(task.id)}
                          className="w-7 h-7 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all flex-shrink-0"
                          title="Tandai selesai"
                        >
                          <CheckCircle2 className="w-4 h-4 text-border hover:text-primary" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {plants.length === 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/plants">
                      <Plus className="w-4 h-4" />
                      Tambah tanaman pertamamu
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Daily tip */}
          <Card className="bg-primary text-white border-0">
            <CardContent className="pt-5">
              <p className="text-xs text-white/70 font-semibold uppercase tracking-wider mb-2">💡 Tip Hari Ini</p>
              <p className="text-sm leading-relaxed">{tip.text}</p>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {[
                { href: "/plants", icon: Leaf, label: "Tambah Tanaman" },
                { href: "/planner/new", icon: Grid3X3, label: "Buat Layout" },
                { href: "/plants", icon: Sprout, label: "Jelajahi Tanaman" },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-sage-50 transition-colors group"
                >
                  <div className="w-7 h-7 rounded-lg bg-sage-50 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                    <action.icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm text-text-dark">{action.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-text-muted ml-auto" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text-dark">Rekomendasi untuk Kamu</h2>
            <Link href="/recommendations" className="text-xs text-primary hover:underline flex items-center gap-1">
              Lihat semua <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {recommendations.map(({ plant, score }) => (
              <Link key={plant.id} href={`/plants/${plant.id}`}>
                <Card className="overflow-hidden hover:shadow-card transition-shadow group cursor-pointer">
                  <div className="h-36 overflow-hidden">
                    <img
                      src={plant.imageUrl}
                      alt={plant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop`;
                      }}
                    />
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-semibold text-text-dark text-sm">{plant.name}</p>
                        <p className="text-xs text-text-muted">{plant.latinName}</p>
                      </div>
                      <Badge variant="success" className="flex-shrink-0 text-[10px]">
                        {score}% cocok
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty state if no assessment */}
      {!user?.assessment && (
        <Card className="border-dashed border-2">
          <CardContent className="py-10 text-center">
            <div className="text-4xl mb-3">🌱</div>
            <h3 className="font-bold text-text-dark mb-2">Lengkapi profilmu</h3>
            <p className="text-text-muted text-sm mb-4">
              Isi data kondisi lahan untuk mendapatkan rekomendasi tanaman yang personal.
            </p>
            <Button asChild>
              <Link href="/onboarding">Mulai Onboarding</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
