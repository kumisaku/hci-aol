"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, User, Play, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import articlesData from "@/data/articles.json";
import videosData from "@/data/videos.json";
import type { Article } from "@/types";

const allContent = [...(articlesData as Article[]), ...(videosData as Article[])];

const categoryLabels: Record<string, string> = {
  pemula: "Pemula",
  penyiraman: "Penyiraman",
  "pupuk-tanah": "Pupuk & Tanah",
  "hama-penyakit": "Hama & Penyakit",
  panen: "Panen",
  umum: "Umum",
};

export default function LearnDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const item = allContent.find((c) => c.slug === slug);

  if (!item) {
    return (
      <div className="text-center py-20">
        <div className="text-4xl mb-3">📚</div>
        <h2 className="text-xl font-bold text-text-dark mb-4">Konten tidak ditemukan</h2>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
      </div>
    );
  }

  const related = allContent
    .filter((c) => c.id !== item.id && c.category === item.category && c.type === item.type)
    .slice(0, 3);

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-text-muted hover:text-text-dark transition-colors mb-5 text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Pusat Belajar
      </button>

      {/* Cover image / Video */}
      {item.type === "video" ? (
        <div className="rounded-2xl overflow-hidden mb-6 aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${item.youtubeId}`}
            title={item.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="rounded-2xl overflow-hidden mb-6 h-56 sm:h-72">
          <img
            src={item.coverImage}
            alt={item.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=400&fit=crop`;
            }}
          />
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-3 flex-wrap mb-4">
        <Badge>{categoryLabels[item.category] ?? item.category}</Badge>
        {item.type === "article" && item.readTime && (
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Clock className="w-3 h-3" />
            {item.readTime} menit baca
          </span>
        )}
        {item.type === "video" && item.duration && (
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <Play className="w-3 h-3" />
            {item.duration}
          </span>
        )}
        {item.author && (
          <span className="flex items-center gap-1 text-xs text-text-muted">
            <User className="w-3 h-3" />
            {item.author}
          </span>
        )}
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-text-dark mb-4 leading-tight">
        {item.title}
      </h1>

      <p className="text-text-muted mb-6">{item.excerpt}</p>

      {/* Article content */}
      {item.type === "article" && item.content && (
        <div className="bg-white rounded-2xl border border-border p-6 prose prose-sm max-w-none
          prose-headings:text-text-dark prose-headings:font-bold
          prose-p:text-text-dark prose-p:leading-relaxed
          prose-li:text-text-dark
          prose-strong:text-text-dark
          prose-a:text-primary">
          {item.content.split("\n\n").map((block, i) => {
            if (block.startsWith("# ")) {
              return <h2 key={i} className="text-xl font-bold text-text-dark mt-6 mb-3">{block.slice(2)}</h2>;
            }
            if (block.startsWith("## ")) {
              return <h3 key={i} className="text-lg font-semibold text-text-dark mt-5 mb-2">{block.slice(3)}</h3>;
            }
            if (block.startsWith("### ")) {
              return <h4 key={i} className="text-base font-semibold text-text-dark mt-4 mb-2">{block.slice(4)}</h4>;
            }
            if (block.includes("\n- ") || block.startsWith("- ")) {
              const items = block.split("\n").filter((l) => l.startsWith("- ") || l.startsWith("* "));
              return (
                <ul key={i} className="list-disc pl-5 space-y-1 my-3">
                  {items.map((item, j) => (
                    <li key={j} className="text-sm text-text-dark">{item.slice(2)}</li>
                  ))}
                </ul>
              );
            }
            if (block.match(/^\d+\. /m)) {
              const items = block.split("\n").filter((l) => l.match(/^\d+\. /));
              return (
                <ol key={i} className="list-decimal pl-5 space-y-1 my-3">
                  {items.map((item, j) => (
                    <li key={j} className="text-sm text-text-dark">{item.replace(/^\d+\. /, "")}</li>
                  ))}
                </ol>
              );
            }
            return (
              <p key={i} className="text-sm text-text-dark leading-relaxed my-2"
                dangerouslySetInnerHTML={{ __html: block.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}
              />
            );
          })}
        </div>
      )}

      {/* Tags */}
      {item.tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {item.tags.map((tag) => (
            <span key={tag} className="px-3 py-1 rounded-full bg-sage-50 text-text-muted text-xs">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div className="mt-10">
          <h2 className="text-lg font-bold text-text-dark mb-4">
            {item.type === "article" ? "Artikel" : "Video"} Terkait
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <Link key={r.id} href={`/learn/${r.slug}`}>
                <div className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-card transition-all">
                  <div className="h-28 overflow-hidden">
                    <img
                      src={r.type === "video" ? `https://img.youtube.com/vi/${r.youtubeId}/hqdefault.jpg` : r.coverImage}
                      alt={r.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&h=150&fit=crop`;
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium text-text-dark line-clamp-2">{r.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
