import { supabase } from '../supabaseClient';

export const SITE_IMAGES_BUCKET = 'site-images';

function sanitizeFileName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

export async function uploadPublicImage(file, folder = 'uploads') {
  if (!file) {
    throw new Error('Pilih file gambar terlebih dahulu.');
  }

  if (!file.type?.startsWith('image/')) {
    throw new Error('File harus berupa gambar.');
  }

  const safeName = sanitizeFileName(file.name || 'gambar');
  const path = `${folder}/${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from(SITE_IMAGES_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) {
    if (uploadError.message?.toLowerCase().includes('bucket')) {
      throw new Error(`Bucket Supabase Storage "${SITE_IMAGES_BUCKET}" belum dibuat atau belum bisa diakses.`);
    }
    throw uploadError;
  }

  const { data } = supabase.storage.from(SITE_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
