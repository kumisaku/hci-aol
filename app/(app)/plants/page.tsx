"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Filter, SlidersHorizontal, Sun, Cloud, CloudOff, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import plantsData from "@/data/plants.json";
import type { Plant } from "@/types";

const plants = plantsData as Plant[];

const lightIcons = {
  full: <Sun className="w-3.5 h-3.5 text-amber-500" />,
  partial: <Cloud className="w-3.5 h-3.5 text-sky-500" />,
  shade: <CloudOff className="w-3.5 h-3.5 text-slate-400" />,
};

const lightLabels = { full: "Sinar Penuh", partial: "Sebagian", shade: "Teduh" };
const categoryLabels: Record<string, string> = { sayur: "Sayuran", buah: "Buah", herbal: "Herbal", hias: "Hias" };
const categoryColors: Record<string, string> = {
  sayur: "bg-emerald-50 text-emerald-700",
  buah: "bg-rose-50 text-rose-700",
  herbal: "bg-violet-50 text-violet-700",
  hias: "bg-pink-50 text-pink-700",
};

function DifficultyStars({ n }: { n: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("w-3 h-3", i <= n ? "fill-sun-yellow text-sun-yellow" : "text-border")}
        />
      ))}
    </div>
  );
}

export default function PlantsPage() {
  const [search, setSearch] = useState("");
  const [filterLight, setFilterLight] = useState<string>("");
  const [filterCat, setFilterCat] = useState<string>("");
  const [filterDiff, setFilterDiff] = useState<number>(0);
  const [sort, setSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  const filtered = useMemo(() => {
    let result = plants.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.latinName.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterLight && p.lightRequirement !== filterLight) return false;
      if (filterCat && p.category !== filterCat) return false;
      if (filterDiff > 0 && p.difficulty > filterDiff) return false;
      return true;
    });

    if (sort === "popular") result = result.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
    else if (sort === "easiest") result = result.sort((a, b) => a.difficulty - b.difficulty);
    else if (sort === "fastest") result = result.sort((a, b) => a.timeToHarvestDays - b.timeToHarvestDays);

    return result;
  }, [search, filterLight, filterCat, filterDiff, sort]);

  const paged = filtered.slice(0, page * PER_PAGE);
  const hasMore = paged.length < filtered.length;

  const clearFilters = () => {
    setFilterLight("");
    setFilterCat("");
    setFilterDiff(0);
    setSearch("");
  };

  const hasActiveFilters = filterLight || filterCat || filterDiff > 0;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-dark mb-1">Database Tanaman</h1>
        <p className="text-text-muted">{plants.length} jenis tanaman untuk urban farming</p>
      </div>

      {/* Search + controls */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Cari tanaman..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border bg-white text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          className="gap-2"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span className="hidden sm:inline">Filter</span>
          {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-accent" />}
        </Button>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="h-10 px-3 rounded-lg border border-border bg-white text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="popular">Populer</option>
          <option value="easiest">Termudah</option>
          <option value="fastest">Tercepat Panen</option>
        </select>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-border p-4 mb-4 animate-slide-up">
          <div className="flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">Cahaya</p>
              <div className="flex gap-2">
                {["", "full", "partial", "shade"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setFilterLight(v)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      filterLight === v ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-border hover:border-primary"
                    )}
                  >
                    {v === "" ? "Semua" : lightLabels[v as keyof typeof lightLabels]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">Kategori</p>
              <div className="flex gap-2">
                {["", "sayur", "buah", "herbal", "hias"].map((v) => (
                  <button
                    key={v}
                    onClick={() => setFilterCat(v)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      filterCat === v ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-border hover:border-primary"
                    )}
                  >
                    {v === "" ? "Semua" : categoryLabels[v]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase mb-2">Kesulitan Maks</p>
              <div className="flex gap-2">
                {[0, 1, 2, 3].map((v) => (
                  <button
                    key={v}
                    onClick={() => setFilterDiff(v)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                      filterDiff === v ? "bg-primary text-white border-primary" : "bg-white text-text-muted border-border hover:border-primary"
                    )}
                  >
                    {v === 0 ? "Semua" : `≤ ${"★".repeat(v)}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="mt-3 text-xs text-accent hover:underline">
              Hapus semua filter
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-text-muted mb-4">
        Menampilkan {paged.length} dari {filtered.length} tanaman
      </p>

      {/* Plant grid */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <h3 className="font-bold text-text-dark mb-2">Tidak ada tanaman yang cocok</h3>
          <p className="text-text-muted text-sm mb-4">Coba ubah filter atau kata pencarian.</p>
          <Button variant="outline" onClick={clearFilters}>Hapus Filter</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {paged.map((plant) => (
            <Link key={plant.id} href={`/plants/${plant.id}`}>
              <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all group cursor-pointer">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src={plant.imageUrl}
                    alt={plant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop`;
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", categoryColors[plant.category])}>
                      {categoryLabels[plant.category]}
                    </span>
                  </div>
                  {plant.popular && (
                    <div className="absolute top-2 left-2 bg-sun-yellow text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Populer
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-text-dark text-sm leading-tight">{plant.name}</h3>
                  <p className="text-xs text-text-muted italic mb-2">{plant.latinName}</p>
                  <div className="flex items-center justify-between">
                    <DifficultyStars n={plant.difficulty} />
                    <div className="flex items-center gap-1 text-xs text-text-muted">
                      {lightIcons[plant.lightRequirement]}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-text-muted">
                    <Clock className="w-3 h-3" />
                    <span>{plant.timeToHarvestDays} hari panen</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-8 text-center">
          <Button variant="outline" onClick={() => setPage(page + 1)}>
            Muat lebih banyak ({filtered.length - paged.length} tersisa)
          </Button>
        </div>
      )}
    </div>
  );
}
