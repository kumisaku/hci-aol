"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Bell, Globe, Shield, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useAuth, useLang } from "@/lib/contexts";
import { saveUser, deleteAccount } from "@/lib/storage";
import { toast } from "sonner";
import cities from "@/data/cities.json";

export default function SettingsPage() {
  const { user, setUser, logout } = useAuth();
  const { lang, setLang, t } = useLang();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    city: user?.city ?? "",
  });

  const [notifications, setNotifications] = useState({
    watering: user?.notifications?.watering ?? true,
    fertilizing: user?.notifications?.fertilizing ?? true,
    harvest: user?.notifications?.harvest ?? true,
    tips: user?.notifications?.tips ?? true,
  });

  useEffect(() => {
    if (user) {
      setProfile({ name: user.name, email: user.email, city: user.city });
      setNotifications(user.notifications ?? { watering: true, fertilizing: true, harvest: true, tips: true });
    }
  }, [user]);

  function saveProfile() {
    if (!user) return;
    const updated = { ...user, ...profile };
    saveUser(updated);
    setUser(updated);
    toast.success("Profil berhasil diperbarui!");
  }

  function saveNotifications() {
    if (!user) return;
    const updated = { ...user, notifications };
    saveUser(updated);
    setUser(updated);
    toast.success("Preferensi notifikasi disimpan!");
  }

  function handleDeleteAccount() {
    if (!user) return;
    deleteAccount(user.id);
    logout();
    toast.success("Akun berhasil dihapus.");
    router.push("/");
  }

  function handleLangChange(l: "id" | "en") {
    setLang(l);
    toast.success(l === "id" ? "Bahasa diubah ke Bahasa Indonesia" : "Language changed to English");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-dark">Pengaturan</h1>
        <p className="text-text-muted mt-1">Kelola akun dan preferensimu</p>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="mb-6">
          <TabsTrigger value="account" className="gap-2">
            <User className="w-4 h-4" />
            Akun
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="w-4 h-4" />
            Notifikasi
          </TabsTrigger>
          <TabsTrigger value="language" className="gap-2">
            <Globe className="w-4 h-4" />
            Bahasa
          </TabsTrigger>
          <TabsTrigger value="privacy" className="gap-2">
            <Shield className="w-4 h-4" />
            Privasi
          </TabsTrigger>
        </TabsList>

        {/* Account tab */}
        <TabsContent value="account">
          <div className="bg-white rounded-2xl border border-border p-6 space-y-5">
            <h2 className="font-semibold text-text-dark">Informasi Akun</h2>
            <Input
              label="Nama Lengkap"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-text-dark mb-1.5">Kota</label>
              <Select value={profile.city} onValueChange={(v) => setProfile({ ...profile, city: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kota" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((c) => (
                    <SelectItem key={c.value} value={c.label}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={saveProfile}>
              <Save className="w-4 h-4" />
              Simpan Perubahan
            </Button>
          </div>
        </TabsContent>

        {/* Notifications tab */}
        <TabsContent value="notifications">
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-text-dark">Preferensi Notifikasi</h2>
            {[
              { key: "watering", label: "Pengingat Penyiraman", desc: "Ingatkan saat tanaman perlu disiram" },
              { key: "fertilizing", label: "Pengingat Pemupukan", desc: "Ingatkan saat waktu pupuk tiba" },
              { key: "harvest", label: "Pengingat Panen", desc: "Ingatkan saat tanaman siap panen" },
              { key: "tips", label: "Tip Harian", desc: "Kirimkan tip berkebun setiap hari" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-text-dark">{label}</p>
                  <p className="text-xs text-text-muted">{desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications[key as keyof typeof notifications]}
                    onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-border rounded-full peer peer-checked:bg-primary transition-colors after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
            <Button onClick={saveNotifications} className="mt-2">
              <Save className="w-4 h-4" />
              Simpan
            </Button>
          </div>
        </TabsContent>

        {/* Language tab */}
        <TabsContent value="language">
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
            <h2 className="font-semibold text-text-dark">Bahasa Antarmuka</h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "id", label: "🇮🇩 Bahasa Indonesia", desc: "Tampilkan dalam Bahasa Indonesia" },
                { value: "en", label: "🇬🇧 English", desc: "Display in English" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleLangChange(opt.value as "id" | "en")}
                  className={`flex flex-col items-start gap-1 p-4 rounded-xl border-2 text-left transition-all ${
                    lang === opt.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className="font-semibold text-text-dark">{opt.label}</span>
                  <span className="text-xs text-text-muted">{opt.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Privacy tab */}
        <TabsContent value="privacy">
          <div className="bg-white rounded-2xl border border-border p-6">
            <h2 className="font-semibold text-text-dark mb-4">Privasi & Data</h2>
            <p className="text-sm text-text-muted mb-6">
              Semua data kamu disimpan secara lokal di perangkat ini menggunakan localStorage.
              Tidak ada data yang dikirim ke server eksternal.
            </p>
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold text-red-600 mb-2">Zona Berbahaya</h3>
              <p className="text-sm text-text-muted mb-4">
                Menghapus akun akan menghapus semua data secara permanen termasuk tanaman, layout, dan jurnal.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteModal(true)}
              >
                <Trash2 className="w-4 h-4" />
                Hapus Akun
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Hapus Akun?</DialogTitle>
            <DialogDescription>
              Tindakan ini tidak dapat dibatalkan. Semua data termasuk tanaman, layout, dan jurnal akan dihapus permanen.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="flex-1" onClick={() => setShowDeleteModal(false)}>
              Batal
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDeleteAccount}>
              <Trash2 className="w-4 h-4" />
              Ya, Hapus Akun
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
