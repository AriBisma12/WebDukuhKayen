import { createSupabaseAdminClient } from "@/lib/supabase/admin";

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

type AdminDocumentationPostRow = Omit<AdminDocumentationPost, "foto_dokumentasi"> & {
  foto_dokumentasi: AdminDocumentationPhoto[] | null;
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = createSupabaseAdminClient();

  const [
    navigationResult,
    newsResult,
    villageStatsResult,
    categoriesResult,
    postsResult,
    videosResult,
    profileStatsResult,
    officialsResult,
    boundariesResult,
    adminUsersResult,
  ] = await Promise.all([
    supabase
      .from("tautan_navigasi")
      .select("id, label, href, urutan_tampil")
      .order("urutan_tampil", { ascending: true }),
    supabase
      .from("berita_desa")
      .select("id, kategori, judul, ringkasan, url_gambar, tanggal_terbit, urutan_tampil, updated_at")
      .order("urutan_tampil", { ascending: true }),
    supabase
      .from("statistik_desa")
      .select("id, label, value, urutan_tampil")
      .order("urutan_tampil", { ascending: true }),
    supabase
      .from("kategori_dokumentasi")
      .select("id, nama, urutan_tampil")
      .order("urutan_tampil", { ascending: true }),
    supabase
      .from("posting_dokumentasi")
      .select(
        "id, kategori_id, judul, ringkasan, url_gambar, tanggal_terbit, urutan_tampil, updated_at, kategori:kategori_dokumentasi(id, nama), foto_dokumentasi(id, url_foto, teks_alt, urutan_tampil)",
      )
      .order("urutan_tampil", { ascending: true })
      .returns<AdminDocumentationPostRow[]>(),
    supabase
      .from("video_dokumentasi")
      .select("id, judul, durasi, url_gambar, url_video, urutan_tampil, updated_at")
      .order("urutan_tampil", { ascending: true }),
    supabase
      .from("statistik_profil")
      .select("id, label, value, urutan_tampil, updated_at")
      .order("urutan_tampil", { ascending: true }),
    supabase
      .from("aparatur_desa")
      .select("id, nama, peran, url_foto, bio, urutan_tampil, updated_at")
      .order("urutan_tampil", { ascending: true }),
    supabase
      .from("batas_wilayah_desa")
      .select("id, arah, deskripsi, urutan_tampil, updated_at")
      .order("urutan_tampil", { ascending: true }),
    supabase
      .from("admin_users")
      .select("id, username, display_name, is_active, created_at")
      .order("created_at", { ascending: true }),
  ]);

  const results = [
    navigationResult,
    newsResult,
    villageStatsResult,
    categoriesResult,
    postsResult,
    videosResult,
    profileStatsResult,
    officialsResult,
    boundariesResult,
    adminUsersResult,
  ];

  const failedResult = results.find((result) => result.error);
  if (failedResult?.error) {
    throw new Error(`Failed to load admin dashboard data: ${failedResult.error.message}`);
  }

  return {
    navigation: (navigationResult.data ?? []) as AdminNavigationLink[],
    news: (newsResult.data ?? []) as AdminNewsItem[],
    villageStats: (villageStatsResult.data ?? []) as AdminStatItem[],
    documentationCategories: (categoriesResult.data ?? []) as AdminDocumentationCategory[],
    documentationPosts: ((postsResult.data ?? []) as AdminDocumentationPostRow[]).map((post) => ({
      ...post,
      foto_dokumentasi: [...(post.foto_dokumentasi ?? [])].sort(
        (first, second) => first.urutan_tampil - second.urutan_tampil,
      ),
    })),
    documentationVideos: (videosResult.data ?? []) as AdminDocumentationVideo[],
    profileStats: (profileStatsResult.data ?? []) as AdminStatItem[],
    officials: (officialsResult.data ?? []) as AdminOfficial[],
    boundaries: (boundariesResult.data ?? []) as AdminBoundary[],
    adminUsers: (adminUsersResult.data ?? []) as AdminUserRecord[],
  };
}
