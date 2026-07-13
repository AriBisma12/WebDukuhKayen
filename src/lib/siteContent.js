import { supabase } from '../supabaseClient';
import {
  navigation as fallbackNavigation,
  villageNews as fallbackVillageNews,
  villageStats as fallbackVillageStats,
  documentationCategories as fallbackDocumentationCategories,
  documentationHighlights as fallbackDocumentationHighlights,
  documentationVideos as fallbackDocumentationVideos,
  profileStats as fallbackProfileStats,
  profileOfficials as fallbackProfileOfficials,
  villageBoundaries as fallbackVillageBoundaries,
} from '../data/site';

function formatIndonesianDate(value) {
  if (!value) return '';
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export async function getNavigationLinks() {
  const { data, error } = await supabase
    .from('tautan_navigasi')
    .select('label, href')
    .order('urutan_tampil', { ascending: true });
  if (error || !data?.length) return fallbackNavigation;

  const normalized = data.map((item) => ({
    ...item,
    href: item.href === '/profil-padukuhan' ? '/profil-desa' : item.href,
  }));
  const deduped = normalized.filter(
    (item, idx, arr) => arr.findIndex((c) => c.href === item.href) === idx
  );
  const known = new Set(deduped.map((i) => i.href));
  const missing = fallbackNavigation.filter((i) => !known.has(i.href));
  return [...deduped, ...missing];
}

export async function getVillageNews() {
  const { data, error } = await supabase
    .from('berita_desa')
    .select('kategori, judul, ringkasan, url_gambar, tanggal_terbit')
    .order('urutan_tampil', { ascending: true });
  if (error || !data?.length) return fallbackVillageNews;
  return data.map((item) => ({
    category: item.kategori,
    date: formatIndonesianDate(item.tanggal_terbit),
    title: item.judul,
    excerpt: item.ringkasan,
    image: item.url_gambar || '',
  }));
}

export async function getVillageStats() {
  const { data, error } = await supabase
    .from('statistik_desa')
    .select('label, value')
    .order('urutan_tampil', { ascending: true });
  if (error || !data?.length) return fallbackVillageStats;
  return data;
}

export async function getDocumentationCategories() {
  const { data, error } = await supabase
    .from('kategori_dokumentasi')
    .select('nama')
    .order('urutan_tampil', { ascending: true });
  if (error || !data?.length) return fallbackDocumentationCategories;
  const cats = data.map((i) => i.nama);
  return cats.includes('Semua') ? cats : ['Semua', ...cats];
}

export async function getDocumentationPosts() {
  const { data, error } = await supabase
    .from('posting_dokumentasi')
    .select(
      'judul, ringkasan, url_gambar, tanggal_terbit, kategori:kategori_dokumentasi(nama), foto_dokumentasi(url_foto, teks_alt, urutan_tampil)'
    )
    .order('urutan_tampil', { ascending: true });
  if (error || !data?.length) return fallbackDocumentationHighlights;

  return data.map((item) => {
    const photos = [...(item.foto_dokumentasi || [])]
      .sort((a, b) => a.urutan_tampil - b.urutan_tampil)
      .map((p) => ({ image: p.url_foto, alt: p.teks_alt || item.judul }));

    const coverImage = item.url_gambar || photos[0]?.image || '';
    return {
      category: item.kategori?.nama || 'Umum',
      date: formatIndonesianDate(item.tanggal_terbit),
      title: item.judul,
      excerpt: item.ringkasan,
      image: coverImage,
      photos: photos.length > 0 ? photos : coverImage ? [{ image: coverImage, alt: item.judul }] : [],
    };
  });
}

export async function getDocumentationVideos() {
  const { data, error } = await supabase
    .from('video_dokumentasi')
    .select('judul, durasi, url_gambar, url_video')
    .order('urutan_tampil', { ascending: true });
  if (error || !data?.length) return fallbackDocumentationVideos;
  return data.map((item) => ({
    title: item.judul,
    duration: item.durasi || '',
    image: item.url_gambar || '',
    videoUrl: item.url_video || undefined,
  }));
}

export async function getProfileStats() {
  const { data, error } = await supabase
    .from('statistik_profil')
    .select('label, value')
    .order('urutan_tampil', { ascending: true });
  if (error || !data?.length) return fallbackProfileStats;
  return data;
}

export async function getProfileOfficials() {
  const { data, error } = await supabase
    .from('aparatur_desa')
    .select('nama, peran')
    .order('urutan_tampil', { ascending: true });
  if (error || !data?.length) return fallbackProfileOfficials;
  return data.map((item) => ({ name: item.nama, role: item.peran }));
}

export async function getVillageBoundaries() {
  const { data, error } = await supabase
    .from('batas_wilayah_desa')
    .select('arah, deskripsi')
    .order('urutan_tampil', { ascending: true });
  if (error || !data?.length) return fallbackVillageBoundaries;
  return data.map((item) => ({ direction: item.arah, description: item.deskripsi }));
}
