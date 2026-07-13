export type AdminSessionUser = {
  id: string;
  username: string;
  displayName: string;
};

export type AdminNavigationLink = {
  id: string;
  label: string;
  href: string;
  urutan_tampil: number;
};

export type AdminNewsItem = {
  id: string;
  kategori: string;
  judul: string;
  ringkasan: string;
  url_gambar: string | null;
  tanggal_terbit: string | null;
  urutan_tampil: number;
  updated_at: string;
};

export type AdminStatItem = {
  id: string;
  label: string;
  value: string;
  urutan_tampil: number;
  updated_at: string;
};

export type AdminDocumentationCategory = {
  id: string;
  nama: string;
  urutan_tampil: number;
};

export type AdminDocumentationPhoto = {
  id: string;
  url_foto: string;
  teks_alt: string | null;
  urutan_tampil: number;
};

export type AdminDocumentationPost = {
  id: string;
  kategori_id: string | null;
  judul: string;
  ringkasan: string;
  url_gambar: string | null;
  tanggal_terbit: string | null;
  urutan_tampil: number;
  updated_at: string;
  kategori: { id: string; nama: string } | null;
  foto_dokumentasi: AdminDocumentationPhoto[];
};

export type AdminDocumentationVideo = {
  id: string;
  judul: string;
  durasi: string | null;
  url_gambar: string | null;
  url_video: string | null;
  urutan_tampil: number;
  updated_at: string;
};

export type AdminOfficial = {
  id: string;
  nama: string;
  peran: string;
  url_foto: string | null;
  bio: string | null;
  urutan_tampil: number;
  updated_at: string;
};

export type AdminBoundary = {
  id: string;
  arah: string;
  deskripsi: string;
  urutan_tampil: number;
  updated_at: string;
};

export type AdminUserRecord = {
  id: string;
  username: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
};

export type AdminDashboardData = {
  navigation: AdminNavigationLink[];
  news: AdminNewsItem[];
  villageStats: AdminStatItem[];
  documentationCategories: AdminDocumentationCategory[];
  documentationPosts: AdminDocumentationPost[];
  documentationVideos: AdminDocumentationVideo[];
  profileStats: AdminStatItem[];
  officials: AdminOfficial[];
  boundaries: AdminBoundary[];
  adminUsers: AdminUserRecord[];
};
