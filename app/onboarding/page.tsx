"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Leaf, ChevronLeft, ChevronRight, Sun, Cloud, CloudOff, Home, Building2, Trees, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/contexts";
import { saveUser } from "@/lib/storage";
import { cn } from "@/lib/utils";
import type { LandAssessment } from "@/types";
import cities from "@/data/cities.json";

const TOTAL_STEPS = 5;

const spaceOptions = [
  { value: "balkon", label: "Balkon", icon: Building2, emoji: "🏢", desc: "Balkon apartemen atau rumah susun" },
  { value: "teras", label: "Teras", icon: Home, emoji: "🏠", desc: "Teras depan atau belakang rumah" },
  { value: "halaman", label: "Halaman Kecil", icon: Trees, emoji: "🌳", desc: "Halaman kecil yang terbatas" },
  { value: "indoor", label: "Indoor", icon: Home, emoji: "🪴", desc: "Di dalam ruangan dengan cahaya buatan" },
];

const sunOptions = [
  { value: "full", label: "Sinar Penuh", icon: Sun, desc: "Lebih dari 6 jam sinar matahari", color: "text-amber-500 bg-amber-50 border-amber-200" },
  { value: "partial", label: "Sebagian Teduh", icon: Cloud, desc: "3–6 jam sinar matahari", color: "text-sky-500 bg-sky-50 border-sky-200" },
  { value: "shade", label: "Teduh", icon: CloudOff, desc: "Kurang dari 3 jam sinar", color: "text-slate-500 bg-slate-50 border-slate-200" },
];

const expOptions = [
  { value: "pemula", label: "Pemula", emoji: "🌱", desc: "Baru pertama kali berkebun" },
  { value: "menengah", label: "Menengah", emoji: "🌿", desc: "Pernah berkebun sebelumnya" },
  { value: "berpengalaman", label: "Berpengalaman", emoji: "🌳", desc: "Sudah sering berkebun" },
];

const goalOptions = [
  { value: "sayur", label: "Sayuran", emoji: "🥬" },
  { value: "buah", label: "Buah-buahan", emoji: "🍓" },
  { value: "herbal", label: "Tanaman Herbal", emoji: "🌿" },
  { value: "hias", label: "Tanaman Hias", emoji: "🌸" },
];

