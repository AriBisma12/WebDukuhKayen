import { useEffect, useMemo, useRef, useState } from 'react';
import { siteSectionDefaults } from '../../data/site';
import { uploadPublicImage } from '../../lib/storage';
import { supabase } from '../../supabaseClient';

const SECTION_CONFIGS = [
  {
    key: 'home_hero',
    label: 'Beranda Hero',
    description: 'Background utama pada hero halaman beranda.',
    folder: 'tampilan/home-hero',
    fields: [
      { name: 'background_url', label: 'Background', type: 'image' },
    ],
  },
  {
    key: 'home_vision',
    label: 'Beranda Visi Misi',
    description: 'Gambar pada section Visi & Misi di beranda.',
    folder: 'tampilan/home-vision',
    fields: [
      { name: 'image_url', label: 'Gambar', type: 'image' },
    ],
  },
  {
    key: 'footer_contact',
    label: 'Footer Kontak',
    description: 'Informasi alamat, email, dan nomor telepon pada footer.',
    folder: 'tampilan/footer-contact',
    fields: [
      { name: 'address', label: 'Alamat', type: 'textarea' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'phone', label: 'Nomor Telepon', type: 'tel' },
      { name: 'phone_label', label: 'Label Nomor', type: 'text' },
    ],
  },
  {
    key: 'profil_intro',
    label: 'Profil Hero dan Sejarah',
    description: 'Background hero dan gambar section sejarah pada halaman profil padukuhan.',
    folder: 'tampilan/profil-intro',
    fields: [
      { name: 'hero_background_url', label: 'Background Hero', type: 'image' },
      { name: 'history_image_url', label: 'Gambar Sejarah', type: 'image' },
    ],
  },
  {
    key: 'profil_region',
    label: 'Profil Wilayah',
    description: 'Gambar wilayah pada halaman profil padukuhan.',
    folder: 'tampilan/profil-region',
    fields: [
      { name: 'image_url', label: 'Gambar Wilayah', type: 'image' },
    ],
  },
  {
    key: 'dokumentasi_hero',
    label: 'Dokumentasi Hero',
    description: 'Background hero pada halaman dokumentasi kegiatan.',
    folder: 'tampilan/dokumentasi-hero',
    fields: [
      { name: 'background_url', label: 'Background', type: 'image' },
    ],
  },
  {
    key: 'kabar_hero',
    label: 'Kabar Hero',
    description: 'Background hero pada halaman kabar padukuhan.',
    folder: 'tampilan/kabar-hero',
    fields: [
      { name: 'background_url', label: 'Background', type: 'image' },
    ],
  },
];

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

