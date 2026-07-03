import { cache } from "react";
import {
  documentationCategories as fallbackDocumentationCategories,
  documentationHighlights as fallbackDocumentationHighlights,
  documentationVideos as fallbackDocumentationVideos,
  navigation as fallbackNavigation,
  profileOfficials as fallbackProfileOfficials,
  profileStats as fallbackProfileStats,
  villageBoundaries as fallbackVillageBoundaries,
  villageNews as fallbackVillageNews,
  villageStats as fallbackVillageStats,
  type DocumentationPost,
  type DocumentationPhoto,
  type DocumentationVideo,
  type NavigationLink,
  type NewsItem,
  type ProfileOfficial,
  type VillageBoundary,
  type VillageStat,
} from "@/app/_data/site";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function formatIndonesianDate(value: string | null) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export const getNavigationLinks = cache(async (): Promise<NavigationLink[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackNavigation;
  }

  const { data, error } = await supabase
    .from("tautan_navigasi")
    .select("label, href")
    .order("urutan_tampil", { ascending: true });

  if (error || !data?.length) {
    return fallbackNavigation;
  }

  return data;
});

export const getVillageNews = cache(async (): Promise<NewsItem[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackVillageNews;
  }

  const { data, error } = await supabase
    .from("berita_desa")
    .select("kategori, judul, ringkasan, url_gambar, tanggal_terbit")
    .order("urutan_tampil", { ascending: true });

  if (error || !data?.length) {
    return fallbackVillageNews;
  }

  return data.map((item) => ({
    category: item.kategori,
    date: formatIndonesianDate(item.tanggal_terbit),
    title: item.judul,
    excerpt: item.ringkasan,
    image: item.url_gambar ?? "",
  }));
});

export const getVillageStats = cache(async (): Promise<VillageStat[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackVillageStats;
  }

  const { data, error } = await supabase
    .from("statistik_desa")
    .select("label, value")
    .order("urutan_tampil", { ascending: true });

  if (error || !data?.length) {
    return fallbackVillageStats;
  }

  return data;
});

type DocumentationPostRow = {
  judul: string;
  ringkasan: string;
  url_gambar: string | null;
  tanggal_terbit: string | null;
  unggulan: boolean;
  kategori: { nama: string } | null;
  foto_dokumentasi:
    | {
        url_foto: string;
        teks_alt: string | null;
        urutan_tampil: number;
      }[]
    | null;
};

export const getDocumentationCategories = cache(async (): Promise<string[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackDocumentationCategories;
  }

  const { data, error } = await supabase
    .from("kategori_dokumentasi")
    .select("nama")
    .order("urutan_tampil", { ascending: true });

  if (error || !data?.length) {
    return fallbackDocumentationCategories;
  }

  const categories = data.map((item) => item.nama);
  return categories.includes("Semua") ? categories : ["Semua", ...categories];
});

export const getDocumentationPosts = cache(
  async (): Promise<DocumentationPost[]> => {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return fallbackDocumentationHighlights;
    }

    const { data, error } = await supabase
      .from("posting_dokumentasi")
      .select(
        "judul, ringkasan, url_gambar, tanggal_terbit, unggulan, kategori:kategori_dokumentasi(nama), foto_dokumentasi(url_foto, teks_alt, urutan_tampil)",
      )
      .order("urutan_tampil", { ascending: true })
      .returns<DocumentationPostRow[]>();

    if (error || !data?.length) {
      return fallbackDocumentationHighlights;
    }

    return data.map((item) => {
      const photos = [...(item.foto_dokumentasi ?? [])]
        .sort((a, b) => a.urutan_tampil - b.urutan_tampil)
        .map<DocumentationPhoto>((photo) => ({
          image: photo.url_foto,
          alt: photo.teks_alt ?? item.judul,
        }));

      const coverImage = item.url_gambar ?? photos[0]?.image ?? "";

      return {
        category: item.kategori?.nama ?? "Umum",
        date: formatIndonesianDate(item.tanggal_terbit),
        title: item.judul,
        excerpt: item.ringkasan,
        image: coverImage,
        featured: item.unggulan,
        photos:
          photos.length > 0
            ? photos
            : coverImage
              ? [{ image: coverImage, alt: item.judul }]
              : [],
      };
    });
  },
);

export const getDocumentationVideos = cache(
  async (): Promise<DocumentationVideo[]> => {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return fallbackDocumentationVideos;
    }

    const { data, error } = await supabase
      .from("video_dokumentasi")
      .select("judul, durasi, url_gambar, url_video")
      .order("urutan_tampil", { ascending: true });

    if (error || !data?.length) {
      return fallbackDocumentationVideos;
    }

    return data.map((item) => ({
      title: item.judul,
      duration: item.durasi ?? "",
      image: item.url_gambar ?? "",
      videoUrl: item.url_video ?? undefined,
    }));
  },
);

export const getProfileStats = cache(async (): Promise<VillageStat[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackProfileStats;
  }

  const { data, error } = await supabase
    .from("statistik_profil")
    .select("label, value")
    .order("urutan_tampil", { ascending: true });

  if (error || !data?.length) {
    return fallbackProfileStats;
  }

  return data;
});

export const getProfileOfficials = cache(async (): Promise<ProfileOfficial[]> => {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return fallbackProfileOfficials;
  }

  const { data, error } = await supabase
    .from("aparatur_desa")
    .select("nama, peran")
    .order("urutan_tampil", { ascending: true });

  if (error || !data?.length) {
    return fallbackProfileOfficials;
  }

  return data.map((item) => ({
    name: item.nama,
    role: item.peran,
  }));
});

export const getVillageBoundaries = cache(
  async (): Promise<VillageBoundary[]> => {
    const supabase = createSupabaseServerClient();
    if (!supabase) {
      return fallbackVillageBoundaries;
    }

    const { data, error } = await supabase
      .from("batas_wilayah_desa")
      .select("arah, deskripsi")
      .order("urutan_tampil", { ascending: true });

    if (error || !data?.length) {
      return fallbackVillageBoundaries;
    }

    return data.map((item) => ({
      direction: item.arah,
      description: item.deskripsi,
    }));
  },
);
