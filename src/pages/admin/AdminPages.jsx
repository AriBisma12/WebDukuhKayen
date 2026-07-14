import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { SITE_IMAGES_BUCKET, uploadPublicImage } from '../../lib/storage';

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2d2008]/60 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[1.8rem] bg-[#faf7f0] shadow-[0_32px_80px_-24px_rgba(38,24,4,0.7)]" onClick={(event) => event.stopPropagation()}>
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
          <button onClick={onCancel} className="flex-1 rounded-xl border border-[#ddd3c2] px-4 py-2.5 text-sm font-semibold text-[#7a6e5a]">
            Batal
          </button>
          <button onClick={onConfirm} className="flex-1 rounded-xl bg-[#b54040] px-4 py-2.5 text-sm font-semibold text-white">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  const classes = {
    success: 'bg-[#f0fdf4] border-[#86efac] text-[#166534]',
    error: 'bg-[#fdf0f0] border-[#fca5a5] text-[#b54040]',
  };
  const icon = type === 'success' ? 'OK' : 'ERR';
  return (
    <div className={`fixed bottom-6 right-6 z-[70] flex items-center gap-3 rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-lg ${classes[type]}`}>
      <span>{icon}</span>
      {message}
    </div>
  );
}

function ImageUploadField({ label, folder, currentUrl, selectedFile, previewUrl, onFileChange, onClear }) {
  const inputRef = useRef(null);

  return (
    <div className="space-y-3">
      <FormField label={label}>
        <div className="space-y-3">
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
          <button type="button" onClick={() => inputRef.current?.click()} className="w-full rounded-xl border border-[#ddd3c2] bg-white px-4 py-3 text-sm font-semibold text-[#5a430d] transition-colors hover:bg-[#f7f2e8]">
            Pilih Gambar Dari Perangkat
          </button>
          <p className="text-xs text-[#9f8e78]">
            File akan diunggah ke bucket <span className="font-semibold text-[#7a5b0a]">{SITE_IMAGES_BUCKET}</span> pada folder <span className="font-semibold text-[#7a5b0a]">{folder}</span>.
          </p>
          {selectedFile && <p className="text-xs font-medium text-[#7a5b0a]">File terpilih: {selectedFile.name}</p>}
        </div>
      </FormField>
      {(previewUrl || currentUrl) && (
        <div className="space-y-3 rounded-2xl border border-[#ddd3c2] bg-[#fffdf8] p-4">
          <p className="text-sm font-semibold text-[#5a430d]">Preview Gambar</p>
          <img src={previewUrl || currentUrl} alt="Preview gambar" className="h-40 w-full rounded-xl object-cover" />
          <button type="button" onClick={onClear} className="rounded-lg bg-[#fdf0f0] px-3 py-2 text-xs font-semibold text-[#b54040] hover:bg-[#fae0e0]">
            Hapus Gambar
          </button>
        </div>
      )}
    </div>
  );
}

