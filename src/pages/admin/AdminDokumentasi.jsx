import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const esc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', esc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', esc);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d2008]/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.8rem] bg-[#faf7f0] shadow-[0_32px_80px_-24px_rgba(38,24,4,0.7)]" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-[#ddd3c2] px-7 py-5">
          <h3 className="font-heading text-xl font-bold text-[#3f2d11]">{title}</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full text-lg font-bold text-[#9f8e78] hover:bg-[#ece8df] hover:text-[#5a430d]">
            X
          </button>
        </div>
        <div className="p-7">{children}</div>
      </div>
    </div>
  );
}

const inputClass =
  'w-full rounded-xl border border-[#ddd3c2] bg-white px-4 py-2.5 text-sm text-[#3f2d11] placeholder-[#c5b9a8] transition-all focus:border-[#7a5b0a] focus:outline-none focus:ring-2 focus:ring-[#7a5b0a]';

function FormField({ label, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#5a430d]">{label}</label>
      {children}
    </div>
  );
}

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-[#faf7f0] p-8 text-center shadow-2xl">
        <div className="mb-4 text-4xl">DEL</div>
        <p className="mb-2 font-heading text-lg font-bold text-[#3f2d11]">Hapus Data?</p>
        <p className="mb-6 text-sm text-[#9f8e78]">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 rounded-xl border border-[#ddd3c2] px-4 py-2.5 text-sm font-semibold text-[#7a6e5a] hover:bg-[#ece8df]">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-[#b54040] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#9a3535]">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  const c = {
    success: 'bg-[#f0fdf4] border-[#86efac] text-[#166534]',
    error: 'bg-[#fdf0f0] border-[#fca5a5] text-[#b54040]',
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-lg ${c[type]}`}>
      <span>{type === 'success' ? 'OK' : 'ERR'}</span>
      {message}
    </div>
  );
}

function FotoManager({ postingId, onClose }) {
  const [fotos, setFotos] = useState([]);
  const [form, setForm] = useState({ url_foto: '', teks_alt: '', urutan_tampil: 0 });
  const [saving, setSaving] = useState(false);

  const fetchFotos = async () => {
    const { data } = await supabase
      .from('foto_dokumentasi')
      .select('*')
      .eq('posting_id', postingId)
      .order('urutan_tampil');
    setFotos(data || []);
  };

  useEffect(() => {
    fetchFotos();
  }, [postingId]);

  const addFoto = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase
      .from('foto_dokumentasi')
      .insert({ ...form, posting_id: postingId, urutan_tampil: Number(form.urutan_tampil) });
    setForm({ url_foto: '', teks_alt: '', urutan_tampil: 0 });
    await fetchFotos();
    setSaving(false);
  };

  const deleteFoto = async (id) => {
    await supabase.from('foto_dokumentasi').delete().eq('id', id);
    fetchFotos();
  };

  return (
    <Modal title="Kelola Foto Dokumentasi" onClose={onClose}>
      <div className="space-y-5">
        <form onSubmit={addFoto} className="space-y-3 rounded-xl border border-[#f0cc5a] bg-[#fffbeb] p-4">
          <p className="text-sm font-bold text-[#5e4300]">Tambah Foto Baru</p>
          <FormField label="URL Foto *">
            <input required className={inputClass} placeholder="https://..." value={form.url_foto} onChange={(e) => setForm((f) => ({ ...f, url_foto: e.target.value }))} />
          </FormField>
          <FormField label="Teks Alt">
            <input className={inputClass} placeholder="Deskripsi foto..." value={form.teks_alt} onChange={(e) => setForm((f) => ({ ...f, teks_alt: e.target.value }))} />
          </FormField>
          <FormField label="Urutan">
            <input type="number" className={inputClass} value={form.urutan_tampil} onChange={(e) => setForm((f) => ({ ...f, urutan_tampil: e.target.value }))} />
          </FormField>
          <button type="submit" disabled={saving} className="w-full rounded-xl bg-[#7a5b0a] py-2.5 text-sm font-semibold text-white hover:bg-[#684d08] disabled:opacity-50">
            {saving ? 'Menambahkan...' : 'Tambah Foto'}
          </button>
        </form>

        <div className="space-y-2">
          {fotos.length === 0 ? (
            <p className="py-4 text-center text-sm text-[#9f8e78]">Belum ada foto.</p>
          ) : (
            fotos.map((foto) => (
              <div key={foto.id} className="flex items-center gap-3 rounded-xl border border-[#ddd3c2] bg-white p-3">
                <img src={foto.url_foto} alt={foto.teks_alt} className="h-14 w-14 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#3f2d11]">{foto.teks_alt || 'Tanpa deskripsi'}</p>
                  <p className="text-xs text-[#9f8e78]">Urutan: {foto.urutan_tampil}</p>
                </div>
                <button onClick={() => deleteFoto(foto.id)} className="rounded-lg bg-[#fdf0f0] px-3 py-1.5 text-xs font-semibold text-[#b54040] hover:bg-[#fae0e0]">
                  Hapus
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
}

const EMPTY = {
  kategori_id: '',
  judul: '',
  ringkasan: '',
  url_gambar: '',
  tanggal_terbit: '',
  urutan_tampil: 0,
};

export default function AdminDokumentasi() {
  const [items, setItems] = useState([]);
  const [kategori, setKategori] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [fotoPostingId, setFotoPostingId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const fetchData = async () => {
    setLoading(true);
    const [{ data: posts }, { data: kats }] = await Promise.all([
      supabase.from('posting_dokumentasi').select('*, kategori:kategori_dokumentasi(id,nama)').order('urutan_tampil'),
      supabase.from('kategori_dokumentasi').select('*').order('urutan_tampil'),
    ]);
    setItems(posts || []);
    setKategori(kats || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAdd = () => {
    setEditItem(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm({
      kategori_id: item.kategori_id || '',
      judul: item.judul,
      ringkasan: item.ringkasan,
      url_gambar: item.url_gambar || '',
      tanggal_terbit: item.tanggal_terbit || '',
      urutan_tampil: item.urutan_tampil,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      urutan_tampil: Number(form.urutan_tampil),
      kategori_id: form.kategori_id || null,
    };
    const { error } = editItem
      ? await supabase.from('posting_dokumentasi').update(payload).eq('id', editItem.id)
      : await supabase.from('posting_dokumentasi').insert(payload);
    if (error) {
      showToast('Gagal menyimpan.', 'error');
    } else {
      showToast(editItem ? 'Berhasil diperbarui!' : 'Berhasil ditambahkan!');
      setModalOpen(false);
      fetchData();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('posting_dokumentasi').delete().eq('id', deleteId);
    if (error) {
      showToast('Gagal menghapus.', 'error');
    } else {
      showToast('Berhasil dihapus!');
      fetchData();
    }
    setDeleteId(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#3f2d11]">Dokumentasi Kegiatan</h1>
          <p className="mt-1 text-sm text-[#9f8e78]">Kelola posting dokumentasi dan foto kegiatan</p>
        </div>
        <button onClick={openAdd} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#7a5b0a] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(122,91,10,0.7)] transition-all hover:bg-[#684d08] sm:w-auto sm:min-w-[190px]">
          + Tambah Posting
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-[#ece8df] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[#ddd3c2] bg-[#faf7f0] py-16 text-center">
          <div className="mb-4 text-5xl">DOC</div>
          <p className="font-heading font-bold text-[#5a430d]">Belum ada posting</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 rounded-2xl border border-[#ddd3c2] bg-[#faf7f0] p-5 transition-colors hover:border-[#c59f38] sm:flex-row sm:items-start">
              {item.url_gambar && (
                <img src={item.url_gambar} alt={item.judul} className="h-40 w-full rounded-xl object-cover sm:h-20 sm:w-20 sm:shrink-0" />
              )}

              <div className="min-w-0 flex-1">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-[#f0cc5a] px-2 py-0.5 text-xs font-bold text-[#5e4300]">
                    {item.kategori?.nama || 'Tanpa Kategori'}
                  </span>
                  <button onClick={() => setFotoPostingId(item.id)} className="rounded-lg border border-[#f0cc5a] bg-[#fffbeb] px-3 py-1.5 text-xs font-semibold text-[#5e4300] hover:bg-[#fef9c3]">
                    Foto
                  </button>
                  {item.tanggal_terbit && <span className="text-xs text-[#9f8e78] sm:ml-auto">{item.tanggal_terbit}</span>}
                  <span className="text-xs text-[#b0a08a]">Urutan: {item.urutan_tampil}</span>
                </div>
                <h3 className="font-heading font-bold leading-snug text-[#3f2d11] sm:truncate">{item.judul}</h3>
                <p className="mt-1 line-clamp-3 text-sm text-[#9f8e78]">{item.ringkasan}</p>
              </div>

              <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
                <button onClick={() => openEdit(item)} className="flex-1 rounded-lg bg-[#ece8df] px-3 py-2 text-xs font-semibold text-[#7a5b0a] hover:bg-[#e3ddd4] sm:flex-none">
                  Edit
                </button>
                <button onClick={() => setDeleteId(item.id)} className="flex-1 rounded-lg bg-[#fdf0f0] px-3 py-2 text-xs font-semibold text-[#b54040] hover:bg-[#fae0e0] sm:flex-none">
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editItem ? 'Edit Posting' : 'Tambah Posting Baru'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Kategori">
                <select className={inputClass} value={form.kategori_id} onChange={(e) => setForm((f) => ({ ...f, kategori_id: e.target.value }))}>
                  <option value="">-- Pilih Kategori --</option>
                  {kategori.map((k) => (
                    <option key={k.id} value={k.id}>
                      {k.nama}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Tanggal">
                <input type="date" className={inputClass} value={form.tanggal_terbit} onChange={(e) => setForm((f) => ({ ...f, tanggal_terbit: e.target.value }))} />
              </FormField>
            </div>
            <FormField label="Judul *">
              <input required className={inputClass} placeholder="Judul kegiatan..." value={form.judul} onChange={(e) => setForm((f) => ({ ...f, judul: e.target.value }))} />
            </FormField>
            <FormField label="Ringkasan *">
              <textarea required rows={4} className={inputClass} value={form.ringkasan} onChange={(e) => setForm((f) => ({ ...f, ringkasan: e.target.value }))} />
            </FormField>
            <FormField label="URL Gambar Cover">
              <input className={inputClass} placeholder="https://..." value={form.url_gambar} onChange={(e) => setForm((f) => ({ ...f, url_gambar: e.target.value }))} />
            </FormField>
            <FormField label="Urutan">
              <input type="number" className={inputClass} value={form.urutan_tampil} onChange={(e) => setForm((f) => ({ ...f, urutan_tampil: e.target.value }))} />
            </FormField>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 rounded-xl border border-[#ddd3c2] py-3 text-sm font-semibold text-[#7a6e5a] hover:bg-[#ece8df]">
                Batal
              </button>
              <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-[#7a5b0a] py-3 text-sm font-semibold text-white hover:bg-[#684d08] disabled:opacity-50">
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {fotoPostingId && <FotoManager postingId={fotoPostingId} onClose={() => setFotoPostingId(null)} />}
      {deleteId && <ConfirmDialog message="Posting dan semua foto terkait akan dihapus." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
