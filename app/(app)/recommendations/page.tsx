"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, ChevronDown, ChevronUp, Sun, Cloud, CloudOff, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/contexts";
import { getRecommendations } from "@/lib/recommendations";
import { cn } from "@/lib/utils";
import plantsData from "@/data/plants.json";
import type { Plant } from "@/types";

const lightIcons = {
  full: <Sun className="w-3.5 h-3.5 text-amber-500" />,
  partial: <Cloud className="w-3.5 h-3.5 text-sky-500" />,
  shade: <CloudOff className="w-3.5 h-3.5 text-slate-400" />,
};

const categoryLabels: Record<string, string> = { sayur: "Sayuran", buah: "Buah", herbal: "Herbal", hias: "Hias" };

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-primary" : score >= 60 ? "bg-amber-400" : "bg-slate-300";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-sage-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-sm font-bold text-text-dark w-10 text-right">{score}%</span>
    </div>
  );
}

export default function RecommendationsPage() {
  const { user } = useAuth();
  const [filterCat, setFilterCat] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!user?.assessment) {
    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <div className="text-4xl mb-4">🌱</div>
        <h2 className="text-2xl font-bold text-text-dark mb-2">Lengkapi profil lahanmu</h2>
        <p className="text-text-muted mb-6">
          Untuk mendapatkan rekomendasi tanaman yang personal, kamu perlu mengisi data kondisi lahanmu terlebih dahulu.
        </p>
        <Button asChild>
          <Link href="/onboarding">Mulai Onboarding</Link>
        </Button>
      </div>
    );
  }

  const allRecs = getRecommendations(plantsData as Plant[], user.assessment, 30);
  const filtered = filterCat ? allRecs.filter((r) => r.plant.category === filterCat) : allRecs;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-dark mb-1">
          Rekomendasi untuk Kamu
        </h1>
        <p className="text-text-muted">
          Berdasarkan {user.assessment.spaceType} {user.assessment.areaSqm}m²
          dengan cahaya {user.assessment.sunlight === "full" ? "penuh" : user.assessment.sunlight === "partial" ? "sebagian" : "teduh"}.
        </p>
      </div>

      {/* Profile summary */}
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 mb-6 flex flex-wrap gap-2">
        {[
          { label: user.assessment.spaceType },
          { label: `${user.assessment.areaSqm}m²` },
          { label: user.assessment.sunlight === "full" ? "☀️ Sinar penuh" : user.assessment.sunlight === "partial" ? "⛅ Sebagian" : "☁️ Teduh" },
          { label: user.assessment.experienceLevel },
          ...(user.assessment.goals ?? []).map((g) => ({ label: categoryLabels[g] ?? g })),
        ].map((item, i) => (
          <Badge key={i} variant="default" className="capitalize">{item.label}</Badge>
        ))}
      </div>

      {/* Category filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <span className="flex items-center gap-1.5 text-sm text-text-muted mr-2">
          <Filter className="w-4 h-4" />
          Filter:
        </span>
        {["", "sayur", "buah", "herbal", "hias"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCat(cat)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition-all",
              filterCat === cat ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-border hover:border-primary"
            )}
          >
            {cat === "" ? "Semua" : categoryLabels[cat]}
          </button>
        ))}
      </div>

      {/* Recommendation list */}
      <div className="space-y-3">
        {filtered.map(({ plant, score, reasons }, idx) => (
          <div key={plant.id} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all">
            <div className="flex items-start gap-4 p-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sage-50 flex items-center justify-center text-sm font-bold text-text-muted">
                {idx + 1}
              </div>

              {/* Image */}
              <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={plant.imageUrl}
                  alt={plant.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop`;
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-text-dark">{plant.name}</h3>
                    <p className="text-xs text-text-muted italic">{plant.latinName}</p>
                  </div>
                  <Badge variant={score >= 80 ? "success" : score >= 60 ? "warning" : "secondary"} className="flex-shrink-0">
                    {score}% cocok
                  </Badge>
                </div>

                <ScoreBar score={score} />

                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-text-muted">
                  <span className="flex items-center gap-1">
                    {lightIcons[plant.lightRequirement]}
                    {plant.lightRequirement === "full" ? "Sinar penuh" : plant.lightRequirement === "partial" ? "Sebagian" : "Teduh"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    {["", "Sangat Mudah", "Mudah", "Sedang", "Sulit", "Sangat Sulit"][plant.difficulty]}
                  </span>
                  <span>🌾 {plant.timeToHarvestDays} hari panen</span>
                </div>
              </div>
            </div>

            {/* Why recommended - expandable */}
            <div className="border-t border-border">
              <button
                onClick={() => setExpandedId(expandedId === plant.id ? null : plant.id)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-text-muted hover:bg-sage-50 transition-colors"
              >
                <span>Mengapa direkomendasikan?</span>
                {expandedId === plant.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {expandedId === plant.id && (
                <div className="px-4 pb-3 animate-slide-up">
                  <ul className="space-y-1">
                    {reasons.map((reason, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-text-muted">
                        <span className="text-primary mt-0.5">✓</span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" asChild>
                      <Link href={`/plants/${plant.id}`}>Lihat Detail</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-10">
          <p className="text-text-muted">Tidak ada rekomendasi untuk kategori ini.</p>
          <Button variant="outline" className="mt-3" onClick={() => setFilterCat("")}>
            Tampilkan Semua
          </Button>
        </div>
      )}
    </div>
  );
}
