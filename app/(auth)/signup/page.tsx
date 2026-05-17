"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Leaf, Mail, Lock, User, MapPin, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { saveUser, setActiveUser, getUserByEmail } from "@/lib/storage";
import { useAuth } from "@/lib/contexts";
import { generateId } from "@/lib/utils";
import type { User as UserType } from "@/types";
import cities from "@/data/cities.json";

export default function SignupPage() {
  const router = useRouter();
  const { setUser } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Nama wajib diisi";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Format email tidak valid";
    if (form.password.length < 6) e.password = "Kata sandi minimal 6 karakter";
    if (!form.city) e.city = "Pilih kota kamu";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const existing = getUserByEmail(form.email.toLowerCase().trim());
    if (existing) {
      setErrors({ email: "Email sudah terdaftar" });
      setLoading(false);
      return;
    }

    const newUser: UserType = {
      id: generateId(),
      name: form.name.trim(),
      email: form.email.toLowerCase().trim(),
      password: form.password,
      city: form.city,
      createdAt: new Date().toISOString(),
      language: "id",
      onboardingCompleted: false,
      notifications: {
        watering: true,
        fertilizing: true,
        harvest: true,
        tips: true,
      },
    };

    saveUser(newUser);
    setActiveUser(newUser.id);
    setUser(newUser);
    toast.success("Akun berhasil dibuat! Selamat datang, " + newUser.name.split(" ")[0] + "!");
    router.push("/onboarding");
  }

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mb-3">
          <Leaf className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text-dark">Buat Akun Baru</h1>
        <p className="text-text-muted text-sm mt-1">Mulai perjalanan berkebunmu</p>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl border border-border shadow-soft p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nama Lengkap"
            type="text"
            placeholder="Nama kamu"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            icon={<User className="w-4 h-4" />}
            error={errors.name}
            required
          />

          <Input
            label="Email"
            type="email"
            placeholder="nama@email.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            icon={<Mail className="w-4 h-4" />}
            error={errors.email}
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
                placeholder="Min. 6 karakter"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
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
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium text-text-dark mb-1.5">
              <MapPin className="inline w-4 h-4 mr-1" />
              Kota
            </label>
            <Select
              value={form.city}
              onValueChange={(v) => setForm({ ...form, city: v })}
            >
              <SelectTrigger>
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
            {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city}</p>}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Membuat akun..." : "Buat Akun"}
          </Button>
        </form>

        <p className="text-center text-sm text-text-muted mt-5">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
