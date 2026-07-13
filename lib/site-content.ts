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
  type DocumentationPhoto,
  type DocumentationPost,
  type DocumentationVideo,
  type NavigationLink,
  type NewsItem,
  type ProfileOfficial,
  type VillageBoundary,
  type VillageStat,
} from "@/app/_data/site";
import { createSupabaseContentClient } from "@/lib/supabase/content";

const FALLBACK_IMAGE =
  "data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3e%3crect width='1200' height='800' fill='%23f3ecdf'/%3e%3cg fill='none' stroke='%23b3913a' stroke-width='18'%3e%3crect x='170' y='160' width='860' height='480' rx='36'/%3e%3cpath d='M250 560l180-190 120 120 120-150 280 220'/%3e%3ccircle cx='420' cy='300' r='46'/%3e%3c/g%3e%3ctext x='50%25' y='690' text-anchor='middle' font-family='Arial,sans-serif' font-size='42' fill='%237a5b0a'%3eDokumentasi Padukuhan%3c/text%3e%3c/svg%3e";

function sanitizeImageUrl(value: string | null | undefined) {
  if (!value) {
    return FALLBACK_IMAGE;
  }

  if (value.startsWith("data:image/") || value.startsWith("/")) {
    return value;
  }

  try {
    const parsedUrl = new URL(value);
    const allowedHosts = new Set(["images.unsplash.com"]);

    if (!allowedHosts.has(parsedUrl.hostname)) {
      return FALLBACK_IMAGE;
    }

    return value;
  } catch {
    return FALLBACK_IMAGE;
  }
}

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

export async function getNavigationLinks(): Promise<NavigationLink[]> {
  const supabase = createSupabaseContentClient();
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

  const normalizedData = data.map((item) => ({
    ...item,
    href: item.href === "/profil-padukuhan" ? "/profil-desa" : item.href,
    label:
      item.href === "/profil-padukuhan" || item.href === "/profil-desa"
        ? "Profil Padukuhan"
        : item.label,
  }));

  const dedupedData = normalizedData.filter((item, index, items) => {
    return items.findIndex((candidate) => candidate.href === item.href) === index;
  });

  const knownLinks = new Set(dedupedData.map((item) => item.href));
  const missingFallbackLinks = fallbackNavigation.filter((item) => !knownLinks.has(item.href));

  return [...dedupedData, ...missingFallbackLinks];
}

export async function getVillageNews(): Promise<NewsItem[]> {
  const supabase = createSupabaseContentClient();
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
    image: sanitizeImageUrl(item.url_gambar),
  }));
}

export async function getVillageStats(): Promise<VillageStat[]> {
  const supabase = createSupabaseContentClient();
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
}

type DocumentationPostRow = {
  judul: string;
  ringkasan: string;
  url_gambar: string | null;
  tanggal_terbit: string | null;
  kategori: { nama: string } | null;
  foto_dokumentasi:
    | {
        url_foto: string;
        teks_alt: string | null;
        urutan_tampil: number;
      }[]
    | null;
};

export async function getDocumentationCategories(): Promise<string[]> {
  const supabase = createSupabaseContentClient();
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
}

export async function getDocumentationPosts(): Promise<DocumentationPost[]> {
  const supabase = createSupabaseContentClient();
  if (!supabase) {
    return fallbackDocumentationHighlights;
  }

  const { data, error } = await supabase
    .from("posting_dokumentasi")
    .select(
      "judul, ringkasan, url_gambar, tanggal_terbit, kategori:kategori_dokumentasi(nama), foto_dokumentasi(url_foto, teks_alt, urutan_tampil)",
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
        image: sanitizeImageUrl(photo.url_foto),
        alt: photo.teks_alt ?? item.judul,
      }));

    const coverImage = sanitizeImageUrl(item.url_gambar ?? photos[0]?.image);

    return {
      category: item.kategori?.nama ?? "Umum",
      date: formatIndonesianDate(item.tanggal_terbit),
      title: item.judul,
      excerpt: item.ringkasan,
      image: coverImage,
      photos:
        photos.length > 0
          ? photos
          : coverImage
            ? [{ image: coverImage, alt: item.judul }]
            : [],
    };
  });
}

export async function getDocumentationVideos(): Promise<DocumentationVideo[]> {
  const supabase = createSupabaseContentClient();
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
    image: sanitizeImageUrl(item.url_gambar),
    videoUrl: item.url_video ?? undefined,
  }));
}

export async function getProfileStats(): Promise<VillageStat[]> {
  const supabase = createSupabaseContentClient();
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
}

export async function getProfileOfficials(): Promise<ProfileOfficial[]> {
  const supabase = createSupabaseContentClient();
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
}

export async function getVillageBoundaries(): Promise<VillageBoundary[]> {
  const supabase = createSupabaseContentClient();
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
}
