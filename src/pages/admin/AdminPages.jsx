import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
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
  return <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"><div className="bg-[#faf7f0] rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center"><div className="text-4xl mb-4">🗑️</div><p className="font-heading text-lg font-bold text-[#3f2d11] mb-2">Hapus Data?</p><p className="text-[#9f8e78] text-sm mb-6">{message}</p><div className="flex gap-3"><button onClick={onCancel} className="flex-1 px-4 py-2.5 rounded-xl border border-[#ddd3c2] text-[#7a6e5a] font-semibold text-sm">Batal</button><button onClick={onConfirm} className="flex-1 px-4 py-2.5 rounded-xl bg-[#b54040] text-white font-semibold text-sm">Ya, Hapus</button></div></div></div>;
}
function Toast({ message, type }) {
  if (!message) return null;
  const c = { success: 'bg-[#f0fdf4] border-[#86efac] text-[#166534]', error: 'bg-[#fdf0f0] border-[#fca5a5] text-[#b54040]' };
  return <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-lg text-sm font-semibold ${c[type]}`}><span>{type === 'success' ? '✅' : '❌'}</span>{message}</div>;
}

// ── Generic List Admin Page Factory ──────────────────────────────────────────
function AdminListPage({ title, icon, table, columns, emptyText, formFields, emptyForm, rowRenderer }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (msg, type = 'success') => { setToast({ message: msg, type }); setTimeout(() => setToast({ message: '', type: 'success' }), 3000); };

  const fetchItems = async () => {
    setLoading(true);
    const { data } = await supabase.from(table).select('*').order('urutan_tampil', { ascending: true });
    setItems(data || []);
    setLoading(false);
  };
  useEffect(() => { fetchItems(); }, []);

  const openAdd = () => { setEditItem(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (item) => { setEditItem(item); setForm(Object.fromEntries(Object.keys(emptyForm).map(k => [k, item[k] ?? emptyForm[k]]))); setModalOpen(true); };

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true);
    const payload = { ...form, urutan_tampil: Number(form.urutan_tampil) };
    const { error } = editItem ? await supabase.from(table).update(payload).eq('id', editItem.id) : await supabase.from(table).insert(payload);
    if (error) showToast('Gagal menyimpan.', 'error');
    else { showToast(editItem ? 'Berhasil diperbarui!' : 'Berhasil ditambahkan!'); setModalOpen(false); fetchItems(); }
    setSaving(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from(table).delete().eq('id', deleteId);
    if (error) showToast('Gagal menghapus.', 'error'); else { showToast('Berhasil dihapus!'); fetchItems(); }
    setDeleteId(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#3f2d11]">{icon} {title}</h1>
          <p className="text-[#9f8e78] text-sm mt-1">{emptyText}</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#7a5b0a] text-white font-semibold text-sm hover:bg-[#684d08] shadow-[0_10px_24px_-10px_rgba(122,91,10,0.7)]">
          + Tambah
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-[#ece8df] animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-[#faf7f0] rounded-2xl border border-[#ddd3c2]">
          <div className="text-5xl mb-4">{icon}</div>
          <p className="font-heading font-bold text-[#5a430d]">Belum ada data</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => rowRenderer(item, () => openEdit(item), () => setDeleteId(item.id)))}
        </div>
      )}

      {modalOpen && (
        <Modal title={editItem ? `Edit ${title}` : `Tambah ${title}`} onClose={() => setModalOpen(false)}>
          <form onSubmit={handleSave} className="space-y-4">
            {formFields(form, setForm)}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-[#ddd3c2] text-[#7a6e5a] font-semibold text-sm hover:bg-[#ece8df]">Batal</button>
              <button type="submit" disabled={saving} className="flex-1 py-3 rounded-xl bg-[#7a5b0a] text-white font-semibold text-sm hover:bg-[#684d08] disabled:opacity-50">{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && <ConfirmDialog message="Data ini akan dihapus permanen." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}

// Helper row card
function RowCard({ children, onEdit, onDelete }) {
  return (
    <div className="bg-[#faf7f0] rounded-2xl border border-[#ddd3c2] p-5 flex items-center gap-4 hover:border-[#c59f38] transition-colors">
      <div className="flex-1 min-w-0">{children}</div>
      <div className="flex gap-2 shrink-0">
        <button onClick={onEdit} className="px-3 py-1.5 rounded-lg bg-[#ece8df] text-[#7a5b0a] text-xs font-semibold hover:bg-[#e3ddd4]">Edit</button>
        <button onClick={onDelete} className="px-3 py-1.5 rounded-lg bg-[#fdf0f0] text-[#b54040] text-xs font-semibold hover:bg-[#fae0e0]">Hapus</button>
      </div>
    </div>
  );
}

// ── Admin Video ───────────────────────────────────────────────────────────────
export function AdminVideo() {
  return (
    <AdminListPage
      title="Video Dokumentasi"
      icon="🎬"
      table="video_dokumentasi"
      emptyText="Kelola video kegiatan padukuhan"
      emptyForm={{ judul: '', durasi: '', url_gambar: '', url_video: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Judul *"><input required className={inputClass} value={form.judul} onChange={e => setForm(f => ({ ...f, judul: e.target.value }))} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Durasi (mis. 05:42)"><input className={inputClass} placeholder="mm:ss" value={form.durasi} onChange={e => setForm(f => ({ ...f, durasi: e.target.value }))} /></FormField>
            <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={e => setForm(f => ({ ...f, urutan_tampil: e.target.value }))} /></FormField>
          </div>
          <FormField label="URL Thumbnail"><input className={inputClass} placeholder="https://..." value={form.url_gambar} onChange={e => setForm(f => ({ ...f, url_gambar: e.target.value }))} /></FormField>
          <FormField label="URL Video"><input className={inputClass} placeholder="https://youtube.com/..." value={form.url_video} onChange={e => setForm(f => ({ ...f, url_video: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-3">
            {item.url_gambar && <img src={item.url_gambar} alt={item.judul} className="w-16 h-16 rounded-lg object-cover" />}
            <div>
              <p className="font-heading font-bold text-[#3f2d11]">{item.judul}</p>
              <p className="text-xs text-[#9f8e78]">Durasi: {item.durasi || '-'} · Urutan: {item.urutan_tampil}</p>
              {item.url_video && <a href={item.url_video} target="_blank" rel="noreferrer" className="text-xs text-[#7a5b0a] underline">Lihat video ↗</a>}
            </div>
          </div>
        </RowCard>
      )}
    />
  );
}

// ── Admin Statistik Desa ──────────────────────────────────────────────────────
export function AdminStatistikDesa() {
  return (
    <AdminListPage
      title="Statistik Desa"
      icon="📈"
      table="statistik_desa"
      emptyText="Data kependudukan dan statistik padukuhan"
      emptyForm={{ label: '', value: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Label *"><input required className={inputClass} placeholder="mis. Total Penduduk" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} /></FormField>
          <FormField label="Nilai *"><input required className={inputClass} placeholder="mis. 4.520" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={e => setForm(f => ({ ...f, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#fffbeb] border border-[#f0cc5a] flex items-center justify-center">
              <span className="font-heading text-lg font-extrabold text-[#7a5b0a] leading-tight text-center px-1">{item.value}</span>
            </div>
            <div>
              <p className="font-heading font-bold text-[#3f2d11]">{item.label}</p>
              <p className="text-xs text-[#9f8e78]">Urutan: {item.urutan_tampil}</p>
            </div>
          </div>
        </RowCard>
      )}
    />
  );
}

// ── Admin Statistik Profil ────────────────────────────────────────────────────
export function AdminStatistikProfil() {
  return (
    <AdminListPage
      title="Statistik Profil"
      icon="🏘️"
      table="statistik_profil"
      emptyText="Data profil padukuhan (tahun berdiri, dusun aktif, dll)"
      emptyForm={{ label: '', value: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Label *"><input required className={inputClass} placeholder="mis. Tahun Berdiri" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} /></FormField>
          <FormField label="Nilai *"><input required className={inputClass} placeholder="mis. 1924" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={e => setForm(f => ({ ...f, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#f0fdf4] border border-[#86efac] flex items-center justify-center">
              <span className="font-heading text-base font-extrabold text-[#166534]">{item.value}</span>
            </div>
            <div>
              <p className="font-heading font-bold text-[#3f2d11]">{item.label}</p>
              <p className="text-xs text-[#9f8e78]">Urutan: {item.urutan_tampil}</p>
            </div>
          </div>
        </RowCard>
      )}
    />
  );
}

// ── Admin Aparatur Desa ───────────────────────────────────────────────────────
export function AdminAparatur() {
  return (
    <AdminListPage
      title="Aparatur Desa"
      icon="👥"
      table="aparatur_desa"
      emptyText="Data perangkat dan aparatur padukuhan"
      emptyForm={{ nama: '', peran: '', url_foto: '', bio: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nama *"><input required className={inputClass} value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))} /></FormField>
            <FormField label="Peran/Jabatan *"><input required className={inputClass} placeholder="mis. Kepala Padukuhan" value={form.peran} onChange={e => setForm(f => ({ ...f, peran: e.target.value }))} /></FormField>
          </div>
          <FormField label="URL Foto"><input className={inputClass} placeholder="https://..." value={form.url_foto} onChange={e => setForm(f => ({ ...f, url_foto: e.target.value }))} /></FormField>
          <FormField label="Bio/Deskripsi"><textarea rows={3} className={inputClass} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={e => setForm(f => ({ ...f, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            {item.url_foto ? (
              <img src={item.url_foto} alt={item.nama} className="w-14 h-14 rounded-full object-cover border-2 border-[#ddd3c2]" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#7a5b0a] flex items-center justify-center text-white font-heading font-bold text-xl">
                {item.nama.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <p className="font-heading font-bold text-[#3f2d11]">{item.nama}</p>
              <p className="text-sm text-[#9f8e78]">{item.peran}</p>
              <p className="text-xs text-[#b0a08a]">Urutan: {item.urutan_tampil}</p>
            </div>
          </div>
        </RowCard>
      )}
    />
  );
}

// ── Admin Batas Wilayah ───────────────────────────────────────────────────────
export function AdminBatasWilayah() {
  return (
    <AdminListPage
      title="Batas Wilayah"
      icon="🗺️"
      table="batas_wilayah_desa"
      emptyText="Data batas wilayah padukuhan"
      emptyForm={{ arah: '', deskripsi: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Arah *"><input required className={inputClass} placeholder="mis. Batas Utara" value={form.arah} onChange={e => setForm(f => ({ ...f, arah: e.target.value }))} /></FormField>
          <FormField label="Deskripsi *"><textarea required rows={3} className={inputClass} value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={e => setForm(f => ({ ...f, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#f0cc5a] flex items-center justify-center text-[#5e4300] font-heading font-bold">
              {item.arah.split(' ')[1]?.slice(0, 1) || 'B'}
            </div>
            <div>
              <p className="font-heading font-bold text-[#3f2d11]">{item.arah}</p>
              <p className="text-sm text-[#9f8e78] line-clamp-2">{item.deskripsi}</p>
            </div>
          </div>
        </RowCard>
      )}
    />
  );
}

// ── Admin Navigasi ────────────────────────────────────────────────────────────
export function AdminNavigasi() {
  return (
    <AdminListPage
      title="Tautan Navigasi"
      icon="🔗"
      table="tautan_navigasi"
      emptyText="Kelola tautan navigasi menu website"
      emptyForm={{ label: '', href: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Label *"><input required className={inputClass} placeholder="mis. Beranda" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} /></FormField>
          <FormField label="URL/Path *"><input required className={inputClass} placeholder="mis. / atau /profil-desa" value={form.href} onChange={e => setForm(f => ({ ...f, href: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={e => setForm(f => ({ ...f, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#ece8df] flex items-center justify-center text-[#7a5b0a] font-bold text-sm">
              🔗
            </div>
            <div>
              <p className="font-heading font-bold text-[#3f2d11]">{item.label}</p>
              <p className="text-sm text-[#9f8e78] font-mono">{item.href}</p>
              <p className="text-xs text-[#b0a08a]">Urutan: {item.urutan_tampil}</p>
            </div>
          </div>
        </RowCard>
      )}
    />
  );
}
