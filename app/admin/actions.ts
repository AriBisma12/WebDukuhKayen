'use server';

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  createAdminSession,
  hashAdminPassword,
  requireAdminUser,
  verifyAdminCredentials,
} from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type ResourceName =
  | "tautan_navigasi"
  | "berita_desa"
  | "statistik_desa"
  | "kategori_dokumentasi"
  | "posting_dokumentasi"
  | "video_dokumentasi"
  | "statistik_profil"
  | "aparatur_desa"
  | "batas_wilayah_desa"
  | "admin_users";

type DocumentationPhotoInput = {
  image: string;
  alt?: string;
  order?: number;
};

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

function getRedirectTarget(formData: FormData) {
  return getString(formData, "redirect_to") || "/admin";
}

function buildAdminRedirectUrl(path: string, status: "success" | "error", message: string) {
  const params = new URLSearchParams({
    status,
    message,
  });

  return `${path}?${params.toString()}`;
}

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

function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/profil-desa");
  revalidatePath("/kabar-padukuhan");
  revalidatePath("/dokumentasi-kegiatan");
  revalidatePath("/admin");
}

export async function loginAdminAction(formData: FormData) {
  const username = getRequiredString(formData, "username", "Username");
  const password = getRequiredString(formData, "password", "Password");

  const adminUser = await verifyAdminCredentials(username, password);
  if (!adminUser) {
    redirect(
      buildAdminRedirectUrl(
        "/admin/login",
        "error",
        "Username atau password admin tidak cocok.",
      ),
    );
  }

  await createAdminSession(adminUser.id);
  redirect(buildAdminRedirectUrl("/admin", "success", "Login admin berhasil."));
}

export async function logoutAdminAction() {
  await clearAdminSession();
  redirect(buildAdminRedirectUrl("/admin/login", "success", "Anda sudah logout."));
}

