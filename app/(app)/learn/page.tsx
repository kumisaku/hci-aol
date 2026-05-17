"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Clock, Play, BookOpen } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import articlesData from "@/data/articles.json";
import videosData from "@/data/videos.json";
import type { Article } from "@/types";

const articles = articlesData as Article[];
const videos = videosData as Article[];

const categoryLabels: Record<string, string> = {
  pemula: "Pemula",
  penyiraman: "Penyiraman",
  "pupuk-tanah": "Pupuk & Tanah",
  "hama-penyakit": "Hama & Penyakit",
  panen: "Panen",
  umum: "Umum",
};

const categoryColors: Record<string, string> = {
  pemula: "bg-emerald-50 text-emerald-700",
  penyiraman: "bg-sky-50 text-sky-700",
  "pupuk-tanah": "bg-amber-50 text-amber-700",
  "hama-penyakit": "bg-red-50 text-red-700",
  panen: "bg-violet-50 text-violet-700",
  umum: "bg-sage-50 text-text-muted",
};

export default function LearnPage() {
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");

  const filteredArticles = useMemo(() =>
    articles.filter((a) =>
      (!search || a.title.toLowerCase().includes(search.toLowerCase())) &&
      (!filterCat || a.category === filterCat)
    ), [search, filterCat]);

  const filteredVideos = useMemo(() =>
    videos.filter((v) =>
      (!search || v.title.toLowerCase().includes(search.toLowerCase())) &&
      (!filterCat || v.category === filterCat)
    ), [search, filterCat]);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">Pusat Belajar</h1>
        <p className="text-text-muted mt-1">Artikel dan video untuk meningkatkan kemampuan berkebunmu</p>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        <input
          type="text"
          placeholder="Cari artikel atau video..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md h-10 pl-9 pr-4 rounded-xl border border-border bg-white text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["", ...Object.keys(categoryLabels)].map((cat) => (
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

      <Tabs defaultValue="articles">
        <TabsList>
          <TabsTrigger value="articles" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Artikel ({filteredArticles.length})
          </TabsTrigger>
          <TabsTrigger value="videos" className="gap-2">
            <Play className="w-4 h-4" />
            Video ({filteredVideos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="articles">
          {filteredArticles.length === 0 ? (
            <div className="py-12 text-center text-text-muted">Tidak ada artikel yang cocok.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredArticles.map((article) => (
                <Link key={article.id} href={`/learn/${article.slug}`}>
                  <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all group h-full">
                    <div className="h-44 overflow-hidden">
                      <img
                        src={article.coverImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop`;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", categoryColors[article.category])}>
                          {categoryLabels[article.category]}
                        </span>
                        {article.featured && <Badge variant="accent" className="text-[10px]">Featured</Badge>}
                      </div>
                      <h3 className="font-semibold text-text-dark text-sm leading-snug mb-2 line-clamp-2">{article.title}</h3>
                      <p className="text-xs text-text-muted line-clamp-2 mb-3">{article.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-text-muted">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {article.readTime} menit
                        </span>
                        {article.author && <span>— {article.author}</span>}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="videos">
          {filteredVideos.length === 0 ? (
            <div className="py-12 text-center text-text-muted">Tidak ada video yang cocok.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVideos.map((video) => (
                <Link key={video.id} href={`/learn/${video.slug}`}>
                  <div className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all group h-full">
                    <div className="h-44 overflow-hidden relative">
                      <img
                        src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=250&fit=crop`;
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-card group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                        </div>
                      </div>
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-text-dark/80 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 inline-block", categoryColors[video.category])}>
                        {categoryLabels[video.category]}
                      </span>
                      <h3 className="font-semibold text-text-dark text-sm leading-snug">{video.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
