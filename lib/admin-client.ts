"use client";

import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import type { AdminSessionUser } from "@/lib/admin-types";
import type {
  AdminDashboardData,
  AdminBoundary,
  AdminDocumentationCategory,
  AdminDocumentationPhoto,
  AdminDocumentationPost,
  AdminDocumentationVideo,
  AdminNavigationLink,
  AdminNewsItem,
  AdminOfficial,
  AdminStatItem,
  AdminUserRecord,
} from "@/lib/admin-types";

type ResourceName =
  | "tautan_navigasi"
  | "berita_desa"
  | "statistik_desa"
  | "kategori_dokumentasi"
  | "posting_dokumentasi"
  | "video_dokumentasi"
  | "statistik_profil"
  | "aparatur_desa"
  | "batas_wilayah_desa";

type AdminDocumentationPostRow = Omit<AdminDocumentationPost, "foto_dokumentasi"> & {
  foto_dokumentasi: AdminDocumentationPhoto[] | null;
};

const RLS_WRITE_HINT =
  "Perubahan tidak diterapkan ke database. Pastikan policy RLS INSERT/UPDATE/DELETE untuk user authenticated sudah aktif di Supabase.";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value === "" ? null : value;
}

function getRequiredString(formData: FormData, key: string, label: string) {
  const value = getString(formData, key);
  if (!value) {
    throw new Error(`${label} wajib diisi.`);
  }

  return value;
}

function getInteger(formData: FormData, key: string, label: string) {
  const rawValue = getString(formData, key);
  const parsedValue = Number.parseInt(rawValue, 10);

  if (Number.isNaN(parsedValue)) {
    throw new Error(`${label} harus berupa angka.`);
  }

  return parsedValue;
}

function getBoolean(formData: FormData, key: string) {
  return getString(formData, key) === "true";
}

type DocumentationPhotoInput = {
  image: string;
  alt?: string;
  order?: number;
};

function parseDocumentationPhotos(rawValue: string) {
  if (!rawValue.trim()) {
    return [] as DocumentationPhotoInput[];
  }

  const parsedValue = JSON.parse(rawValue) as unknown;
  if (!Array.isArray(parsedValue)) {
    throw new Error("Format JSON foto dokumentasi harus berupa array.");
  }

  return parsedValue.map((item, index) => {
    if (!item || typeof item !== "object") {
      throw new Error(`Item foto ke-${index + 1} tidak valid.`);
    }

    const image = "image" in item && typeof item.image === "string" ? item.image.trim() : "";
    const alt = "alt" in item && typeof item.alt === "string" ? item.alt.trim() : "";
    const order =
      "order" in item && typeof item.order === "number" && Number.isFinite(item.order)
        ? item.order
        : index + 1;

    if (!image) {
      throw new Error(`Field image pada foto ke-${index + 1} wajib diisi.`);
    }

    return {
      image,
      alt,
      order,
    };
  });
}

async function ensureMutationApplied(
  mutation: PromiseLike<{ error: { message: string } | null; data?: { id: string } | null }>,
) {
  const result = await mutation;
  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data?.id) {
    throw new Error(RLS_WRITE_HINT);
  }

  return result.data.id;
}

export async function signInAdmin(email: string, password: string) {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new Error(error.message);
  }

  const adminUser = await getCurrentAdminUser();
  if (!adminUser) {
    throw new Error("Sesi login tidak ditemukan setelah autentikasi.");
  }

  return adminUser;
}

export async function signOutAdmin() {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw new Error(error.message);
  }
}

export async function getCurrentAdminUser(): Promise<AdminSessionUser | null> {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    username: user.email ?? user.id,
    displayName:
      user.user_metadata?.display_name ??
      user.user_metadata?.full_name ??
      user.email ??
      "Admin Supabase",
  };
}

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = createSupabaseBrowserClient();

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
      .select("id, label, value, urutan_tampil, updated_at")
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
  ];

  const failedResult = results.find((result) => result.error);
  if (failedResult?.error) {
    throw new Error(`Gagal memuat dashboard admin: ${failedResult.error.message}`);
  }

  const currentAdmin = await getCurrentAdminUser();

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
    adminUsers: currentAdmin
      ? ([
          {
            id: currentAdmin.id,
            username: currentAdmin.username,
            display_name: currentAdmin.displayName,
            is_active: true,
            created_at: new Date().toISOString(),
          },
        ] as AdminUserRecord[])
      : [],
  };
}