export default function OnboardingPage() {
  const { user, setUser, refreshUser } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [assessment, setAssessment] = useState<Partial<LandAssessment>>({
    spaceType: undefined,
    sunlight: undefined,
    areaSqm: 2,
    experienceLevel: undefined,
    goals: [],
  });
  const [city, setCity] = useState(user?.city ?? "");

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  function next() {
    if (step < TOTAL_STEPS) setStep(step + 1);
    else finish();
  }

  function back() {
    if (step > 1) setStep(step - 1);
  }

  function skip() {
    router.push("/dashboard");
  }

  function finish() {
    if (!user) return;
    const updated = {
      ...user,
      city: city || user.city,
      assessment: assessment as LandAssessment,
      onboardingCompleted: true,
    };
    saveUser(updated);
    setUser(updated);
    router.push("/dashboard");
  }

  function toggleGoal(g: string) {
    const goals = assessment.goals ?? [];
    const newGoals = goals.includes(g as never)
      ? goals.filter((x) => x !== g)
      : [...goals, g as never];
    setAssessment({ ...assessment, goals: newGoals as LandAssessment["goals"] });
  }

  const canNext = (() => {
    if (step === 2) return !!city;
    if (step === 3) return !!assessment.spaceType;
    if (step === 4) return !!assessment.sunlight;
    if (step === 5) return !!assessment.experienceLevel && (assessment.goals?.length ?? 0) > 0;
    return true;
  })();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-8 pt-6 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-primary-dark">EcoPath</span>
        </div>
        <button
          onClick={skip}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-text-dark transition-colors"
        >
          Lewati <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="px-4 sm:px-8 mt-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-text-muted">Langkah {step} dari {TOTAL_STEPS}</span>
            <span className="text-xs text-primary font-medium">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg animate-slide-up">
          {/* Step 1 */}
          {step === 1 && (
            <div className="text-center">
              <div className="text-5xl mb-4">👋</div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-dark mb-3">
                Halo, {user?.name?.split(" ")[0]}!
              </h1>
              <p className="text-text-muted mb-8 text-lg">
                Mari kenali lahanmu agar kami bisa memberikan rekomendasi tanaman terbaik.
              </p>
              <div className="bg-white rounded-2xl border border-border p-6 text-left shadow-soft">
                <p className="font-semibold text-text-dark mb-3">Dalam 4 langkah singkat, kamu akan:</p>
                <ul className="space-y-2 text-sm text-text-muted">
                  {["Ceritakan jenis ruang yang kamu miliki", "Tentukan kondisi cahaya", "Atur luas area", "Pilih tujuan berkebun"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-bold">
                        {i + 1}
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Step 2: City */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-2">Di mana kamu tinggal?</h2>
              <p className="text-text-muted mb-8">Kami gunakan untuk menyesuaikan rekomendasi dengan iklim setempat.</p>
              <div className="bg-white rounded-2xl border border-border p-6 shadow-soft">
                <label className="block text-sm font-medium text-text-dark mb-2">Pilih kota</label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih kota kamu" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c.value} value={c.label}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Step 3: Space type */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-2">Jenis ruang yang kamu miliki?</h2>
              <p className="text-text-muted mb-6">Pilih yang paling sesuai dengan situasimu.</p>
              <div className="grid grid-cols-2 gap-3">
                {spaceOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setAssessment({ ...assessment, spaceType: opt.value as LandAssessment["spaceType"] })}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 text-center transition-all",
                      assessment.spaceType === opt.value
                        ? "border-primary bg-primary/5"
                        : "border-border bg-white hover:border-primary/40"
                    )}
                  >
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="font-semibold text-text-dark text-sm">{opt.label}</span>
                    <span className="text-xs text-text-muted">{opt.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Sunlight & area */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-2">Kondisi cahaya & luas area</h2>
              <p className="text-text-muted mb-6">Ini membantu kami merekomendasikan tanaman yang tepat.</p>

              <div className="space-y-4">
                {/* Sunlight */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-soft">
                  <p className="font-semibold text-text-dark mb-3">Berapa jam sinar matahari per hari?</p>
                  <div className="flex flex-col gap-2">
                    {sunOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAssessment({ ...assessment, sunlight: opt.value as LandAssessment["sunlight"] })}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all",
                          assessment.sunlight === opt.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <div className={cn("w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0", opt.color)}>
                          <opt.icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-text-dark text-sm">{opt.label}</p>
                          <p className="text-xs text-text-muted">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Area */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-soft">
                  <div className="flex items-center justify-between mb-3">
                    <p className="font-semibold text-text-dark">Perkiraan luas area</p>
                    <span className="text-primary font-bold">{assessment.areaSqm} m²</span>
                  </div>
                  <input
                    type="range"
                    min={0.5}
                    max={20}
                    step={0.5}
                    value={assessment.areaSqm ?? 2}
                    onChange={(e) => setAssessment({ ...assessment, areaSqm: parseFloat(e.target.value) })}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-1">
                    <span>0.5 m²</span>
                    <span>20 m²</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Experience & goals */}
          {step === 5 && (
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-dark mb-2">Pengalaman & tujuan berkebun</h2>
              <p className="text-text-muted mb-6">Hampir selesai! Ceritakan sedikit tentang dirimu.</p>

              <div className="space-y-4">
                {/* Experience */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-soft">
                  <p className="font-semibold text-text-dark mb-3">Level pengalamanmu</p>
                  <div className="grid grid-cols-3 gap-2">
                    {expOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setAssessment({ ...assessment, experienceLevel: opt.value as LandAssessment["experienceLevel"] })}
                        className={cn(
                          "flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all",
                          assessment.experienceLevel === opt.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <span className="text-2xl">{opt.emoji}</span>
                        <span className="text-xs font-semibold text-text-dark">{opt.label}</span>
                        <span className="text-[10px] text-text-muted text-center">{opt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Goals */}
                <div className="bg-white rounded-2xl border border-border p-5 shadow-soft">
                  <p className="font-semibold text-text-dark mb-3">Apa tujuan berkebunmu? <span className="text-text-muted font-normal text-sm">(pilih semua yang sesuai)</span></p>
                  <div className="grid grid-cols-2 gap-2">
                    {goalOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => toggleGoal(opt.value)}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                          (assessment.goals ?? []).includes(opt.value as never)
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        )}
                      >
                        <span className="text-xl">{opt.emoji}</span>
                        <span className="text-sm font-medium text-text-dark">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8">
            <Button
              variant="outline"
              onClick={back}
              disabled={step === 1}
              className="gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Kembali
            </Button>
            <Button
              onClick={step === TOTAL_STEPS ? finish : next}
              disabled={!canNext}
              className="gap-2"
            >
              {step === TOTAL_STEPS ? "Mulai Berkebun! 🌱" : "Selanjutnya"}
              {step < TOTAL_STEPS && <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
