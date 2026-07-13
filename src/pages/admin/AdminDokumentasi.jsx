import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

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
          <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[#ece8df] text-[#9f8e78] hover:text-[#5a430d] font-bold text-lg">✕</button>
        </div>
        <div className="p-7">{children}</div>
      </div>
    </div>
  );
}

const inputClass = "w-full px-4 py-2.5 rounded-xl border border-[#ddd3c2] bg-white text-[#3f2d11] placeholder-[#c5b9a8] focus:outline-none focus:ring-2 focus:ring-[#7a5b0a] focus:border-[#7a5b0a] transition-all text-sm";
function FormField({ label, children }) { return <div><label className="block text-sm font-semibold text-[#5a430d] mb-2">{label}</label>{children}</div>; }
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"><div className="bg-[#faf7f0] rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"><div className="text-4xl mb-4">🗑️</div><p className="font-heading text-lg font-bold text-[#3f2d11] mb-2">Hapus Data?</p><p className="text-[#9f8e78] text-sm mb-6">{message}</p><div className="flex gap-3"><button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-[#ddd3c2] text-[#7a6e5a] font-semibold text-sm hover:bg-[#ece8df]">Batal</button><button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-[#b54040] text-white font-semibold text-sm hover:bg-[#9a3535]">Ya, Hapus</button></div></div></div>;
}
function Toast({ message, type }) {
  if (!message) return null;
  const c = { success: 'bg-[#f0fdf4] border-[#86efac] text-[#166534]', error: 'bg-[#fdf0f0] border-[#fca5a5] text-[#b54040]' };
  return <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-lg text-sm font-semibold ${c[type]}`}><span>{type === 'success' ? '✅' : '❌'}</span>{message}</div>;
}

// ── Foto sub-manager ──────────────────────────────────────────────────────────
function FotoManager({ postingId, onClose }) {
  const [fotos, setFotos] = useState([]);
  const [form, setForm] = useState({ url_foto: '', teks_alt: '', urutan_tampil: 0 });
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from('foto_dokumentasi').select('*').eq('posting_id', postingId).order('urutan_tampil');
    setFotos(data || []);
  };
  useEffect(() => { fetch(); }, [postingId]);

  const addFoto = async (e) => {
    e.preventDefault(); setSaving(true);
    await supabase.from('foto_dokumentasi').insert({ ...form, posting_id: postingId, urutan_tampil: Number(form.urutan_tampil) });
    setForm({ url_foto: '', teks_alt: '', urutan_tampil: 0 }); fetch(); setSaving(false);
  };
  const deleteFoto = async (id) => {
    await supabase.from('foto_dokumentasi').delete().eq('id', id); fetch();
  };

  return (
    <Modal title="Kelola Foto Dokumentasi" onClose={onClose}>
      <div className="space-y-5">
        <form onSubmit={addFoto} className="space-y-3 bg-[#fffbeb] p-4 rounded-xl border border-[#f0cc5a]">
          <p className="text-sm font-bold text-[#5e4300]">➕ Tambah Foto Baru</p>
          <FormField label="URL Foto *"><input required className={inputClass} placeholder="https://..." value={form.url_foto} onChange={e => setForm(f => ({ ...f, url_foto: e.target.value }))} /></FormField>
          <FormField label="Teks Alt"><input className={inputClass} placeholder="Deskripsi foto..." value={form.teks_alt} onChange={e => setForm(f => ({ ...f, teks_alt: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={e => setForm(f => ({ ...f, urutan_tampil: e.target.value }))} /></FormField>
          <button type="submit" disabled={saving} className="w-full py-2.5 rounded-xl bg-[#7a5b0a] text-white font-semibold text-sm hover:bg-[#684d08] disabled:opacity-50">{saving ? 'Menambahkan...' : 'Tambah Foto'}</button>
        </form>

        <div className="space-y-2">
          {fotos.length === 0 ? <p className="text-center text-sm text-[#9f8e78] py-4">Belum ada foto.</p> : fotos.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#ddd3c2]">
              <img src={f.url_foto} alt={f.teks_alt} className="w-14 h-14 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#3f2d11] truncate">{f.teks_alt || 'Tanpa deskripsi'}</p>
                <p className="text-xs text-[#9f8e78]">Urutan: {f.urutan_tampil}</p>
              </div>
              <button onClick={() => deleteFoto(f.id)} className="px-3 py-1.5 rounded-lg bg-[#fdf0f0] text-[#b54040] text-xs font-semibold hover:bg-[#fae0e0]">Hapus</button>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const EMPTY = { kategori_id: '', judul: '', ringkasan: '', url_gambar: '', tanggal_terbit: '', urutan_tampil: 0 };

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

  const showToast = (msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast({ message: '', type: 'success' }), 3000); };

  const fetch = async () => {
    setLoading(true);
    const [{ data: posts }, { data: kats }] = await Promise.all([
      supabase.from('posting_dokumentasi').select('*, kategori:kategori_dokumentasi(id,nama)').order('urutan_tampil'),
      supabase.from('kategori_dokumentasi').select('*').order('urutan_tampil'),
    ]);
    setItems(posts || []);
    setKategori(kats || []);
    setLoading(false);
  };
  useEffect(() => { fetch(); }, []);

  const openAdd = () => { setEditItem(null); setForm(EMPTY); setModalOpen(true); };
  const openEdit = (item) => {
    setEditItem(item);
    setForm({ kategori_id: item.kategori_id || '', judul: item.judul, ringkasan: item.ringkasan, url_gambar: item.url_gambar || '', tanggal_terbit: item.tanggal_terbit || '', urutan_tampil: item.urutan_tampil });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, urutan_tampil: Number(form.urutan_tampil), kategori_id: form.kategori_id || null };
    const { error } = editItem ? await supabase.from('posting_dokumentasi').update(payload).eq('id', editItem.id) : await supabase.from('posting_dokumentasi').insert(payload);
    if (error) showToast('Gagal menyimpan.', 'error');
    else { showToast(editItem ? 'Berhasil diperbarui!' : 'Berhasil ditambahkan!'); setModalOpen(false); fetch(); }
    setSaving(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('posting_dokumentasi').delete().eq('id', deleteId);
    if (error) showToast('Gagal menghapus.', 'error'); else { showToast('Berhasil dihapus!'); fetch(); }
    setDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#3f2d11]">Dokumentasi Kegiatan</h1>
          <p className="text-[#9f8e78] text-sm mt-1">Kelola posting dokumentasi dan foto kegiatan</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7a5b0a] text-white font-semibold text-sm hover:bg-[#684d08] transition-all shadow-[0_10px_24px_-10px_rgba(122,91,10,0.7)]">
          + Tambah Posting
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-[#ece8df] animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-[#faf7f0] rounded-2xl border border-[#ddd3c2]">
          <div className="text-5xl mb-4">📷</div>
          <p className="font-heading font-bold text-[#5a430d]">Belum ada posting</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-[#faf7f0] rounded-2xl border border-[#ddd3c2] p-5 flex gap-4 items-start hover:border-[#c59f38] transition-colors">
              {item.url_gambar && <img src={item.url_gambar} alt={item.judul} className="w-20 h-20 rounded-xl object-cover shrink-0" />}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-full bg-[#f0cc5a] text-[#5e4300] text-xs font-bold">{item.kategori?.nama || 'Tanpa Kategori'}</span>
                  {item.tanggal_terbit && <span className="text-xs text-[#9f8e78]">{item.tanggal_terbit}</span>}
                  <span className="text-xs text-[#b0a08a] ml-auto">Urutan: {item.urutan_tampil}</span>
                </div>
                <h3 className="font-heading font-bold text-[#3f2d11] truncate">{item.judul}</h3>
                <p className="text-sm text-[#9f8e78] line-clamp-2 mt-1">{item.ringkasan}</p>
              </div>
              <div className="flex gap-2 shrink-0 flex-wrap">
                <button onClick={() => setFotoPostingId(item.id)} className="px-3 py-1.5 rounded-lg bg-[#fffbeb] text-[#5e4300] border border-[#f0cc5a] text-xs font-semibold hover:bg-[#fef9c3]">📷 Foto</button>
                <button onClick={() => openEdit(item)} className="px-3 py-1.5 rounded-lg bg-[#ece8df] text-[#7a5b0a] text-xs font-semibold hover:bg-[#e3ddd4]">Edit</button>
                <button onClick={() => setDeleteId(item.id)} className="px-3 py-1.5 rounded-lg bg-[#fdf0f0] text-[#b54040] text-xs font-semibold hover:bg-[#fae0e0]">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editItem ? 'Edit Posting' : 'Tambah Posting Baru'} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Kategori">
                <select className={inputClass} value={form.kategori_id} onChange={e => setForm(f => ({ ...f, kategori_id: e.target.value }))}>
                  <option value="">-- Pilih Kategori --</option>
                  {kategori.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
                </select>
              </FormField>
              <FormField label="Tanggal">
                <input type="date" className={inputClass} value={form.tanggal_terbit} onChange={e => setForm(f => ({ ...f, tanggal_terbit: e.target.value }))} />
              </FormField>
            </div>
            <FormField label="Judul *"><input required className={inputClass} placeholder="Judul kegiatan..." value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} /></FormField>
            <FormField label="Ringkasan *"><textarea required rows={4} className={inputClass} value={form.ringkasan} onChange={e => setForm(f => ({ ...f, ringkasan: e.target.value }))} /></FormField>
            <FormField label="URL Gambar Cover"><input className={inputClass} placeholder="https://..." value={form.url_gambar} onChange={e => setForm(f => ({ ...f, url_gambar: e.target.value }))} /></FormField>
            <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={e => setForm(f => ({ ...f, urutan_tampil: e.target.value }))} /></FormField>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-[#ddd3c2] text-[#7a6e5a] font-semibold text-sm hover:bg-[#ece8df]">Batal</button>
              <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-[#7a5b0a] text-white font-semibold text-sm hover:bg-[#684d08] disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
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
