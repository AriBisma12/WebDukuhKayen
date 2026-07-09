"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AdminSessionUser } from "@/lib/admin-auth";
import type {
  AdminDashboardData,
  AdminDocumentationPost,
  AdminDocumentationVideo,
  AdminNewsItem,
} from "@/lib/admin-data";
import { AdminMobileMenu } from "./admin-mobile-menu";
import { AdminSidebar } from "./admin-sidebar";
import { deleteRecordAction, saveRecordAction } from "../actions";

type AdminManagePageProps =
  | {
      currentAdmin: AdminSessionUser;
      data: AdminDashboardData;
      status?: string;
      message?: string;
      type: "berita";
      items: AdminNewsItem[];
    }
  | {
      currentAdmin: AdminSessionUser;
      data: AdminDashboardData;
      status?: string;
      message?: string;
      type: "dokumentasi";
      items: Array<AdminDocumentationPost | AdminDocumentationVideo>;
    };

type NewsModalState = { mode: "create" } | { mode: "edit"; item: AdminNewsItem };

type DocumentationModalState =
  | { mode: "create-post" }
  | { mode: "create-video" }
  | { mode: "edit-post"; item: AdminDocumentationPost }
  | { mode: "edit-video"; item: AdminDocumentationVideo };

type TextInputProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: "text" | "number" | "url" | "date";
  placeholder?: string;
  required?: boolean;
};

type TextAreaProps = {
  label: string;
  name: string;
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
  required?: boolean;
};

const NEWS_REDIRECT = "/admin/berita";
const DOCUMENTATION_REDIRECT = "/admin/dokumentasi";

function MessageBanner({ status, message }: { status?: string; message?: string }) {
  if (!message) {
    return null;
  }

  const isError = status === "error";

  return (
    <div
      className={`rounded-[1.15rem] border px-4 py-4 text-sm leading-7 sm:px-5 ${
        isError
          ? "border-[#e9c7c4] bg-[#fff4f2] text-[#a54841]"
          : "border-[#d7d1b8] bg-[#fffbee] text-[#6a5a19]"
      }`}
    >
      {message}
    </div>
  );
}

function formatAdminDate(dateValue: string | null | undefined, withTime = false) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime
      ? {
          hour: "2-digit" as const,
          minute: "2-digit" as const,
        }
      : {}),
  }).format(date);
}

function formatDateInput(dateValue: string | null | undefined) {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 20h4l10-10a2.12 2.12 0 0 0-3-3L5 17v3Z" />
      <path d="m13.5 6.5 4 4" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
    </svg>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 16-5-5-7 7" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.91 4.6H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.7 0 1.33.4 1.6 1.03.12.3.19.63.19.97s-.07.67-.19.97c-.27.63-.9 1.03-1.6 1.03Z" />
    </svg>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <span className="mb-2 block text-sm font-semibold text-[#5f5a4c]">{children}</span>;
}

function TextInput({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  required,
}: TextInputProps) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[1rem] border border-[#d9ceb0] bg-[#fffdf8] px-4 py-3 text-sm text-[#3f3a30] outline-none transition focus:border-[#8b6d00] focus:ring-2 focus:ring-[#f1e4b2]"
      />
    </label>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
  rows = 4,
  placeholder,
  required,
}: TextAreaProps) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-[1rem] border border-[#d9ceb0] bg-[#fffdf8] px-4 py-3 text-sm text-[#3f3a30] outline-none transition focus:border-[#8b6d00] focus:ring-2 focus:ring-[#f1e4b2]"
      />
    </label>
  );
}

