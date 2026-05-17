"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Droplets, Sparkles, Flame, Leaf, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/contexts";
import { getTasks, saveTask } from "@/lib/storage";
import { todayISO } from "@/lib/utils";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import plantsData from "@/data/plants.json";
import type { Task, Plant } from "@/types";

const taskIcons: Record<string, React.ReactNode> = {
  water: <Droplets className="w-3.5 h-3.5 text-sky-500" />,
  fertilize: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
  prune: <Leaf className="w-3.5 h-3.5 text-emerald-500" />,
  harvest: <Flame className="w-3.5 h-3.5 text-accent" />,
};

const taskLabels: Record<string, string> = {
  water: "Siram",
  fertilize: "Pupuk",
  prune: "Pangkas",
  harvest: "Panen",
  repot: "Repot",
};

const taskColors: Record<string, string> = {
  water: "bg-sky-400",
  fertilize: "bg-amber-400",
  prune: "bg-emerald-400",
  harvest: "bg-accent",
  repot: "bg-violet-400",
};

const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export default function CalendarPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(todayISO());

  useEffect(() => {
    if (!user) return;
    setTasks(getTasks(user.id));
  }, [user]);

  const plants = plantsData as Plant[];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tasksByDate = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    if (!acc[task.dueDate]) acc[task.dueDate] = [];
    acc[task.dueDate].push(task);
    return acc;
  }, {});

  const selectedTasks = (tasksByDate[selectedDate] ?? []).sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    return 0;
  });

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function completeTask(taskId: string) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updated = { ...task, completed: true, completedAt: new Date().toISOString() };
    saveTask(updated);
    setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
    toast.success("Tugas selesai! 🎉");
  }

  const today = todayISO();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">Kalender Perawatan</h1>
        <p className="text-text-muted mt-1">Jadwal penyiraman, pemupukan, dan panen</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-border p-5">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-sage-50 transition-colors">
              <ChevronLeft className="w-5 h-5 text-text-muted" />
            </button>
            <h2 className="text-lg font-bold text-text-dark">
              {MONTHS[month]} {year}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-sage-50 transition-colors">
              <ChevronRight className="w-5 h-5 text-text-muted" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-text-muted py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {/* Day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const dayTasks = tasksByDate[dateStr] ?? [];
              const incompleteTasks = dayTasks.filter((t) => !t.completed);
              const isToday = dateStr === today;
              const isSelected = dateStr === selectedDate;
              const isPast = dateStr < today;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className={cn(
                    "relative flex flex-col items-center p-1.5 rounded-xl min-h-[3rem] transition-all",
                    isSelected ? "bg-primary text-white" : isToday ? "bg-primary/10 text-primary" : "hover:bg-sage-50 text-text-dark",
                    isPast && !isSelected && "text-text-muted"
                  )}
                >
                  <span className="text-xs font-medium mb-1">{day}</span>
                  {incompleteTasks.length > 0 && (
                    <div className="flex flex-wrap gap-0.5 justify-center">
                      {incompleteTasks.slice(0, 3).map((task, ti) => (
                        <div
                          key={ti}
                          className={cn("w-1.5 h-1.5 rounded-full", isSelected ? "bg-white" : taskColors[task.type] ?? "bg-sage-300")}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-x-4 gap-y-2">
            {Object.entries(taskColors).map(([type, color]) => (
              <div key={type} className="flex items-center gap-1.5 text-xs text-text-muted">
                <div className={cn("w-2.5 h-2.5 rounded-full", color)} />
                {taskLabels[type]}
              </div>
            ))}
          </div>
        </div>

        {/* Task panel for selected day */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h3 className="font-semibold text-text-dark mb-1">
            {selectedDate === today ? "Hari Ini" : new Date(selectedDate + "T00:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" })}
          </h3>
          <p className="text-xs text-text-muted mb-4">{selectedTasks.length} tugas</p>

          {selectedTasks.length === 0 ? (
            <div className="py-6 text-center">
              <div className="text-2xl mb-2">🌿</div>
              <p className="text-text-muted text-sm">Tidak ada tugas</p>
            </div>
          ) : (
            <div className="space-y-2">
              {selectedTasks.map((task) => {
                const plant = plants.find((p) => p.id === task.plantId);
                return (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-xl transition-colors",
                      task.completed ? "bg-sage-50 opacity-60" : "bg-sage-50 hover:bg-sage-100"
                    )}
                  >
                    <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
                      {taskIcons[task.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-xs font-medium", task.completed ? "line-through text-text-muted" : "text-text-dark")}>
                        {taskLabels[task.type]} — {plant?.name}
                      </p>
                    </div>
                    {!task.completed && (
                      <button
                        onClick={() => completeTask(task.id)}
                        className="w-6 h-6 rounded-lg border-2 border-border hover:border-primary hover:bg-primary/5 flex items-center justify-center transition-all flex-shrink-0"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-border" />
                      </button>
                    )}
                    {task.completed && <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
