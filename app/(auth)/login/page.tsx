"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getUserByEmail, setActiveUser } from "@/lib/storage";
import { useAuth } from "@/lib/contexts";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 500));

    const user = getUserByEmail(form.email.toLowerCase().trim());
    if (!user || user.password !== form.password) {
      setError("Email atau kata sandi salah.");
      setLoading(false);
      return;
    }

    setActiveUser(user.id);
    setUser(user);
    toast.success("Selamat datang kembali, " + user.name.split(" ")[0] + "!");
    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-3">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text-dark">Selamat Datang Kembali</h1>
        <p className="text-text-muted text-sm mt-1">Masuk untuk melanjutkan berkebun</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-border shadow-soft p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            icon={<Mail className="w-4 h-4" />}
            required
            autoComplete="email"
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                autoComplete="current-password"
                className="flex h-10 w-full rounded-lg border border-border bg-white pl-9 pr-10 py-2 text-sm text-text-dark placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-dark"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Masuk..." : "Masuk"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-5">
          Belum punya akun?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            Daftar gratis
          </Link>
        </p>
      </div>

      {/* Demo hint */}
      <p className="text-center text-xs text-text-muted mt-4">
        Demo? Coba daftar akun baru, lalu masuk dengan akun tersebut.
      </p>
    </div>
  );
}
