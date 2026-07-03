export type NavigationLink = {
  href: string;
  label: string;
};

export type NewsItem = {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
};

export type VillageStat = {
  label: string;
  value: string;
};

export type DocumentationPost = {
  category: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  featured?: boolean;
  photos?: DocumentationPhoto[];
};

export type DocumentationVideo = {
  title: string;
  duration: string;
  image: string;
  videoUrl?: string;
};

export type DocumentationPhoto = {
  image: string;
  alt: string;
};

export type ProfileOfficial = {
  name: string;
  role: string;
};

export type VillageBoundary = {
  direction: string;
  description: string;
};

export const navigation = [
  { href: "/", label: "Beranda" },
  { href: "/profil-desa", label: "Profil Desa" },
  { href: "/dokumentasi-kegiatan", label: "Dokumentasi Kegiatan" },
] satisfies NavigationLink[];

export const villageNews = [
  {
    category: "Berita",
    date: "12 Mei 2024",
    title: "Panen Raya Padi Organik Meningkat 20% Tahun Ini",
    excerpt:
      "Pemerintah desa bersama kelompok tani menyiapkan panen raya dengan sistem pengairan baru.",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Pengumuman",
    date: "08 Mei 2024",
    title: "Jadwal Pemeriksaan Kesehatan Gratis di Puskesmas Desa",
    excerpt:
      "Program kesehatan lansia, ibu hamil, dan balita dibuka kembali setiap hari Rabu pekan kedua.",
    image:
      "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    category: "Pembangunan",
    date: "03 Mei 2024",
    title: "Rehabilitasi Jalan Dusun III Telah Selesai 100%",
    excerpt:
      "Akses jalan utama diperlebar untuk mendukung mobilitas warga dan distribusi hasil pertanian.",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
  },
] satisfies NewsItem[];

export const villageStats = [
  { label: "Total Penduduk", value: "4.520" },
  { label: "Luas Wilayah", value: "125" },
  { label: "Kepala Keluarga", value: "1.280" },
  { label: "Sektor Pertanian", value: "85%" },
] satisfies VillageStat[];

export const documentationCategories = [
  "Semua",
  "Budaya",
  "Infrastruktur",
  "Sosial",
] satisfies string[];

export const documentationHighlights = [
  {
    category: "Sosial",
    date: "12 Maret 2024",
    title: "Gotong Royong Kebersihan Lingkungan",
    excerpt:
      "Kegiatan rutin bulanan warga Desa Sejahtera dalam menjaga kebersihan drainase dan fasilitas umum untuk mencegah banjir dan wabah penyakit.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
    featured: true,
    photos: [
      {
        image:
          "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80",
        alt: "Warga desa bergotong royong di area terbuka",
      },
      {
        image:
          "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
        alt: "Suasana musyawarah warga setelah kegiatan bersama",
      },
    ],
  },
  {
    category: "Budaya",
    date: "17 Agustus 2023",
    title: "Pesta Rakyat Kemerdekaan RI ke-78",
    excerpt:
      "Perayaan meriah dengan berbagai lomba tradisional dan pementasan seni budaya dari seluruh dusun di desa.",
    image:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        image:
          "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80",
        alt: "Mikrofon panggung untuk acara budaya desa",
      },
      {
        image:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
        alt: "Keramaian warga dalam festival desa",
      },
    ],
  },
  {
    category: "Infrastruktur",
    date: "05 Februari 2024",
    title: "Pembangunan Irigasi Sawah Dusun III",
    excerpt:
      "Peningkatan sistem pengairan sawah sepanjang 2 km untuk mendukung produktivitas petani padi lokal.",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        image:
          "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
        alt: "Area persawahan dengan saluran irigasi baru",
      },
      {
        image:
          "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80",
        alt: "Jalur pembangunan infrastruktur desa",
      },
    ],
  },
  {
    category: "Sosial",
    date: "20 Januari 2024",
    title: "Musyawarah Perencanaan Pembangunan",
    excerpt:
      "Diskusi terbuka antara perangkat desa dan tokoh masyarakat dalam menentukan arah pembangunan desa tahun anggaran 2024.",
    image:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
    photos: [
      {
        image:
          "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80",
        alt: "Pertemuan warga dan perangkat desa",
      },
      {
        image:
          "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80",
        alt: "Forum diskusi pembangunan di balai desa",
      },
    ],
  },
] satisfies DocumentationPost[];

export const documentationVideos = [
  {
    title: "Rangkuman Festival Desa Sejahtera 2023",
    duration: "05:42",
    image:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "#",
  },
  {
    title: "Profil Desa Sejahtera: Menuju Desa Mandiri",
    duration: "12:15",
    image:
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    videoUrl: "https://youtu.be/eKLrQ2ztNhA?si=IwLO",
  },
] satisfies DocumentationVideo[];

export const profileStats = [
  { label: "Tahun Berdiri", value: "1924" },
  { label: "Jumlah Penduduk", value: "12K+" },
  { label: "Dusun Aktif", value: "7" },
] satisfies VillageStat[];

export const profileOfficials = [
  { name: "H. Ahmad Fauzi", role: "Kepala Desa" },
  { name: "Siti Aminah", role: "Sekretaris Desa" },
  { name: "Budi Santoso", role: "Kaur Keuangan" },
  { name: "Irfan Hakim", role: "Kaur Pembangunan" },
] satisfies ProfileOfficial[];

export const villageBoundaries = [
  {
    direction: "Batas Utara",
    description:
      "Berbatasan langsung dengan Hutan Lindung Gunung Hijau dan Desa Makmur.",
  },
  {
    direction: "Batas Selatan",
    description:
      "Dibatasi aliran Sungai Jernih yang menghubungkan desa dengan kawasan kabupaten tetangga.",
  },
  {
    direction: "Batas Timur & Barat",
    description:
      "Dikelilingi kawasan persawahan produktif yang berbatasan dengan Desa Harapan dan Desa Jaya.",
  },
] satisfies VillageBoundary[];