function AdminListPage({ title, icon, table, emptyText, formFields, emptyForm, rowRenderer, imageUploadConfig = null }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
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
    const { data } = await supabase.from(table).select('*').order('urutan_tampil', { ascending: true });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => () => {
    if (imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
  }, [imagePreviewUrl]);

  const resetSelectedImage = () => {
    if (imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImageFile(null);
    setImagePreviewUrl('');
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      showToast('File harus berupa gambar.', 'error');
      return;
    }
    if (imagePreviewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviewUrl);
    }
    setSelectedImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const openAdd = () => {
    setEditItem(null);
    setForm(emptyForm);
    resetSelectedImage();
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditItem(item);
    setForm(Object.fromEntries(Object.keys(emptyForm).map((key) => [key, item[key] ?? emptyForm[key]])));
    resetSelectedImage();
    setModalOpen(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, urutan_tampil: Number(form.urutan_tampil) };

      if (imageUploadConfig && selectedImageFile) {
        setUploadingImage(true);
        payload[imageUploadConfig.fieldName] = await uploadPublicImage(selectedImageFile, imageUploadConfig.folder);
      }

      const { error } = editItem
        ? await supabase.from(table).update(payload).eq('id', editItem.id)
        : await supabase.from(table).insert(payload);

      if (error) {
        showToast('Gagal menyimpan.', 'error');
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
    const { error } = await supabase.from(table).delete().eq('id', deleteId);
    if (error) {
      showToast('Gagal menghapus.', 'error');
    } else {
      showToast('Berhasil dihapus!');
      fetchItems();
    }
    setDeleteId(null);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-extrabold text-[#3f2d11]">{icon} {title}</h1>
          <p className="mt-1 text-sm text-[#9f8e78]">{emptyText}</p>
        </div>
        <button onClick={openAdd} className="flex min-h-[56px] w-full items-center justify-center gap-2 rounded-2xl bg-[#7a5b0a] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-10px_rgba(122,91,10,0.7)] hover:bg-[#684d08] sm:w-auto sm:min-w-[168px]">
          + Tambah
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, index) => <div key={index} className="h-20 rounded-2xl bg-[#ece8df] animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-[#ddd3c2] bg-[#faf7f0] py-16 text-center">
          <div className="mb-4 text-5xl">{icon}</div>
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
            {formFields(form, setForm, {
              uploadingImage,
              selectedImageFile,
              imagePreviewUrl,
              handleImageChange,
              resetSelectedImage,
              ImageUploadField,
            })}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => { resetSelectedImage(); setModalOpen(false); }} className="flex-1 rounded-xl border border-[#ddd3c2] py-3 text-sm font-semibold text-[#7a6e5a] hover:bg-[#ece8df]">
                Batal
              </button>
              <button type="submit" disabled={saving || uploadingImage} className="flex-1 rounded-xl bg-[#7a5b0a] py-3 text-sm font-semibold text-white hover:bg-[#684d08] disabled:opacity-50">
                {uploadingImage ? 'Mengunggah gambar...' : saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {deleteId && <ConfirmDialog message="Data ini akan dihapus permanen." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}

function RowCard({ children, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-[#ddd3c2] bg-[#faf7f0] p-5 transition-colors hover:border-[#c59f38] sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">{children}</div>
      <div className="flex w-full gap-2 sm:w-auto sm:shrink-0">
        <button onClick={onEdit} className="flex-1 rounded-lg bg-[#ece8df] px-3 py-2 text-xs font-semibold text-[#7a5b0a] hover:bg-[#e3ddd4] sm:flex-none">
          Edit
        </button>
        <button onClick={onDelete} className="flex-1 rounded-lg bg-[#fdf0f0] px-3 py-2 text-xs font-semibold text-[#b54040] hover:bg-[#fae0e0] sm:flex-none">
          Hapus
        </button>
      </div>
    </div>
  );
}

export function AdminVideo() {
  return (
    <AdminListPage
      title="Video Dokumentasi"
      icon="FILM"
      table="video_dokumentasi"
      emptyText="Kelola video kegiatan padukuhan"
      emptyForm={{ judul: '', durasi: '', url_gambar: '', url_video: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Judul *"><input required className={inputClass} value={form.judul} onChange={(e) => setForm((current) => ({ ...current, judul: e.target.value }))} /></FormField>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Durasi (mis. 05:42)"><input className={inputClass} placeholder="mm:ss" value={form.durasi} onChange={(e) => setForm((current) => ({ ...current, durasi: e.target.value }))} /></FormField>
            <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={(e) => setForm((current) => ({ ...current, urutan_tampil: e.target.value }))} /></FormField>
          </div>
          <FormField label="URL Thumbnail"><input className={inputClass} placeholder="https://..." value={form.url_gambar} onChange={(e) => setForm((current) => ({ ...current, url_gambar: e.target.value }))} /></FormField>
          <FormField label="URL Video"><input className={inputClass} placeholder="https://youtube.com/..." value={form.url_video} onChange={(e) => setForm((current) => ({ ...current, url_video: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-3">
            {item.url_gambar && <img src={item.url_gambar} alt={item.judul} className="h-16 w-16 rounded-lg object-cover" />}
            <div>
              <p className="font-heading font-bold text-[#3f2d11]">{item.judul}</p>
              <p className="text-xs text-[#9f8e78]">Durasi: {item.durasi || '-'} · Urutan: {item.urutan_tampil}</p>
              {item.url_video && <a href={item.url_video} target="_blank" rel="noreferrer" className="text-xs text-[#7a5b0a] underline">Lihat video</a>}
            </div>
          </div>
        </RowCard>
      )}
    />
  );
}

export function AdminStatistikDesa() {
  return (
    <AdminListPage
      title="Statistik Desa"
      icon="STAT"
      table="statistik_desa"
      emptyText="Data kependudukan dan statistik padukuhan"
      emptyForm={{ label: '', value: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Label *"><input required className={inputClass} placeholder="mis. Total Penduduk" value={form.label} onChange={(e) => setForm((current) => ({ ...current, label: e.target.value }))} /></FormField>
          <FormField label="Nilai *"><input required className={inputClass} placeholder="mis. 4.520" value={form.value} onChange={(e) => setForm((current) => ({ ...current, value: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={(e) => setForm((current) => ({ ...current, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#f0cc5a] bg-[#fffbeb]">
              <span className="px-1 text-center font-heading text-lg font-extrabold text-[#7a5b0a] leading-tight">{item.value}</span>
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

export function AdminStatistikProfil() {
  return (
    <AdminListPage
      title="Statistik Profil"
      icon="PROFIL"
      table="statistik_profil"
      emptyText="Data profil padukuhan (tahun berdiri, dusun aktif, dll)"
      emptyForm={{ label: '', value: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Label *"><input required className={inputClass} placeholder="mis. Tahun Berdiri" value={form.label} onChange={(e) => setForm((current) => ({ ...current, label: e.target.value }))} /></FormField>
          <FormField label="Nilai *"><input required className={inputClass} placeholder="mis. 1924" value={form.value} onChange={(e) => setForm((current) => ({ ...current, value: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={(e) => setForm((current) => ({ ...current, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-[#86efac] bg-[#f0fdf4] sm:h-14 sm:w-14 sm:rounded-xl">
              <span className="px-2 text-center font-heading text-2xl font-extrabold text-[#166534] sm:px-0 sm:text-base">{item.value}</span>
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

export function AdminAparatur() {
  return (
    <AdminListPage
      title="Aparatur Desa"
      icon="AP"
      table="aparatur_desa"
      emptyText="Data perangkat dan aparatur padukuhan"
      emptyForm={{ nama: '', peran: '', url_foto: '', bio: '', urutan_tampil: 0 }}
      imageUploadConfig={{ fieldName: 'url_foto', folder: 'aparatur' }}
      formFields={(form, setForm, imageState) => (
        <>
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Nama *"><input required className={inputClass} value={form.nama} onChange={(e) => setForm((current) => ({ ...current, nama: e.target.value }))} /></FormField>
            <FormField label="Peran/Jabatan *"><input required className={inputClass} placeholder="mis. Kepala Padukuhan" value={form.peran} onChange={(e) => setForm((current) => ({ ...current, peran: e.target.value }))} /></FormField>
          </div>
          <imageState.ImageUploadField
            label="Foto"
            folder="aparatur"
            currentUrl={form.url_foto}
            selectedFile={imageState.selectedImageFile}
            previewUrl={imageState.imagePreviewUrl}
            onFileChange={imageState.handleImageChange}
            onClear={() => {
              imageState.resetSelectedImage();
              setForm((current) => ({ ...current, url_foto: '' }));
            }}
          />
          <FormField label="Atau URL Foto"><input className={inputClass} placeholder="https://..." value={form.url_foto} onChange={(e) => setForm((current) => ({ ...current, url_foto: e.target.value }))} /></FormField>
          <FormField label="Bio/Deskripsi"><textarea rows={3} className={inputClass} value={form.bio} onChange={(e) => setForm((current) => ({ ...current, bio: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={(e) => setForm((current) => ({ ...current, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            {item.url_foto ? (
              <img src={item.url_foto} alt={item.nama} className="h-14 w-14 rounded-full border-2 border-[#ddd3c2] object-cover" />
            ) : (
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7a5b0a] text-xl font-bold text-white">
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

export function AdminBatasWilayah() {
  return (
    <AdminListPage
      title="Batas Wilayah"
      icon="BATAS"
      table="batas_wilayah_desa"
      emptyText="Data batas wilayah padukuhan"
      emptyForm={{ arah: '', deskripsi: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Arah *"><input required className={inputClass} placeholder="mis. Batas Utara" value={form.arah} onChange={(e) => setForm((current) => ({ ...current, arah: e.target.value }))} /></FormField>
          <FormField label="Deskripsi *"><textarea required rows={3} className={inputClass} value={form.deskripsi} onChange={(e) => setForm((current) => ({ ...current, deskripsi: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={(e) => setForm((current) => ({ ...current, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-[1.25rem] bg-[#f0cc5a] font-heading text-2xl font-bold text-[#5e4300] sm:h-12 sm:w-12 sm:rounded-xl sm:text-base">
              {item.arah.split(' ')[1]?.slice(0, 1) || 'B'}
            </div>
            <div>
              <p className="font-heading font-bold text-[#3f2d11]">{item.arah}</p>
              <p className="line-clamp-2 text-sm text-[#9f8e78]">{item.deskripsi}</p>
            </div>
          </div>
        </RowCard>
      )}
    />
  );
}

export function AdminNavigasi() {
  return (
    <AdminListPage
      title="Tautan Navigasi"
      icon="LINK"
      table="tautan_navigasi"
      emptyText="Kelola tautan navigasi menu website"
      emptyForm={{ label: '', href: '', urutan_tampil: 0 }}
      formFields={(form, setForm) => (
        <>
          <FormField label="Label *"><input required className={inputClass} placeholder="mis. Beranda" value={form.label} onChange={(e) => setForm((current) => ({ ...current, label: e.target.value }))} /></FormField>
          <FormField label="URL/Path *"><input required className={inputClass} placeholder="mis. / atau /profil-desa" value={form.href} onChange={(e) => setForm((current) => ({ ...current, href: e.target.value }))} /></FormField>
          <FormField label="Urutan"><input type="number" className={inputClass} value={form.urutan_tampil} onChange={(e) => setForm((current) => ({ ...current, urutan_tampil: e.target.value }))} /></FormField>
        </>
      )}
      rowRenderer={(item, onEdit, onDelete) => (
        <RowCard key={item.id} onEdit={onEdit} onDelete={onDelete}>
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ece8df] text-sm font-bold text-[#7a5b0a]">
              L
            </div>
            <div>
              <p className="font-heading font-bold text-[#3f2d11]">{item.label}</p>
              <p className="font-mono text-sm text-[#9f8e78]">{item.href}</p>
              <p className="text-xs text-[#b0a08a]">Urutan: {item.urutan_tampil}</p>
            </div>
          </div>
        </RowCard>
      )}
    />
  );
}
