import { useState, useEffect, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import { SITE_IMAGES_BUCKET, uploadPublicImage } from '../../lib/storage';

// ── Shared UI Primitives ──────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const esc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', esc);
    return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', esc); };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d2008]/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-2xl bg-[#faf7f0] rounded-[1.8rem] shadow-[0_32px_80px_-24px_rgba(38,24,4,0.7)] max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#ddd3c2]">
          <h3 className="font-heading text-xl font-bold text-[#3f2d11]">{title}</h3>
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ece8df] text-[#9f8e78] hover:text-[#5a430d] transition-colors font-bold text-lg">✕</button>
        </div>
        <div className="p-7">{children}</div>
      </div>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#5a430d] mb-2">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#ddd3c2] bg-white text-[#3f2d11] placeholder-[#c5b9a8] focus:outline-none focus:ring-2 focus:ring-[#7a5b0a] focus:border-[#7a5b0a] transition-all text-sm";

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-[#faf7f0] rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="text-4xl mb-4">🗑️</div>
        <p className="font-heading text-lg font-bold text-[#3f2d11] mb-2">Hapus Data?</p>
        <p className="text-[#9f8e78] text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-[#ddd3c2] text-[#7a6e5a] font-semibold text-sm hover:bg-[#ece8df] transition-colors">Batal</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-[#b54040] text-white font-semibold text-sm hover:bg-[#9a3535] transition-colors">Ya, Hapus</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  const colors = {
    success: 'bg-[#f0fdf4] border-[#86efac] text-[#166534]',
    error: 'bg-[#fdf0f0] border-[#fca5a5] text-[#b54040]',
  };
  const icons = { success: '✅', error: '❌' };
  return (
    <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-lg text-sm font-semibold ${colors[type]}`}>
      <span>{icons[type]}</span> {message}
    </div>
  );
}

// ── Main AdminKabar Component ─────────────────────────────────────────────────

const TABLE = 'berita_desa';
const EMPTY_FORM = { kategori: '', judul: '', ringkasan: '', url_gambar: '', tanggal_terbit: '', urutan_tampil: 0 };

export default function AdminKabar() {
  const imageInputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from(TABLE).select('*').order('urutan_tampil', { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  useEffect(() => {
    return () => {
      if (imagePreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  const resetSelectedImage = () => {
    if (imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImageFile(null);
    setImagePreviewUrl('');
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY_FORM);
    resetSelectedImage();
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({ kategori: item.kategori, judul: item.judul, ringkasan: item.ringkasan, url_gambar: item.url_gambar || '', tanggal_terbit: item.tanggal_terbit || '', urutan_tampil: item.urutan_tampil });
    resetSelectedImage();
    setModalOpen(true);
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type?.startsWith('image/')) {
      showToast('File harus berupa gambar.', 'error');
      event.target.value = '';
      return;
    }

    if (imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }

    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const clearImage = () => {
    resetSelectedImage();
    setForm((current) => ({ ...current, url_gambar: '' }));
  };

  const openFilePicker = () => {
    imageInputRef.current?.click();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = form.url_gambar;

      if (selectedImageFile) {
        setUploadingImage(true);
        imageUrl = await uploadPublicImage(selectedImageFile, 'kabar');
      }

      const payload = {
        ...form,
        url_gambar: imageUrl,
        urutan_tampil: Number(form.urutan_tampil),
      };
      const { error } = editItem
        ? await supabase.from(TABLE).update(payload).eq('id', editItem.id)
        : await supabase.from(TABLE).insert(payload);

      if (error) {
        showToast('Gagal menyimpan data.', 'error');
      } else {
        showToast(editItem ? 'Berhasil diperbarui!' : 'Berhasil ditambahkan!');
        resetSelectedImage();
        setModalOpen(false);
        fetchItems();
      }
    } catch (error) {
      showToast(error.message || 'Gagal mengunggah gambar.', 'error');
    } finally {
      setUploadingImage(false);
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const { error } = await supabase.from(TABLE).delete().eq('id', deleteId);
    if (error) showToast('Gagal menghapus.', 'error');
    else { showToast('Berhasil dihapus!'); fetchItems(); }
    setDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#3f2d11]">Kabar Padukuhan</h1>
          <p className="text-[#9f8e78] text-sm mt-1">Kelola berita dan pengumuman padukuhan</p>
        </div>
        <button onClick={openAdd} className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#7a5b0a] text-white font-semibold text-sm hover:bg-[#684d08] transition-all shadow-[0_10px_24px_-10px_rgba(122,91,10,0.7)]">
          + Tambah Kabar
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-[#ece8df] animate-pulse" />)}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-[#faf7f0] rounded-2xl border border-[#ddd3c2]">
          <div className="text-5xl mb-4">📰</div>
          <p className="font-heading font-bold text-[#5a430d]">Belum ada kabar</p>
          <p className="text-[#9f8e78] text-sm mt-1">Klik tombol Tambah Kabar untuk memulai.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-[#faf7f0] rounded-2xl border border-[#ddd3c2] p-5 flex flex-col gap-4 sm:flex-row sm:items-start hover:border-[#c59f38] transition-colors">
              {item.url_gambar && (
                <img src={item.url_gambar} alt={item.judul} className="h-48 w-full rounded-xl object-cover sm:h-20 sm:w-20 sm:shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#f0cc5a] text-[#5e4300] text-xs font-bold">{item.kategori}</span>
                  {item.tanggal_terbit && <span className="text-xs text-[#9f8e78]">{item.tanggal_terbit}</span>}
                  <span className="text-xs text-[#b0a08a] sm:ml-auto">Urutan: {item.urutan_tampil}</span>
                </div>
                <h3 className="font-heading font-bold text-[#3f2d11] truncate">{item.judul}</h3>
                <p className="text-sm text-[#9f8e78] line-clamp-2 mt-1">{item.ringkasan}</p>
              </div>
              <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
                <button onClick={() => openEdit(item)} className="flex-1 px-3 py-1.5 rounded-lg bg-[#ece8df] text-[#7a5b0a] text-xs font-semibold hover:bg-[#e3ddd4] transition-colors sm:flex-none">Edit</button>
                <button onClick={() => setDeleteId(item.id)} className="flex-1 px-3 py-1.5 rounded-lg bg-[#fdf0f0] text-[#b54040] text-xs font-semibold hover:bg-[#fae0e0] transition-colors sm:flex-none">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editItem ? 'Edit Kabar' : 'Tambah Kabar Baru'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Kategori *">
                <input required className={inputClass} placeholder="Berita / Pengumuman" value={form.kategori} onChange={e => setForm(f => ({ ...f, kategori: e.target.value }))} />
              </FormField>
              <FormField label="Tanggal Terbit">
                <input type="date" className={inputClass} value={form.tanggal_terbit} onChange={e => setForm(f => ({ ...f, tanggal_terbit: e.target.value }))} />
              </FormField>
            </div>
            <FormField label="Judul *">
              <input required className={inputClass} placeholder="Judul kabar..." value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} />
            </FormField>
            <FormField label="Ringkasan / Isi *">
              <textarea required rows={4} className={inputClass} placeholder="Isi berita atau pengumuman..." value={form.ringkasan} onChange={e => setForm(f => ({ ...f, ringkasan: e.target.value }))} />
            </FormField>
            <FormField label="Gambar">
              <div className="space-y-3">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="w-full rounded-xl border border-[#ddd3c2] bg-white px-4 py-3 text-sm font-semibold text-[#5a430d] transition-colors hover:bg-[#f7f2e8]"
                >
                  Pilih Gambar Dari Perangkat
                </button>
                <p className="text-xs text-[#9f8e78]">
                  File akan diunggah ke Supabase Storage bucket <span className="font-semibold text-[#7a5b0a]">{SITE_IMAGES_BUCKET}</span>.
                </p>
                {selectedImageFile && (
                  <p className="text-xs font-medium text-[#7a5b0a]">
                    File terpilih: {selectedImageFile.name}
                  </p>
                )}
              </div>
            </FormField>
            {(imagePreviewUrl || form.url_gambar) && (
              <div className="space-y-3 rounded-2xl border border-[#ddd3c2] bg-[#fffdf8] p-4">
                <p className="text-sm font-semibold text-[#5a430d]">Preview Gambar</p>
                <img src={imagePreviewUrl || form.url_gambar} alt={form.judul || 'Preview gambar'} className="h-48 w-full rounded-xl object-cover" />
                <button type="button" onClick={clearImage} className="rounded-lg bg-[#fdf0f0] px-3 py-2 text-xs font-semibold text-[#b54040] hover:bg-[#fae0e0]">
                  Hapus Gambar
                </button>
              </div>
            )}
            <FormField label="Atau URL Gambar">
              <input className={inputClass} placeholder="https://..." value={form.url_gambar} onChange={e => setForm(f => ({ ...f, url_gambar: e.target.value }))} />
            </FormField>
            <FormField label="Urutan Tampil">
              <input type="number" className={inputClass} value={form.urutan_tampil} onChange={e => setForm(f => ({ ...f, urutan_tampil: e.target.value }))} />
            </FormField>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { resetSelectedImage(); setModalOpen(false); }} className="flex-1 py-3 rounded-xl border border-[#ddd3c2] text-[#7a6e5a] font-semibold text-sm hover:bg-[#ece8df]">Batal</button>
              <button type="submit" disabled={saving || uploadingImage} className="flex-1 py-3 rounded-xl bg-[#7a5b0a] text-white font-semibold text-sm hover:bg-[#684d08] disabled:opacity-50 transition-all">
                {uploadingImage ? 'Mengunggah gambar...' : saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && <ConfirmDialog message="Data kabar ini akan dihapus permanen." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
