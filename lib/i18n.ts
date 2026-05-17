import type { Language } from "@/types";

const translations: Record<Language, Record<string, string>> = {
  id: {
    // Navigation
    "nav.dashboard": "Dasbor",
    "nav.plants": "Tanaman",
    "nav.planner": "Perencana",
    "nav.myGarden": "Kebunku",
    "nav.learn": "Belajar",
    "nav.calendar": "Kalender",
    "nav.journal": "Jurnal",
    "nav.settings": "Pengaturan",
    "nav.help": "Bantuan",
    "nav.logout": "Keluar",

    // Auth
    "auth.login": "Masuk",
    "auth.signup": "Daftar",
    "auth.loginTitle": "Selamat Datang Kembali",
    "auth.signupTitle": "Buat Akun Baru",
    "auth.email": "Email",
    "auth.password": "Kata Sandi",
    "auth.name": "Nama Lengkap",
    "auth.city": "Kota",
    "auth.noAccount": "Belum punya akun?",
    "auth.haveAccount": "Sudah punya akun?",
    "auth.forgotPassword": "Lupa kata sandi?",

    // Landing
    "landing.heroTitle": "Ubah Balkonmu Jadi Kebun Mini",
    "landing.heroSubtitle":
      "Rencanakan, tanam, dan rawat tanamanmu dengan mudah. Cocok untuk apartemen, balkon, dan teras kecil.",
    "landing.cta.start": "Mulai Sekarang",
    "landing.cta.login": "Masuk",
    "landing.feature1.title": "Rekomendasi Tanaman",
    "landing.feature1.desc":
      "Dapatkan rekomendasi tanaman yang cocok berdasarkan kondisi cahaya dan ruang kamu.",
    "landing.feature2.title": "Visual Planner",
    "landing.feature2.desc":
      "Rancang tata letak kebunmu secara visual dengan drag-and-drop yang mudah.",
    "landing.feature3.title": "Panduan Perawatan",
    "landing.feature3.desc":
      "Jadwal penyiraman, pemupukan, dan panen otomatis agar tanamanmu tumbuh optimal.",

    // Onboarding
    "onboarding.step1.title": "Halo, {name}! 👋",
    "onboarding.step1.subtitle": "Mari kita kenali lahanmu agar bisa memberikan rekomendasi terbaik.",
    "onboarding.step2.title": "Di mana kamu tinggal?",
    "onboarding.step2.subtitle": "Kami gunakan untuk menyesuaikan rekomendasi tanaman dengan iklim setempat.",
    "onboarding.step3.title": "Jenis ruang yang kamu miliki?",
    "onboarding.step3.subtitle": "Pilih yang paling sesuai dengan situasimu.",
    "onboarding.step4.title": "Kondisi cahaya & luas area",
    "onboarding.step4.subtitle": "Ini membantu kami merekomendasikan tanaman yang tepat.",
    "onboarding.step5.title": "Pengalaman & tujuan berkebun",
    "onboarding.step5.subtitle": "Hampir selesai! Ceritakan sedikit tentang dirimu.",
    "onboarding.skip": "Lewati",
    "onboarding.next": "Selanjutnya",
    "onboarding.back": "Kembali",
    "onboarding.finish": "Mulai Berkebun",
    "onboarding.progress": "Langkah {current} dari {total}",

    // Space types
    "space.balkon": "Balkon",
    "space.teras": "Teras",
    "space.halaman": "Halaman Kecil",
    "space.indoor": "Indoor",

    // Sunlight
    "sun.full": "Sinar Penuh",
    "sun.full.desc": "Lebih dari 6 jam sinar matahari langsung",
    "sun.partial": "Sebagian Teduh",
    "sun.partial.desc": "3–6 jam sinar matahari langsung",
    "sun.shade": "Teduh",
    "sun.shade.desc": "Kurang dari 3 jam sinar matahari langsung",

    // Experience
    "exp.pemula": "Pemula",
    "exp.pemula.desc": "Baru pertama kali berkebun",
    "exp.menengah": "Menengah",
    "exp.menengah.desc": "Pernah berkebun sebelumnya",
    "exp.berpengalaman": "Berpengalaman",
    "exp.berpengalaman.desc": "Sudah sering berkebun",

    // Goals
    "goal.sayur": "Sayuran",
    "goal.buah": "Buah-buahan",
    "goal.herbal": "Tanaman Herbal",
    "goal.hias": "Tanaman Hias",

    // Dashboard
    "dashboard.greeting.pagi": "Selamat Pagi",
    "dashboard.greeting.siang": "Selamat Siang",
    "dashboard.greeting.sore": "Selamat Sore",
    "dashboard.greeting.malam": "Selamat Malam",
    "dashboard.todayTasks": "Tugas Hari Ini",
    "dashboard.myGarden": "Kebunku",
    "dashboard.activePlants": "Tanaman Aktif",
    "dashboard.myLayouts": "Layout Saya",
    "dashboard.recommendations": "Rekomendasi untuk Kamu",
    "dashboard.dailyTip": "Tip Hari Ini",
    "dashboard.noTasks": "Tidak ada tugas hari ini! 🎉",
    "dashboard.noPlants": "Belum ada tanaman.",
    "dashboard.addPlant": "Tambah Tanaman",
    "dashboard.newLayout": "Buat Layout",
    "dashboard.browsePlants": "Jelajahi Tanaman",
    "dashboard.viewAll": "Lihat Semua",

    // Plants
    "plants.title": "Database Tanaman",
    "plants.search": "Cari tanaman...",
    "plants.filter": "Filter",
    "plants.sort": "Urutkan",
    "plants.sort.popular": "Populer",
    "plants.sort.easiest": "Termudah",
    "plants.sort.fastest": "Tercepat Panen",
    "plants.light": "Cahaya",
    "plants.space": "Ruang",
    "plants.difficulty": "Kesulitan",
    "plants.category": "Kategori",
    "plants.noResults": "Tidak ada tanaman yang cocok.",
    "plants.harvest": "Panen",
    "plants.days": "hari",
    "plants.addToGarden": "Tambah ke Kebunku",
    "plants.addToLayout": "Tambah ke Layout",

    // Garden
    "garden.title": "Kebunku",
    "garden.addPlant": "Tambah Tanaman",
    "garden.empty": "Kebunmu masih kosong",
    "garden.empty.desc": "Mulai dengan menambahkan tanaman pertamamu!",
    "garden.daysAgo": "{n} hari lalu ditanam",
    "garden.nextTask": "Tugas berikutnya",
    "garden.stage.seedling": "Bibit",
    "garden.stage.growing": "Tumbuh",
    "garden.stage.mature": "Dewasa",
    "garden.stage.harvesting": "Siap Panen",
    "garden.stage.done": "Selesai",

    // Tasks
    "task.water": "Siram",
    "task.fertilize": "Pupuk",
    "task.prune": "Pangkas",
    "task.harvest": "Panen",
    "task.repot": "Repot",
    "task.done": "Selesai",
    "task.snooze": "Tunda 1 hari",
    "task.overdue": "Terlambat",

    // Planner
    "planner.title": "Perencana Layout",
    "planner.newLayout": "Buat Layout Baru",
    "planner.empty": "Belum ada layout",
    "planner.empty.desc": "Buat layout pertamamu untuk merencanakan kebun.",
    "planner.save": "Simpan",
    "planner.export": "Ekspor PDF",
    "planner.undo": "Batalkan",
    "planner.redo": "Ulangi",
    "planner.sunZones": "Zona Cahaya",
    "planner.properties": "Properti",
    "planner.palette": "Pilih Tanaman",

    // Learn
    "learn.title": "Pusat Belajar",
    "learn.articles": "Artikel",
    "learn.videos": "Video",
    "learn.search": "Cari artikel atau video...",
    "learn.readMore": "Baca Selengkapnya",
    "learn.watchVideo": "Tonton Video",
    "learn.readTime": "{n} menit baca",

    // Journal
    "journal.title": "Jurnal Kebun",
    "journal.addEntry": "Tambah Catatan",
    "journal.empty": "Jurnal masih kosong",
    "journal.empty.desc": "Catat perjalanan berkebunmu di sini.",
    "journal.notes": "Catatan",
    "journal.photo": "Foto",
    "journal.plant": "Tanaman",

    // Settings
    "settings.title": "Pengaturan",
    "settings.account": "Akun",
    "settings.notifications": "Notifikasi",
    "settings.language": "Bahasa",
    "settings.privacy": "Privasi",
    "settings.save": "Simpan Perubahan",
    "settings.deleteAccount": "Hapus Akun",
    "settings.deleteConfirm": "Yakin ingin menghapus akun? Semua data akan hilang.",

    // Common
    "common.loading": "Memuat...",
    "common.error": "Terjadi kesalahan",
    "common.cancel": "Batal",
    "common.save": "Simpan",
    "common.delete": "Hapus",
    "common.edit": "Edit",
    "common.add": "Tambah",
    "common.close": "Tutup",
    "common.back": "Kembali",
    "common.next": "Selanjutnya",
    "common.done": "Selesai",
    "common.yes": "Ya",
    "common.no": "Tidak",
    "common.search": "Cari",
    "common.filter": "Filter",
    "common.all": "Semua",
    "common.required": "Wajib diisi",
    "common.success": "Berhasil!",
    "common.copiedToClipboard": "Disalin!",
  },
  en: {
    // Navigation
    "nav.dashboard": "Dashboard",
    "nav.plants": "Plants",
    "nav.planner": "Planner",
    "nav.myGarden": "My Garden",
    "nav.learn": "Learn",
    "nav.calendar": "Calendar",
    "nav.journal": "Journal",
    "nav.settings": "Settings",
    "nav.help": "Help",
    "nav.logout": "Logout",

    // Auth
    "auth.login": "Login",
    "auth.signup": "Sign Up",
    "auth.loginTitle": "Welcome Back",
    "auth.signupTitle": "Create Account",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full Name",
    "auth.city": "City",
    "auth.noAccount": "Don't have an account?",
    "auth.haveAccount": "Already have an account?",
    "auth.forgotPassword": "Forgot password?",

    // Landing
    "landing.heroTitle": "Turn Your Balcony into a Mini Garden",
    "landing.heroSubtitle":
      "Plan, grow, and care for your plants easily. Perfect for apartments, balconies, and small terraces.",
    "landing.cta.start": "Get Started",
    "landing.cta.login": "Login",
    "landing.feature1.title": "Plant Recommendations",
    "landing.feature1.desc":
      "Get plant recommendations suited to your light and space conditions.",
    "landing.feature2.title": "Visual Planner",
    "landing.feature2.desc":
      "Design your garden layout visually with easy drag-and-drop.",
    "landing.feature3.title": "Care Guidance",
    "landing.feature3.desc":
      "Automatic watering, fertilizing, and harvest schedules for optimal growth.",

    // Onboarding
    "onboarding.step1.title": "Hello, {name}! 👋",
    "onboarding.step1.subtitle": "Let us get to know your space to give you the best recommendations.",
    "onboarding.step2.title": "Where do you live?",
    "onboarding.step2.subtitle": "We use this to tailor plant recommendations to your local climate.",
    "onboarding.step3.title": "What kind of space do you have?",
    "onboarding.step3.subtitle": "Choose the option that best fits your situation.",
    "onboarding.step4.title": "Light conditions & area size",
    "onboarding.step4.subtitle": "This helps us recommend the right plants.",
    "onboarding.step5.title": "Experience & gardening goals",
    "onboarding.step5.subtitle": "Almost done! Tell us a bit about yourself.",
    "onboarding.skip": "Skip",
    "onboarding.next": "Next",
    "onboarding.back": "Back",
    "onboarding.finish": "Start Gardening",
    "onboarding.progress": "Step {current} of {total}",

    // Space types
    "space.balkon": "Balcony",
    "space.teras": "Terrace",
    "space.halaman": "Small Yard",
    "space.indoor": "Indoor",

    // Sunlight
    "sun.full": "Full Sun",
    "sun.full.desc": "More than 6 hours of direct sunlight",
    "sun.partial": "Partial Shade",
    "sun.partial.desc": "3–6 hours of direct sunlight",
    "sun.shade": "Shade",
    "sun.shade.desc": "Less than 3 hours of direct sunlight",

    // Experience
    "exp.pemula": "Beginner",
    "exp.pemula.desc": "First time gardening",
    "exp.menengah": "Intermediate",
    "exp.menengah.desc": "Some gardening experience",
    "exp.berpengalaman": "Experienced",
    "exp.berpengalaman.desc": "Frequent gardener",

    // Goals
    "goal.sayur": "Vegetables",
    "goal.buah": "Fruits",
    "goal.herbal": "Herbs",
    "goal.hias": "Ornamental",

    // Dashboard
    "dashboard.greeting.pagi": "Good Morning",
    "dashboard.greeting.siang": "Good Afternoon",
    "dashboard.greeting.sore": "Good Evening",
    "dashboard.greeting.malam": "Good Night",
    "dashboard.todayTasks": "Today's Tasks",
    "dashboard.myGarden": "My Garden",
    "dashboard.activePlants": "Active Plants",
    "dashboard.myLayouts": "My Layouts",
    "dashboard.recommendations": "Recommendations for You",
    "dashboard.dailyTip": "Daily Tip",
    "dashboard.noTasks": "No tasks today! 🎉",
    "dashboard.noPlants": "No plants yet.",
    "dashboard.addPlant": "Add Plant",
    "dashboard.newLayout": "New Layout",
    "dashboard.browsePlants": "Browse Plants",
    "dashboard.viewAll": "View All",

    // Plants
    "plants.title": "Plant Database",
    "plants.search": "Search plants...",
    "plants.filter": "Filter",
    "plants.sort": "Sort",
    "plants.sort.popular": "Popular",
    "plants.sort.easiest": "Easiest",
    "plants.sort.fastest": "Fastest Harvest",
    "plants.light": "Light",
    "plants.space": "Space",
    "plants.difficulty": "Difficulty",
    "plants.category": "Category",
    "plants.noResults": "No matching plants.",
    "plants.harvest": "Harvest",
    "plants.days": "days",
    "plants.addToGarden": "Add to My Garden",
    "plants.addToLayout": "Add to Layout",

    // Garden
    "garden.title": "My Garden",
    "garden.addPlant": "Add Plant",
    "garden.empty": "Your garden is empty",
    "garden.empty.desc": "Start by adding your first plant!",
    "garden.daysAgo": "Planted {n} days ago",
    "garden.nextTask": "Next task",
    "garden.stage.seedling": "Seedling",
    "garden.stage.growing": "Growing",
    "garden.stage.mature": "Mature",
    "garden.stage.harvesting": "Ready to Harvest",
    "garden.stage.done": "Done",

    // Tasks
    "task.water": "Water",
    "task.fertilize": "Fertilize",
    "task.prune": "Prune",
    "task.harvest": "Harvest",
    "task.repot": "Repot",
    "task.done": "Done",
    "task.snooze": "Snooze 1 day",
    "task.overdue": "Overdue",

    // Planner
    "planner.title": "Layout Planner",
    "planner.newLayout": "New Layout",
    "planner.empty": "No layouts yet",
    "planner.empty.desc": "Create your first layout to plan your garden.",
    "planner.save": "Save",
    "planner.export": "Export PDF",
    "planner.undo": "Undo",
    "planner.redo": "Redo",
    "planner.sunZones": "Sun Zones",
    "planner.properties": "Properties",
    "planner.palette": "Plant Palette",

    // Learn
    "learn.title": "Learning Center",
    "learn.articles": "Articles",
    "learn.videos": "Videos",
    "learn.search": "Search articles or videos...",
    "learn.readMore": "Read More",
    "learn.watchVideo": "Watch Video",
    "learn.readTime": "{n} min read",

    // Journal
    "journal.title": "Garden Journal",
    "journal.addEntry": "Add Entry",
    "journal.empty": "Journal is empty",
    "journal.empty.desc": "Record your gardening journey here.",
    "journal.notes": "Notes",
    "journal.photo": "Photo",
    "journal.plant": "Plant",

    // Settings
    "settings.title": "Settings",
    "settings.account": "Account",
    "settings.notifications": "Notifications",
    "settings.language": "Language",
    "settings.privacy": "Privacy",
    "settings.save": "Save Changes",
    "settings.deleteAccount": "Delete Account",
    "settings.deleteConfirm": "Are you sure you want to delete your account? All data will be lost.",

    // Common
    "common.loading": "Loading...",
    "common.error": "An error occurred",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.add": "Add",
    "common.close": "Close",
    "common.back": "Back",
    "common.next": "Next",
    "common.done": "Done",
    "common.yes": "Yes",
    "common.no": "No",
    "common.search": "Search",
    "common.filter": "Filter",
    "common.all": "All",
    "common.required": "Required",
    "common.success": "Success!",
    "common.copiedToClipboard": "Copied!",
  },
};

export function t(key: string, lang: Language = "id", vars?: Record<string, string | number>): string {
  const dict = translations[lang];
  let str = dict[key] ?? translations.id[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
  }
  return str;
}

export default translations;