function SelectInput({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full rounded-[1rem] border border-[#d9ceb0] bg-[#fffdf8] px-4 py-3 text-sm text-[#3f3a30] outline-none transition focus:border-[#8b6d00] focus:ring-2 focus:ring-[#f1e4b2]"
      >
        <option value="">Tanpa kategori</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function DeleteForm({
  resource,
  id,
  redirectTo,
}: {
  resource: "berita_desa" | "posting_dokumentasi" | "video_dokumentasi";
  id: string;
  redirectTo: string;
}) {
  return (
    <form action={deleteRecordAction}>
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="redirect_to" value={redirectTo} />
      <button
        type="submit"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#efd8cf] bg-[#fff7f4] text-[#b24d44] transition hover:bg-[#fff0ea]"
        aria-label="Hapus item"
      >
        <TrashIcon />
      </button>
    </form>
  );
}

function ModalShell({
  title,
  subtitle,
  onClose,
  children,
  actions,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#1f1a0f]/45 px-4 py-6 backdrop-blur-sm sm:py-8">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-4xl overflow-y-auto rounded-[1.4rem] border border-[#d9ceb0] bg-[#fdfaf2] p-4 shadow-[0_30px_70px_-28px_rgba(31,26,15,0.6)] sm:max-h-[calc(100vh-4rem)] sm:rounded-[1.8rem] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b6d00]">
              Panel Admin
            </p>
            <h2 className="mt-2 font-heading text-[1.45rem] font-bold text-[#2f2a1f] sm:text-[2rem]">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-7 text-[#7a735f]">{subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
            {actions}
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#d9ceb0] bg-white px-4 py-2 text-sm font-bold text-[#655a3f]"
            >
              Tutup
            </button>
          </div>
        </div>

        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

function NewsForm({ item }: { item?: AdminNewsItem }) {
  return (
    <form action={saveRecordAction} className="grid gap-4">
      <input type="hidden" name="resource" value="berita_desa" />
      <input type="hidden" name="redirect_to" value={NEWS_REDIRECT} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Kategori" name="kategori" defaultValue={item?.kategori} required />
        <TextInput
          label="Tanggal Terbit"
          name="tanggal_terbit"
          type="date"
          defaultValue={formatDateInput(item?.tanggal_terbit)}
        />
      </div>
      <TextInput label="Judul" name="judul" defaultValue={item?.judul} required />
      <TextArea label="Ringkasan" name="ringkasan" defaultValue={item?.ringkasan} rows={5} required />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="URL Gambar"
          name="url_gambar"
          type="url"
          defaultValue={item?.url_gambar}
          placeholder="https://..."
        />
        <TextInput
          label="Urutan Tampil"
          name="urutan_tampil"
          type="number"
          defaultValue={item?.urutan_tampil ?? 0}
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-[#8b6d00] px-5 py-3 text-sm font-bold text-white"
        >
          {item ? "Simpan Berita" : "Tambah Berita"}
        </button>
      </div>
    </form>
  );
}

function DocumentationPostForm({
  item,
  categories,
}: {
  item?: AdminDocumentationPost;
  categories: AdminDashboardData["documentationCategories"];
}) {
  return (
    <form action={saveRecordAction} className="grid gap-4">
      <input type="hidden" name="resource" value="posting_dokumentasi" />
      <input type="hidden" name="redirect_to" value={DOCUMENTATION_REDIRECT} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}
      <input type="hidden" name="photos_json" value="[]" />

      <div className="grid gap-4 md:grid-cols-2">
        <SelectInput
          label="Kategori"
          name="kategori_id"
          defaultValue={item?.kategori_id}
          options={categories.map((category) => ({
            value: category.id,
            label: category.nama,
          }))}
        />
        <TextInput
          label="Tanggal Terbit"
          name="tanggal_terbit"
          type="date"
          defaultValue={formatDateInput(item?.tanggal_terbit)}
        />
      </div>
      <TextInput label="Judul" name="judul" defaultValue={item?.judul} required />
      <TextArea label="Ringkasan" name="ringkasan" defaultValue={item?.ringkasan} rows={5} required />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput
          label="URL Gambar Utama"
          name="url_gambar"
          type="url"
          defaultValue={item?.url_gambar}
          placeholder="https://..."
        />
        <TextInput
          label="Urutan Tampil"
          name="urutan_tampil"
          type="number"
          defaultValue={item?.urutan_tampil ?? 0}
          required
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-[#8b6d00] px-5 py-3 text-sm font-bold text-white"
        >
          {item ? "Simpan Dokumentasi" : "Tambah Dokumentasi"}
        </button>
      </div>
    </form>
  );
}

function DocumentationVideoForm({ item }: { item?: AdminDocumentationVideo }) {
  return (
    <form action={saveRecordAction} className="grid gap-4">
      <input type="hidden" name="resource" value="video_dokumentasi" />
      <input type="hidden" name="redirect_to" value={DOCUMENTATION_REDIRECT} />
      {item ? <input type="hidden" name="id" value={item.id} /> : null}

      <TextInput label="Judul" name="judul" defaultValue={item?.judul} required />
      <div className="grid gap-4 md:grid-cols-2">
        <TextInput label="Durasi" name="durasi" defaultValue={item?.durasi} placeholder="08:24" />
        <TextInput
          label="Urutan Tampil"
          name="urutan_tampil"
          type="number"
          defaultValue={item?.urutan_tampil ?? 0}
          required
        />
      </div>
      <TextInput
        label="URL Thumbnail"
        name="url_gambar"
        type="url"
        defaultValue={item?.url_gambar}
        placeholder="https://..."
      />
      <TextInput
        label="URL Video"
        name="url_video"
        type="url"
        defaultValue={item?.url_video}
        placeholder="https://..."
      />

      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-xl bg-[#8b6d00] px-5 py-3 text-sm font-bold text-white"
        >
          {item ? "Simpan Video" : "Tambah Video"}
        </button>
      </div>
    </form>
  );
}

function NewsModal({ state, onClose }: { state: NewsModalState | null; onClose: () => void }) {
  if (!state) {
    return null;
  }

  const item = state.mode === "edit" ? state.item : undefined;

  return (
    <ModalShell
      title={item ? "Edit Berita" : "Tambah Berita Baru"}
      subtitle="Form ini langsung tersambung ke tabel `berita_desa`."
      onClose={onClose}
      actions={
        item ? <DeleteForm resource="berita_desa" id={item.id} redirectTo={NEWS_REDIRECT} /> : null
      }
    >
      <NewsForm item={item} />
    </ModalShell>
  );
}

function DocumentationModal({
  state,
  onClose,
  categories,
}: {
  state: DocumentationModalState | null;
  onClose: () => void;
  categories: AdminDashboardData["documentationCategories"];
}) {
  if (!state) {
    return null;
  }

  if (state.mode === "create-post") {
    return (
      <ModalShell
        title="Tambah Dokumentasi Baru"
        subtitle="Form ini membuat item baru pada tabel `posting_dokumentasi`."
        onClose={onClose}
      >
        <DocumentationPostForm categories={categories} />
      </ModalShell>
    );
  }

  if (state.mode === "create-video") {
    return (
      <ModalShell
        title="Tambah Video Dokumentasi"
        subtitle="Form ini membuat item baru pada tabel `video_dokumentasi`."
        onClose={onClose}
      >
        <DocumentationVideoForm />
      </ModalShell>
    );
  }

  if (state.mode === "edit-post") {
    return (
      <ModalShell
        title="Edit Dokumentasi"
        subtitle="Form ini mengubah data posting dokumentasi beserta daftar foto JSON."
        onClose={onClose}
        actions={
          <DeleteForm
            resource="posting_dokumentasi"
            id={state.item.id}
            redirectTo={DOCUMENTATION_REDIRECT}
          />
        }
      >
        <DocumentationPostForm item={state.item} categories={categories} />
      </ModalShell>
    );
  }

  return (
    <ModalShell
      title="Edit Video Dokumentasi"
      subtitle="Form ini mengubah data video dokumentasi."
      onClose={onClose}
      actions={
        <DeleteForm
          resource="video_dokumentasi"
          id={state.item.id}
          redirectTo={DOCUMENTATION_REDIRECT}
        />
      }
    >
      <DocumentationVideoForm item={state.item} />
    </ModalShell>
  );
}

function isDocumentationPost(
  item: AdminDocumentationPost | AdminDocumentationVideo,
): item is AdminDocumentationPost {
  return "ringkasan" in item;
}

function MediaCapsule({ type }: { type: "Foto" | "Video" }) {
  const isPhoto = type === "Foto";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${
        isPhoto ? "bg-[#f4e7c5] text-[#7a5b0a]" : "bg-[#e7ecf8] text-[#4e6498]"
      }`}
    >
      {type}
    </span>
  );
}

export function AdminManageManager(props: AdminManagePageProps) {
  const { currentAdmin, data, status, message, type, items } = props;
  const isNews = type === "berita";
  const [newsModal, setNewsModal] = useState<NewsModalState | null>(null);
  const [documentationModal, setDocumentationModal] = useState<DocumentationModalState | null>(null);
  const [selectedDocumentationCategory, setSelectedDocumentationCategory] = useState<
    "Semua" | "Foto" | "Video"
  >("Semua");

  const title = isNews ? "Kelola Berita" : "Kelola Dokumentasi";
  const active = isNews ? "berita" : "dokumentasi";
  const previewHref = isNews ? "/kabar-padukuhan" : "/dokumentasi-kegiatan";
  const redirectTarget = isNews ? NEWS_REDIRECT : DOCUMENTATION_REDIRECT;
  const sidebarItems = [
    { key: "dashboard", href: "/admin", label: "Dashboard Overview", icon: <DashboardIcon /> },
    { key: "berita", href: "/admin/berita", label: "Kelola Berita", icon: <NewsIcon /> },
    {
      key: "dokumentasi",
      href: "/admin/dokumentasi",
      label: "Kelola Dokumentasi",
      icon: <GalleryIcon />,
    },
    { key: "pengaturan", href: "/admin/profil-desa", label: "Pengaturan", icon: <SettingsIcon /> },
  ] as const;
  const documentationFilterOptions = useMemo(() => ["Semua", "Foto", "Video"] as const, []);
  const visibleItems = useMemo(() => {
    if (isNews || selectedDocumentationCategory === "Semua") {
      return items;
    }

    if (selectedDocumentationCategory === "Foto") {
      return items.filter((item) => isDocumentationPost(item));
    }

    return items.filter((item) => !isDocumentationPost(item));
  }, [isNews, items, selectedDocumentationCategory]);

  return (
    <main className="min-h-screen bg-[#fcfbf8] text-[#1f1b13]">
      <AdminSidebar active={active} items={sidebarItems} />

      <div className="lg:ml-[18rem]">
        <header className="sticky top-0 z-30 border-b border-[#decfae] bg-[#fcfbf8]/95 backdrop-blur">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-9">
            <h2 className="font-heading text-[1.55rem] font-bold text-[#8a6c00] sm:text-[1.9rem]">
              {title}
            </h2>

            <div className="flex items-center gap-3">
              <div className="hidden min-w-[18rem] items-center gap-3 rounded-full bg-[#f5f2eb] px-4 py-3 text-[#8d8778] lg:flex">
                <SearchIcon />
                <span className="text-[1rem]">Cari data...</span>
              </div>
              <div className="rounded-full border border-[#decfae] bg-white px-4 py-2 text-sm font-semibold text-[#6e6454]">
                {currentAdmin.displayName}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-5 sm:py-8 lg:px-9">
          <MessageBanner status={status} message={message} />

          <div className="mt-4">
            <AdminMobileMenu active={active} />
          </div>

          <section className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#8a8373]">
                {isNews ? "Konten > Berita" : "Konten > Dokumentasi"}
              </p>
              <h1 className="mt-2 font-heading text-[1.9rem] font-bold leading-tight text-[#8a6c00] sm:text-[2.35rem]">
                {title}
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f695c] sm:text-base sm:leading-8">
                Tampilan halaman ini mengikuti pola list dan modal editor seperti dashboard admin, sambil tetap memakai schema data berita dan dokumentasi yang tersedia sekarang.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href={previewHref}
                className="inline-flex min-h-[3.1rem] items-center justify-center rounded-[1rem] border border-[#bcae84] bg-white px-5 text-sm font-bold text-[#6a5715]"
              >
                Pratinjau Situs
              </Link>
              {isNews ? (
                <button
                  type="button"
                  onClick={() => setNewsModal({ mode: "create" })}
                  className="inline-flex min-h-[3.1rem] items-center justify-center rounded-[1rem] bg-[#8a6c00] px-5 text-sm font-bold text-white"
                >
                  Tambah Berita
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setDocumentationModal({ mode: "create-post" })}
                    className="inline-flex min-h-[3.1rem] items-center justify-center rounded-[1rem] bg-[#8a6c00] px-5 text-sm font-bold text-white"
                  >
                    Tambah Dokumentasi
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocumentationModal({ mode: "create-video" })}
                    className="inline-flex min-h-[3.1rem] items-center justify-center rounded-[1rem] border border-[#bcae84] bg-white px-5 text-sm font-bold text-[#6a5715]"
                  >
                    Tambah Video
                  </button>
                </>
              )}
            </div>
          </section>

          <section className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <div className="rounded-[1.25rem] border border-[#ddd2b5] bg-white p-4 shadow-[0_20px_40px_-32px_rgba(95,70,17,0.3)] sm:p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-[#7b8079] sm:text-sm">Total Item</p>
              <p className="mt-3 font-heading text-[1.75rem] font-extrabold text-[#8b6d00] sm:text-[2.2rem]">{items.length}</p>
            </div>
            <div className="rounded-[1.25rem] border border-[#ddd2b5] bg-white p-4 shadow-[0_20px_40px_-32px_rgba(95,70,17,0.3)] sm:p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-[#7b8079] sm:text-sm">Terbit / Tersedia</p>
              <p className="mt-3 font-heading text-[1.75rem] font-extrabold text-[#8b6d00] sm:text-[2.2rem]">{items.length}</p>
            </div>
            <div className="rounded-[1.25rem] border border-[#ddd2b5] bg-white p-4 shadow-[0_20px_40px_-32px_rgba(95,70,17,0.3)] sm:p-5">
              <p className="text-xs uppercase tracking-[0.12em] text-[#7b8079] sm:text-sm">
                {isNews ? "Kategori Berita" : "Kategori Dokumentasi"}
              </p>
              <p className="mt-3 font-heading text-[1.75rem] font-extrabold text-[#8b6d00] sm:text-[2.2rem]">
                {isNews
                  ? new Set((items as AdminNewsItem[]).map((item) => item.kategori)).size
                  : data.documentationCategories.length}
              </p>
            </div>
          </section>

          <section className="mt-8 rounded-[1.25rem] border border-[#ddd2b5] bg-white shadow-[0_22px_45px_-34px_rgba(95,70,17,0.32)] sm:rounded-[1.5rem]">
            <div className="flex flex-col gap-4 border-b border-[#eee4c7] px-4 py-4 sm:px-5 sm:py-5 md:flex-row md:items-center md:justify-between">
              <h3 className="font-heading text-[1.2rem] font-bold text-[#2f2a1f] sm:text-[1.45rem]">
                Daftar {isNews ? "Berita" : "Dokumentasi"}
              </h3>
              {isNews ? (
                <div className="rounded-[0.9rem] border border-[#ddd2b5] bg-[#fffdfa] px-4 py-2 text-sm text-[#6f695c]">
                  Semua Status
                </div>
              ) : (
                <div className="flex flex-wrap gap-3">
                  {documentationFilterOptions.map((category) => {
                    const isActive = selectedDocumentationCategory === category;

                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedDocumentationCategory(category)}
                        className={`rounded-full px-5 py-3 text-sm font-semibold transition ${
                          isActive
                            ? "bg-[#8a6c00] text-white"
                            : "bg-[#f3eee4] text-[#7a6e5a] hover:bg-[#ece3d1]"
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-[#eee4c7] bg-[#faf7ef] text-left text-xs font-bold uppercase tracking-[0.12em] text-[#746d5d]">
                    <th className="px-5 py-4">{isNews ? "Judul Berita" : "Judul Dokumentasi"}</th>
                    <th className="px-5 py-4">{isNews ? "Kategori" : "Tipe / Info"}</th>
                    <th className="px-5 py-4">{isNews ? "Tanggal" : "Terakhir Diperbarui"}</th>
                    <th className="px-5 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleItems.length > 0 ? (
                    visibleItems.map((item) => {
                      const previewLabel = isNews ? "/kabar-padukuhan" : "/dokumentasi-kegiatan";

                      return (
                        <tr key={item.id} className="border-b border-[#f1ead5] last:border-b-0">
                          <td className="px-5 py-5 align-top">
                            <p className="text-[1rem] font-bold text-[#2f2a1f]">{item.judul}</p>
                            <p className="mt-1 text-sm text-[#857e6f]">
                              {isNews
                                ? (item as AdminNewsItem).ringkasan
                                : isDocumentationPost(item)
                                  ? item.ringkasan
                                  : item.durasi || "Video dokumentasi desa"}
                            </p>
                          </td>
                          <td className="px-5 py-5 align-top text-sm text-[#5f5a4c]">
                            {isNews ? (
                              (item as AdminNewsItem).kategori
                            ) : isDocumentationPost(item) ? (
                              <div className="flex items-center gap-2">
                                <MediaCapsule type="Foto" />
                                <p className="font-semibold text-[#6a5715]">Posting Dokumentasi</p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <MediaCapsule type="Video" />
                                <p className="font-semibold text-[#6a5715]">Video Dokumentasi</p>
                              </div>
                            )}
                          </td>
                          <td className="px-5 py-5 align-top text-sm text-[#5f5a4c]">
                            {isNews
                              ? formatAdminDate(
                                  (item as AdminNewsItem).tanggal_terbit || (item as AdminNewsItem).updated_at,
                                )
                              : formatAdminDate(item.updated_at, true)}
                          </td>
                          <td className="px-5 py-5 align-top">
                            <div className="flex items-center gap-2 text-[#6d5d2d]">
                              <button
                                type="button"
                                onClick={() => {
                                  if (isNews) {
                                    setNewsModal({ mode: "edit", item: item as AdminNewsItem });
                                    return;
                                  }

                                  if (isDocumentationPost(item)) {
                                    setDocumentationModal({ mode: "edit-post", item });
                                    return;
                                  }

                                  setDocumentationModal({ mode: "edit-video", item });
                                }}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d7b8] bg-[#fffdf7] transition hover:bg-[#f8f0d8]"
                                aria-label={`Edit ${item.judul}`}
                              >
                                <PencilIcon />
                              </button>
                              <Link
                                href={previewLabel}
                                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d7b8] bg-[#fffdf7] transition hover:bg-[#f8f0d8]"
                                aria-label={`Pratinjau ${item.judul}`}
                              >
                                <EyeIcon />
                              </Link>
                              <DeleteForm
                                resource={
                                  isNews
                                    ? "berita_desa"
                                    : isDocumentationPost(item)
                                      ? "posting_dokumentasi"
                                      : "video_dokumentasi"
                                }
                                id={item.id}
                                redirectTo={redirectTarget}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td className="px-5 py-6 text-sm text-[#667061]" colSpan={4}>
                        Belum ada data.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 md:hidden">
              {visibleItems.length > 0 ? (
                visibleItems.map((item) => (
                  <div key={item.id} className="rounded-[1.1rem] border border-[#ece2c8] bg-[#fffdf8] p-4">
                    <p className="text-base font-bold text-[#2f2a1f]">{item.judul}</p>
                    <p className="mt-1 text-sm leading-6 text-[#857e6f]">
                      {isNews
                        ? (item as AdminNewsItem).ringkasan
                        : isDocumentationPost(item)
                          ? item.ringkasan
                          : item.durasi || "Video dokumentasi desa"}
                    </p>
                    <div className="mt-4 grid gap-3 text-sm text-[#5f5a4c]">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a8373]">
                          {isNews ? "Kategori" : "Tipe / Info"}
                        </p>
                        {isNews ? (
                          <p className="mt-1">{(item as AdminNewsItem).kategori}</p>
                        ) : isDocumentationPost(item) ? (
                          <div className="mt-2 flex items-center gap-2">
                            <MediaCapsule type="Foto" />
                            <p className="font-semibold text-[#6a5715]">Posting Dokumentasi</p>
                          </div>
                        ) : (
                          <div className="mt-2 flex items-center gap-2">
                            <MediaCapsule type="Video" />
                            <p className="font-semibold text-[#6a5715]">Video Dokumentasi</p>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#8a8373]">
                          {isNews ? "Tanggal" : "Terakhir Diperbarui"}
                        </p>
                        <p className="mt-1">
                          {isNews
                            ? formatAdminDate(
                                (item as AdminNewsItem).tanggal_terbit || (item as AdminNewsItem).updated_at,
                              )
                            : formatAdminDate(item.updated_at, true)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-[#6d5d2d]">
                      <button
                        type="button"
                        onClick={() => {
                          if (isNews) {
                            setNewsModal({ mode: "edit", item: item as AdminNewsItem });
                            return;
                          }

                          if (isDocumentationPost(item)) {
                            setDocumentationModal({ mode: "edit-post", item });
                            return;
                          }

                          setDocumentationModal({ mode: "edit-video", item });
                        }}
                        className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-[#e4d7b8] bg-[#fffdf7]"
                      >
                        <PencilIcon />
                      </button>
                      <Link
                        href={previewHref}
                        className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-[#e4d7b8] bg-[#fffdf7]"
                      >
                        <EyeIcon />
                      </Link>
                      <DeleteForm
                        resource={
                          isNews
                            ? "berita_desa"
                            : isDocumentationPost(item)
                              ? "posting_dokumentasi"
                              : "video_dokumentasi"
                        }
                        id={item.id}
                        redirectTo={redirectTarget}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.1rem] border border-[#ece2c8] bg-[#fffdf8] p-4 text-sm text-[#667061]">
                  Belum ada data.
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      {isNews ? (
        <NewsModal state={newsModal} onClose={() => setNewsModal(null)} />
      ) : (
        <DocumentationModal
          state={documentationModal}
          onClose={() => setDocumentationModal(null)}
          categories={data.documentationCategories}
        />
      )}
    </main>
  );
}

