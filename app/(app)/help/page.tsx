"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const faqs = [
  { q: "Bagaimana cara menambahkan tanaman ke kebun saya?", a: "Pergi ke menu Tanaman, cari tanaman yang ingin kamu tambahkan, klik detail, lalu tekan tombol 'Tambah ke Kebunku'. Kamu bisa memilih tanggal mulai tanam." },
  { q: "Apakah data saya tersimpan secara online?", a: "Tidak. Semua data disimpan secara lokal di perangkatmu menggunakan localStorage. Tidak ada data yang dikirim ke server eksternal." },
  { q: "Bagaimana cara membuat layout visual kebun?", a: "Pergi ke menu Perencana, klik 'Buat Layout Baru', atur dimensi ruang, lalu drag-and-drop tanaman dari panel kiri ke grid kanvas." },
  { q: "Apakah saya bisa menggunakan EcoPath di ponsel?", a: "Ya! EcoPath didesain mobile-first dan berfungsi dengan baik di semua ukuran layar, dari ponsel hingga desktop." },
  { q: "Bagaimana cara mendapatkan rekomendasi tanaman yang personal?", a: "Lengkapi proses onboarding dengan mengisi data kondisi lahanmu (jenis ruang, cahaya, luas area, dan tujuan berkebun). EcoPath akan memberikan rekomendasi berdasarkan data tersebut." },
  { q: "Apa yang terjadi jika saya menutup browser?", a: "Data kamu tetap tersimpan! Karena menggunakan localStorage, data akan tetap ada selama kamu tidak menghapus data browser atau melakukan logout." },
  { q: "Bagaimana cara menghapus tanaman dari kebun?", a: "Pergi ke halaman Kebunku, klik kartu tanaman yang ingin dihapus, lalu tekan tombol 'Hapus' di modal yang muncul." },
  { q: "Apakah jadwal perawatan dibuat otomatis?", a: "Ya! Setelah menambahkan tanaman ke kebun, EcoPath otomatis membuat jadwal penyiraman, pemupukan, dan panen berdasarkan data tanaman dan tanggal tanam yang kamu masukkan." },
  { q: "Bagaimana cara mengubah bahasa antarmuka?", a: "Pergi ke Pengaturan > Bahasa, lalu pilih Bahasa Indonesia atau English." },
  { q: "Apakah EcoPath bisa digunakan secara offline?", a: "Sebagian besar fitur berfungsi secara offline karena data disimpan lokal. Gambar tanaman memerlukan koneksi internet." },
];

export default function HelpPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    toast.success("Pesan berhasil dikirim! Kami akan membalas dalam 1-2 hari kerja.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">Bantuan & FAQ</h1>
        <p className="text-text-muted mt-1">Jawaban untuk pertanyaan yang sering ditanyakan</p>
      </div>

      {/* FAQ */}
      <div className="space-y-2 mb-12">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-sage-50 transition-colors"
            >
              <span className="font-medium text-text-dark text-sm pr-3">{faq.q}</span>
              {openIdx === i ? (
                <ChevronUp className="w-4 h-4 text-text-muted flex-shrink-0" />
              ) : (
                <ChevronDown className="w-4 h-4 text-text-muted flex-shrink-0" />
              )}
            </button>
            {openIdx === i && (
              <div className="px-4 pb-4 animate-slide-up">
                <p className="text-sm text-text-muted leading-relaxed">{faq.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact form */}
      <div className="bg-white rounded-2xl border border-border p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-text-dark">Hubungi Kami</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nama"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nama kamu"
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="nama@email.com"
            required
          />
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Pesan</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Tulis pertanyaan atau masukan kamu..."
              rows={4}
              required
              className="w-full rounded-xl border border-border px-3 py-2.5 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
            />
          </div>
          <Button type="submit" className="w-full">
            <Mail className="w-4 h-4" />
            Kirim Pesan
          </Button>
        </form>
      </div>
    </div>
  );
}
