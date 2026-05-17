import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-4">🌱</div>
        <h1 className="text-4xl font-bold text-text-dark mb-2">404</h1>
        <p className="text-xl text-text-muted mb-2">Halaman tidak ditemukan</p>
        <p className="text-sm text-text-muted mb-8">
          Sepertinya halaman yang kamu cari belum tumbuh di sini.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