function Toast({ message, type }) {
  if (!message) return null;
  const classes = {
    success: 'bg-[#f0fdf4] border-[#86efac] text-[#166534]',
    error: 'bg-[#fdf0f0] border-[#fca5a5] text-[#b54040]',
  };
  return (
    <div className={`fixed bottom-6 right-6 z-[70] rounded-2xl border px-5 py-3.5 text-sm font-semibold shadow-lg ${classes[type]}`}>
      {message}
    </div>
  );
}

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
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[1.8rem] bg-[#faf7f0] shadow-[0_32px_80px_-24px_rgba(38,24,4,0.7)]" onClick={(event) => event.stopPropagation()}>
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

function ImageField({ label, value, previewUrl, onPick, onClear }) {
  const inputRef = useRef(null);

  return (
    <div className="space-y-3">
      <FormField label={label}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onPick}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full rounded-xl border border-[#ddd3c2] bg-white px-4 py-3 text-sm font-semibold text-[#5a430d] transition-colors hover:bg-[#f7f2e8]"
        >
          Pilih Gambar
        </button>
      </FormField>

      {(previewUrl || value) && (
        <div className="space-y-3 rounded-2xl border border-[#ddd3c2] bg-[#fffdf8] p-4">
          <img
            src={previewUrl || value}
            alt={label}
            className="h-40 w-full rounded-xl object-cover"
          />
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg bg-[#fdf0f0] px-3 py-2 text-xs font-semibold text-[#b54040] hover:bg-[#fae0e0]"
          >
            Hapus Gambar
          </button>
        </div>
      )}
    </div>
  );
}

function buildInitialRows() {
  return SECTION_CONFIGS.map((config) => ({
    setting_key: config.key,
    label: config.label,
    content: { ...(siteSectionDefaults[config.key] || {}) },
  }));
}

export default function AdminTampilan() {
  const [rows, setRows] = useState(buildInitialRows);
  const [loading, setLoading] = useState(true);
  const [activeConfig, setActiveConfig] = useState(null);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [previewUrls, setPreviewUrls] = useState({});
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const configMap = useMemo(
    () => Object.fromEntries(SECTION_CONFIGS.map((item) => [item.key, item])),
    []
  );

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 3000);
  };

  const fetchRows = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('pengaturan_tampilan')
      .select('setting_key, label, content');

    const merged = buildInitialRows().map((defaultRow) => {
      const databaseRow = (data || []).find((item) => item.setting_key === defaultRow.setting_key);
      return databaseRow
        ? {
            ...databaseRow,
            label: databaseRow.label || defaultRow.label,
            content: {
              ...defaultRow.content,
              ...(databaseRow.content || {}),
            },
          }
        : defaultRow;
    });

    setRows(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchRows();
  }, []);

  useEffect(() => () => {
    Object.values(previewUrls).forEach((url) => {
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
  }, [previewUrls]);

  const resetUploads = () => {
    Object.values(previewUrls).forEach((url) => {
      if (url?.startsWith('blob:')) {
        URL.revokeObjectURL(url);
      }
    });
    setSelectedFiles({});
    setPreviewUrls({});
  };

  const openEditor = (config) => {
    const currentRow = rows.find((item) => item.setting_key === config.key);
    setActiveConfig(config);
    setForm({
      ...(siteSectionDefaults[config.key] || {}),
      ...(currentRow?.content || {}),
    });
    resetUploads();
  };

  const closeEditor = () => {
    resetUploads();
    setActiveConfig(null);
    setForm({});
  };

  const handleFileChange = (fieldName) => (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type?.startsWith('image/')) {
      showToast('File harus berupa gambar.', 'error');
      return;
    }

    if (previewUrls[fieldName]?.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrls[fieldName]);
    }

    setSelectedFiles((current) => ({ ...current, [fieldName]: file }));
    setPreviewUrls((current) => ({ ...current, [fieldName]: URL.createObjectURL(file) }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!activeConfig) return;

    setSaving(true);
    try {
      const payloadContent = { ...form };

      for (const field of activeConfig.fields) {
        if (field.type !== 'image' || !selectedFiles[field.name]) continue;
        payloadContent[field.name] = await uploadPublicImage(
          selectedFiles[field.name],
          activeConfig.folder
        );
      }

      const payload = {
        setting_key: activeConfig.key,
        label: activeConfig.label,
        content: payloadContent,
      };

      const { error } = await supabase
        .from('pengaturan_tampilan')
        .upsert(payload, { onConflict: 'setting_key' });

      if (error) {
        showToast('Gagal menyimpan pengaturan.', 'error');
        return;
      }

      showToast('Pengaturan berhasil diperbarui.');
      closeEditor();
      fetchRows();
    } catch (error) {
      showToast(error.message || 'Gagal mengunggah gambar.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const renderField = (field) => {
    if (field.type === 'image') {
      return (
        <ImageField
          key={field.name}
          label={field.label}
          value={form[field.name]}
          previewUrl={previewUrls[field.name]}
          onPick={handleFileChange(field.name)}
          onClear={() => {
            if (previewUrls[field.name]?.startsWith('blob:')) {
              URL.revokeObjectURL(previewUrls[field.name]);
            }
            setSelectedFiles((current) => ({ ...current, [field.name]: null }));
            setPreviewUrls((current) => ({ ...current, [field.name]: '' }));
            setForm((current) => ({ ...current, [field.name]: '' }));
          }}
        />
      );
    }

    if (field.type === 'textarea') {
      return (
        <FormField key={field.name} label={field.label}>
          <textarea
            rows={3}
            className={inputClass}
            value={form[field.name] || ''}
            onChange={(event) =>
              setForm((current) => ({ ...current, [field.name]: event.target.value }))
            }
          />
        </FormField>
      );
    }

    return (
      <FormField key={field.name} label={field.label}>
        <input
          type={field.type}
          className={inputClass}
          value={form[field.name] || ''}
          onChange={(event) =>
            setForm((current) => ({ ...current, [field.name]: event.target.value }))
          }
        />
      </FormField>
    );
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold text-[#3f2d11]">Tampilan & Kontak</h1>
        <p className="mt-1 text-sm text-[#9f8e78]">
          Kelola background, gambar section, dan informasi kontak website.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-28 rounded-2xl bg-[#ece8df] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => {
            const config = configMap[row.setting_key];
            const content = row.content || {};
            const imageFields = config.fields.filter((field) => field.type === 'image');
            const textFields = config.fields.filter((field) => field.type !== 'image');

            return (
              <div key={row.setting_key} className="flex flex-col gap-4 rounded-2xl border border-[#ddd3c2] bg-[#faf7f0] p-5 transition-colors hover:border-[#c59f38] sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-lg font-bold text-[#3f2d11]">{config.label}</p>
                  <p className="mt-1 text-sm text-[#9f8e78]">{config.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {imageFields.map((field) => (
                      <span key={field.name} className="rounded-full bg-[#fffbeb] px-3 py-1 text-xs font-semibold text-[#7a5b0a]">
                        {field.label}: {content[field.name] ? 'Terisi' : 'Kosong'}
                      </span>
                    ))}
                    {textFields.map((field) => (
                      <span key={field.name} className="rounded-full bg-[#ece8df] px-3 py-1 text-xs font-semibold text-[#6f604b]">
                        {field.label}: {content[field.name] ? 'Terisi' : 'Kosong'}
                      </span>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEditor(config)}
                  className="rounded-xl bg-[#7a5b0a] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#684d08]"
                >
                  Edit
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeConfig && (
        <Modal title={`Edit ${activeConfig.label}`} onClose={closeEditor}>
          <form onSubmit={handleSave} className="space-y-4">
            {activeConfig.fields.map(renderField)}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={closeEditor}
                className="flex-1 rounded-xl border border-[#ddd3c2] py-3 text-sm font-semibold text-[#7a6e5a] hover:bg-[#ece8df]"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 rounded-xl bg-[#7a5b0a] py-3 text-sm font-semibold text-white hover:bg-[#684d08] disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}
