"use client";

import Link from "next/link";
import { Leaf, Sprout, Grid3X3, CalendarCheck, Star, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Sprout,
    title: "Rekomendasi Tanaman",
    desc: "Dapatkan rekomendasi tanaman yang cocok berdasarkan kondisi cahaya, ruang, dan pengalamanmu.",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: Grid3X3,
    title: "Visual Planner",
    desc: "Rancang tata letak kebunmu secara visual dengan drag-and-drop yang intuitif.",
    color: "bg-accent/10 text-accent",
  },
  {
    icon: CalendarCheck,
    title: "Panduan Perawatan",
    desc: "Jadwal penyiraman, pemupukan, dan panen otomatis agar tanamanmu tumbuh optimal.",
    color: "bg-emerald-100 text-emerald-700",
  },
];

const steps = [
  { number: "1", title: "Daftar & Buat Profil", desc: "Ceritakan kondisi lahan dan pengalamanmu." },
  { number: "2", title: "Dapatkan Rekomendasi", desc: "Kami pilihkan tanaman yang paling cocok untukmu." },
  { number: "3", title: "Rencanakan Layout", desc: "Buat denah kebunmu secara visual dengan planner." },
  { number: "4", title: "Mulai Berkebun", desc: "Ikuti jadwal perawatan dan nikmati hasilnya!" },
];

const testimonials = [
  {
    name: "Anisa, Jakarta",
    text: "\"Saya tinggal di apartemen dan tidak tahu harus mulai dari mana. EcoPath bantu saya tanam cabai dan tomat di balkon kecil!\"",
    stars: 5,
  },
  {
    name: "Rendi, Bandung",
    text: "\"Visual planner-nya luar biasa. Sekarang saya bisa lihat bagaimana tanaman akan teratur sebelum tanam.\"",
    stars: 5,
  },
  {
    name: "Sari, Surabaya",
    text: "\"Jadwal penyiramannya sangat membantu. Tidak ada lagi tanaman yang mati karena lupa disiram!\"",
    stars: 4,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-primary-dark">EcoPath</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm text-text-muted hover:text-text-dark transition-colors">Fitur</Link>
            <Link href="#how-it-works" className="text-sm text-text-muted hover:text-text-dark transition-colors">Cara Kerja</Link>
            <Link href="#testimonials" className="text-sm text-text-muted hover:text-text-dark transition-colors">Testimoni</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Mulai Gratis</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Leaf className="w-3.5 h-3.5" />
          <span>Urban Farming, Dimulai dari Balkonmu</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-text-dark leading-tight tracking-tight mb-6">
          Ubah Balkonmu Jadi{" "}
          <span className="text-primary">Kebun Mini</span>
          <br />yang Produktif
        </h1>

        <p className="text-lg text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          Rencanakan, tanam, dan rawat tanamanmu dengan mudah. Cocok untuk apartemen, balkon, dan teras kecil di kota besar Indonesia.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="xl" asChild className="shadow-card">
            <Link href="/signup">
              Mulai Sekarang — Gratis
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" asChild>
            <Link href="/login">Sudah Punya Akun</Link>
          </Button>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3 justify-center mt-10 text-sm text-text-muted">
          {["30+ jenis tanaman", "Visual planner interaktif", "Jadwal otomatis", "Gratis sepenuhnya"].map((item) => (
            <div key={item} className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Illustration */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-20">
        <div className="rounded-3xl overflow-hidden shadow-card border border-border bg-gradient-to-br from-sage-50 to-white p-8">
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { emoji: "🌶️", name: "Cabai Merah", status: "Siap panen 3 hari lagi" },
              { emoji: "🍅", name: "Tomat Ceri", status: "Butuh siram hari ini" },
              { emoji: "🌿", name: "Basil", status: "Tumbuh dengan baik" },
              { emoji: "🥬", name: "Selada", status: "Tanam 12 hari lalu" },
              { emoji: "🌱", name: "Kemangi", status: "Siap petik" },
              { emoji: "🫚", name: "Mint", status: "Perlu pupuk minggu ini" },
            ].map((plant) => (
              <div key={plant.name} className="bg-white rounded-2xl p-4 border border-border shadow-soft text-center">
                <div className="text-3xl mb-2">{plant.emoji}</div>
                <p className="text-sm font-semibold text-text-dark">{plant.name}</p>
                <p className="text-xs text-text-muted mt-1">{plant.status}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-text-muted text-sm mt-6">
            ✨ Kebun balkon 2m² dengan 6 jenis tanaman berbeda
          </p>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4">
            Semua yang kamu butuhkan untuk berkebun
          </h2>
          <p className="text-text-muted text-lg max-w-xl mx-auto">
            Dari perencanaan hingga panen, EcoPath mendampingi setiap langkah.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-2xl border border-border p-6 shadow-soft hover:shadow-card transition-shadow">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-text-dark mb-2">{f.title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-white border-y border-border py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4">Cara kerjanya mudah</h2>
            <p className="text-text-muted text-lg">4 langkah untuk mulai berkebun di ruang terbatas</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => (
              <div key={step.number} className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="font-semibold text-text-dark mb-2">{step.title}</h3>
                <p className="text-text-muted text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="max-w-6xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-text-dark mb-4">Bergabung dengan ribuan urban farmer</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl border border-border p-6 shadow-soft">
              <div className="flex mb-3">
                {Array.from({ length: t.stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-sun-yellow fill-sun-yellow" />
                ))}
              </div>
              <p className="text-text-dark text-sm leading-relaxed mb-4">{t.text}</p>
              <p className="text-text-muted text-xs font-medium">— {t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Siap mulai berkebun hari ini?</h2>
          <p className="text-white/80 text-lg mb-8">Gratis sepenuhnya. Tidak perlu kartu kredit.</p>
          <Button variant="secondary" size="xl" asChild className="bg-white text-primary hover:bg-sage-50">
            <Link href="/signup">
              Daftar Sekarang
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text-dark text-white/60 py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="font-bold text-white">EcoPath</span>
            <span className="text-sm">— Perencana Kebun Urban</span>
          </div>
          <div className="flex gap-6 text-sm">
            <Link href="/help" className="hover:text-white transition-colors">Bantuan</Link>
            <Link href="/login" className="hover:text-white transition-colors">Masuk</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Daftar</Link>
          </div>
          <p className="text-xs">© 2024 EcoPath. Proyek HCI.</p>
        </div>
      </footer>
    </div>
  );
}