export async function saveAdminRecord(formData: FormData) {
  const resource = getRequiredString(formData, "resource", "Resource") as ResourceName;
  const id = getString(formData, "id");
  const supabase = createSupabaseBrowserClient();

  switch (resource) {
    case "tautan_navigasi": {
      const payload = {
        label: getRequiredString(formData, "label", "Label"),
        href: getRequiredString(formData, "href", "Href"),
        urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
      };

      await ensureMutationApplied(
        id
          ? supabase.from(resource).update(payload).eq("id", id).select("id").maybeSingle()
          : supabase.from(resource).insert(payload).select("id").single(),
      );
      return `Perubahan untuk ${resource} berhasil disimpan.`;
    }
    case "berita_desa": {
      const payload = {
        kategori: getRequiredString(formData, "kategori", "Kategori"),
        judul: getRequiredString(formData, "judul", "Judul"),
        ringkasan: getRequiredString(formData, "ringkasan", "Ringkasan"),
        url_gambar: getOptionalString(formData, "url_gambar"),
        tanggal_terbit: getOptionalString(formData, "tanggal_terbit"),
        urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
      };

      await ensureMutationApplied(
        id
          ? supabase.from(resource).update(payload).eq("id", id).select("id").maybeSingle()
          : supabase.from(resource).insert(payload).select("id").single(),
      );
      return `Perubahan untuk ${resource} berhasil disimpan.`;
    }
    case "statistik_desa":
    case "statistik_profil": {
      const payload = {
        label: getRequiredString(formData, "label", "Label"),
        value: getRequiredString(formData, "value", "Value"),
        urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
      };

      await ensureMutationApplied(
        id
          ? supabase.from(resource).update(payload).eq("id", id).select("id").maybeSingle()
          : supabase.from(resource).insert(payload).select("id").single(),
      );
      return `Perubahan untuk ${resource} berhasil disimpan.`;
    }
    case "kategori_dokumentasi": {
      const payload = {
        nama: getRequiredString(formData, "nama", "Nama kategori"),
        urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
      };

      await ensureMutationApplied(
        id
          ? supabase.from(resource).update(payload).eq("id", id).select("id").maybeSingle()
          : supabase.from(resource).insert(payload).select("id").single(),
      );
      return `Perubahan untuk ${resource} berhasil disimpan.`;
    }
    case "posting_dokumentasi": {
      const payload = {
        kategori_id: getOptionalString(formData, "kategori_id"),
        judul: getRequiredString(formData, "judul", "Judul"),
        ringkasan: getRequiredString(formData, "ringkasan", "Ringkasan"),
        url_gambar: getOptionalString(formData, "url_gambar"),
        tanggal_terbit: getOptionalString(formData, "tanggal_terbit"),
        urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
      };
      const photos = parseDocumentationPhotos(getString(formData, "photos_json"));

      let postingId = id;
      if (id) {
        postingId = await ensureMutationApplied(
          supabase.from(resource).update(payload).eq("id", id).select("id").maybeSingle(),
        );
      } else {
        postingId = await ensureMutationApplied(
          supabase.from(resource).insert(payload).select("id").single(),
        );
      }

      if (!postingId) {
        throw new Error("Gagal menentukan ID posting dokumentasi.");
      }

      const { error: deletePhotosError } = await supabase
        .from("foto_dokumentasi")
        .delete()
        .eq("posting_id", postingId);
      if (deletePhotosError) throw new Error(deletePhotosError.message);

      if (photos.length > 0) {
        const { error: insertPhotosError } = await supabase.from("foto_dokumentasi").insert(
          photos.map((photo) => ({
            posting_id: postingId,
            url_foto: photo.image,
            teks_alt: photo.alt || null,
            urutan_tampil: photo.order ?? 0,
          })),
        );
        if (insertPhotosError) throw new Error(insertPhotosError.message);
      }

      return `Perubahan untuk ${resource} berhasil disimpan.`;
    }
    case "video_dokumentasi": {
      const payload = {
        judul: getRequiredString(formData, "judul", "Judul"),
        durasi: getOptionalString(formData, "durasi"),
        url_gambar: getOptionalString(formData, "url_gambar"),
        url_video: getOptionalString(formData, "url_video"),
        urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
      };

      await ensureMutationApplied(
        id
          ? supabase.from(resource).update(payload).eq("id", id).select("id").maybeSingle()
          : supabase.from(resource).insert(payload).select("id").single(),
      );
      return `Perubahan untuk ${resource} berhasil disimpan.`;
    }
    case "aparatur_desa": {
      const payload = {
        nama: getRequiredString(formData, "nama", "Nama"),
        peran: getRequiredString(formData, "peran", "Peran"),
        url_foto: getOptionalString(formData, "url_foto"),
        bio: getOptionalString(formData, "bio"),
        urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
      };

      await ensureMutationApplied(
        id
          ? supabase.from(resource).update(payload).eq("id", id).select("id").maybeSingle()
          : supabase.from(resource).insert(payload).select("id").single(),
      );
      return `Perubahan untuk ${resource} berhasil disimpan.`;
    }
    case "batas_wilayah_desa": {
      const payload = {
        arah: getRequiredString(formData, "arah", "Arah"),
        deskripsi: getRequiredString(formData, "deskripsi", "Deskripsi"),
        urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
      };

      await ensureMutationApplied(
        id
          ? supabase.from(resource).update(payload).eq("id", id).select("id").maybeSingle()
          : supabase.from(resource).insert(payload).select("id").single(),
      );
      return `Perubahan untuk ${resource} berhasil disimpan.`;
    }
    default:
      throw new Error("Resource tidak dikenali.");
  }
}

export async function deleteAdminRecord(formData: FormData) {
  const resource = getRequiredString(formData, "resource", "Resource") as ResourceName;
  const id = getRequiredString(formData, "id", "ID");
  const supabase = createSupabaseBrowserClient();

  const { error, data } = await supabase.from(resource).delete().eq("id", id).select("id").maybeSingle();
  if (error) {
    throw new Error(error.message);
  }

  if (!data?.id) {
    throw new Error(RLS_WRITE_HINT);
  }

  return `Data ${resource} berhasil dihapus.`;
}