export async function saveRecordAction(formData: FormData) {
  const currentAdmin = await requireAdminUser();
  const resource = getRequiredString(formData, "resource", "Resource") as ResourceName;
  const id = getString(formData, "id");
  const redirectTarget = getRedirectTarget(formData);
  const supabase = createSupabaseAdminClient();

  try {
    switch (resource) {
      case "tautan_navigasi": {
        const payload = {
          label: getRequiredString(formData, "label", "Label"),
          href: getRequiredString(formData, "href", "Href"),
          urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
        };

        const query = id
          ? supabase.from(resource).update(payload).eq("id", id)
          : supabase.from(resource).insert(payload);
        const { error } = await query;
        if (error) throw error;
        break;
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

        const query = id
          ? supabase.from(resource).update(payload).eq("id", id)
          : supabase.from(resource).insert(payload);
        const { error } = await query;
        if (error) throw error;
        break;
      }
      case "statistik_desa":
      case "statistik_profil": {
        const payload = {
          label: getRequiredString(formData, "label", "Label"),
          value: getRequiredString(formData, "value", "Value"),
          urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
        };

        const query = id
          ? supabase.from(resource).update(payload).eq("id", id)
          : supabase.from(resource).insert(payload);
        const { error } = await query;
        if (error) throw error;
        break;
      }
      case "kategori_dokumentasi": {
        const payload = {
          nama: getRequiredString(formData, "nama", "Nama kategori"),
          urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
        };

        const query = id
          ? supabase.from(resource).update(payload).eq("id", id)
          : supabase.from(resource).insert(payload);
        const { error } = await query;
        if (error) throw error;
        break;
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
          const { error } = await supabase.from(resource).update(payload).eq("id", id);
          if (error) throw error;
        } else {
          const { data, error } = await supabase
            .from(resource)
            .insert(payload)
            .select("id")
            .single();

          if (error) throw error;
          postingId = data.id;
        }

        if (!postingId) {
          throw new Error("Gagal menentukan ID posting dokumentasi.");
        }

        const { error: deletePhotosError } = await supabase
          .from("foto_dokumentasi")
          .delete()
          .eq("posting_id", postingId);
        if (deletePhotosError) throw deletePhotosError;

        if (photos.length > 0) {
          const { error: insertPhotosError } = await supabase.from("foto_dokumentasi").insert(
            photos.map((photo) => ({
              posting_id: postingId,
              url_foto: photo.image,
              teks_alt: photo.alt || null,
              urutan_tampil: photo.order ?? 0,
            })),
          );
          if (insertPhotosError) throw insertPhotosError;
        }
        break;
      }
      case "video_dokumentasi": {
        const payload = {
          judul: getRequiredString(formData, "judul", "Judul"),
          durasi: getOptionalString(formData, "durasi"),
          url_gambar: getOptionalString(formData, "url_gambar"),
          url_video: getOptionalString(formData, "url_video"),
          urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
        };

        const query = id
          ? supabase.from(resource).update(payload).eq("id", id)
          : supabase.from(resource).insert(payload);
        const { error } = await query;
        if (error) throw error;
        break;
      }
      case "aparatur_desa": {
        const payload = {
          nama: getRequiredString(formData, "nama", "Nama"),
          peran: getRequiredString(formData, "peran", "Peran"),
          url_foto: getOptionalString(formData, "url_foto"),
          bio: getOptionalString(formData, "bio"),
          urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
        };

        const query = id
          ? supabase.from(resource).update(payload).eq("id", id)
          : supabase.from(resource).insert(payload);
        const { error } = await query;
        if (error) throw error;
        break;
      }
      case "batas_wilayah_desa": {
        const payload = {
          arah: getRequiredString(formData, "arah", "Arah"),
          deskripsi: getRequiredString(formData, "deskripsi", "Deskripsi"),
          urutan_tampil: getInteger(formData, "urutan_tampil", "Urutan tampil"),
        };

        const query = id
          ? supabase.from(resource).update(payload).eq("id", id)
          : supabase.from(resource).insert(payload);
        const { error } = await query;
        if (error) throw error;
        break;
      }
      case "admin_users": {
        const username = getRequiredString(formData, "username", "Username");
        const displayName = getRequiredString(formData, "display_name", "Nama tampilan");
        const password = getString(formData, "password");
        const isActive = getBoolean(formData, "is_active");

        const payload: {
          username: string;
          display_name: string;
          is_active: boolean;
          password_hash?: string;
        } = {
          username,
          display_name: displayName,
          is_active: isActive,
        };

        if (!id && !password) {
          throw new Error("Password wajib diisi saat membuat admin baru.");
        }

        if (password) {
          payload.password_hash = await hashAdminPassword(password);
        }

        const query = id
          ? supabase.from(resource).update(payload).eq("id", id)
          : supabase.from(resource).insert(payload);
        const { error } = await query;
        if (error) throw error;
        break;
      }
      default:
        throw new Error("Resource tidak dikenali.");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menyimpan data.";
    redirect(buildAdminRedirectUrl(redirectTarget, "error", message));
  }

  revalidatePublicPages();
  redirect(
    buildAdminRedirectUrl(
      redirectTarget,
      "success",
      `Perubahan untuk ${resource} berhasil disimpan oleh ${currentAdmin.displayName}.`,
    ),
  );
}

export async function deleteRecordAction(formData: FormData) {
  const currentAdmin = await requireAdminUser();
  const resource = getRequiredString(formData, "resource", "Resource") as ResourceName;
  const id = getRequiredString(formData, "id", "ID");
  const redirectTarget = getRedirectTarget(formData);
  const supabase = createSupabaseAdminClient();

  try {
    if (resource === "admin_users" && id === currentAdmin.id) {
      throw new Error("Akun admin yang sedang dipakai tidak boleh dihapus.");
    }

    const { error } = await supabase.from(resource).delete().eq("id", id);
    if (error) throw error;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus data.";
    redirect(buildAdminRedirectUrl(redirectTarget, "error", message));
  }

  revalidatePublicPages();
  redirect(
    buildAdminRedirectUrl(
      redirectTarget,
      "success",
      `Data ${resource} berhasil dihapus oleh ${currentAdmin.displayName}.`,
    ),
  );
}
