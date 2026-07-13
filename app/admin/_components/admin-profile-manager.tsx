"use client";

import { Link } from "@/lib/react-router";
import { useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import type { AdminSessionUser } from "@/lib/admin-types";
import type {
  AdminBoundary,
  AdminDashboardData,
  AdminOfficial,
  AdminStatItem,
} from "@/lib/admin-types";
import { AdminMobileMenu } from "./admin-mobile-menu";
import { AdminSidebar } from "./admin-sidebar";
import { useAdminMutationHandlers } from "./admin-client-shared";

type AdminProfileManagerProps = {
  currentAdmin: AdminSessionUser;
  data: AdminDashboardData;
  status?: string;
  message?: string;
};

type ProfileSectionKey = "stats" | "boundaries" | "officials";

type ProfileSectionSummary = {
  key: ProfileSectionKey;
  title: string;
  description: string;
  status: "Aktif" | "Draft";
  updatedLabel: string;
  entries: number;
};

type TextInputProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: "text" | "number" | "url";
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

const PROFILE_REDIRECT = "/admin/profil-desa/";

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

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
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

function StatsSectionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M7 18V9M12 18V6M17 18v-4" />
      <path d="M4 20h16" />
    </svg>
  );
}

function BoundarySectionIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 7h16M4 12h16M4 17h16" />
      <path d="M7 4v16M17 4v16" />
    </svg>
  );
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M16 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="9.5" cy="7" r="3" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 4.13a3 3 0 0 1 0 5.74" />
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

function formatUpdatedLabel(values: string[]) {
  if (values.length === 0) {
    return "Belum ada data";
  }

  const latestValue = values
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()))
    .sort((first, second) => second.getTime() - first.getTime())[0];

  if (!latestValue) {
    return "Belum ada data";
  }

  const now = new Date();
  if (now.getTime() - latestValue.getTime() < 24 * 60 * 60 * 1000) {
    return "Baru saja";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(latestValue);
}

function getInitials(value: string) {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function TableStatus({ value }: { value: "Aktif" | "Draft" }) {
  return (
    <span
      className={`inline-flex min-w-[4.3rem] justify-center rounded-full px-3 py-1 text-xs font-bold ${
        value === "Aktif" ? "bg-[#8a6c00] text-white" : "bg-[#ece6d8] text-[#6b6253]"
      }`}
    >
      {value}
    </span>
  );
}

function SectionShell({
  title,
  icon,
  subtitle,
  children,
}: {
  title: string;
  icon: ReactNode;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.3rem] border border-[#ddd2b5] bg-[#fffdfa] p-4 shadow-[0_18px_38px_-30px_rgba(95,70,17,0.35)] sm:rounded-[1.4rem] sm:p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f7efd4] text-[#8b6d00]">
          {icon}
        </div>
        <div>
          <h3 className="font-heading text-[1.15rem] font-bold text-[#2f2a1f] sm:text-[1.35rem]">
            {title}
          </h3>
          <p className="mt-1 text-sm leading-6 text-[#807867]">{subtitle}</p>
        </div>
      </div>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function EditFormCard({
  title,
  children,
  deleteForm,
}: {
  title: string;
  children: ReactNode;
  deleteForm?: ReactNode;
}) {
  return (
    <div className="rounded-[1.1rem] border border-[#e2d7ba] bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h4 className="text-base font-bold text-[#373224]">{title}</h4>
        {deleteForm}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function DeleteButtonForm({
  resource,
  id,
  onDelete,
}: {
  resource: "statistik_profil" | "aparatur_desa" | "batas_wilayah_desa";
  id: string;
  onDelete: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onDelete}>
      <input type="hidden" name="resource" value={resource} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="redirect_to" value={PROFILE_REDIRECT} />
      <button
        type="submit"
        className="rounded-xl border border-[#eed2cd] bg-[#fff7f5] px-3 py-2 text-xs font-bold text-[#b24d44]"
      >
        Hapus
      </button>
    </form>
  );
}

function StatisticForms({
  items,
  onSave,
  onDelete,
}: {
  items: AdminStatItem[];
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <SectionShell
      title="Statistik Profil"
      icon={<StatsSectionIcon />}
      subtitle="Bagian ini menggantikan konten Sejarah Desa sesuai schema yang tersedia."
    >
      {items.map((item) => (
        <EditFormCard
          key={item.id}
          title={item.label}
          deleteForm={<DeleteButtonForm resource="statistik_profil" id={item.id} onDelete={onDelete} />}
        >
          <form onSubmit={onSave} className="space-y-4">
            <input type="hidden" name="resource" value="statistik_profil" />
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="redirect_to" value={PROFILE_REDIRECT} />
            <div className="grid gap-4 md:grid-cols-3">
              <TextInput label="Label" name="label" defaultValue={item.label} required />
              <TextInput label="Value" name="value" defaultValue={item.value} required />
              <TextInput
                label="Urutan Tampil"
                name="urutan_tampil"
                type="number"
                defaultValue={item.urutan_tampil}
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-[#8b6d00] px-4 py-2.5 text-sm font-bold text-white"
              >
                Simpan Statistik
              </button>
            </div>
          </form>
        </EditFormCard>
      ))}

      <EditFormCard title="Tambah Statistik Baru">
        <form onSubmit={onSave} className="space-y-4">
          <input type="hidden" name="resource" value="statistik_profil" />
          <input type="hidden" name="redirect_to" value={PROFILE_REDIRECT} />
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput label="Label" name="label" required />
            <TextInput label="Value" name="value" required />
            <TextInput
              label="Urutan Tampil"
              name="urutan_tampil"
              type="number"
              defaultValue={0}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl border border-[#d7c9a2] bg-[#fff8e6] px-4 py-2.5 text-sm font-bold text-[#7f6300]"
            >
              Tambah Statistik
            </button>
          </div>
        </form>
      </EditFormCard>
    </SectionShell>
  );
}

function BoundaryForms({
  items,
  onSave,
  onDelete,
}: {
  items: AdminBoundary[];
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <SectionShell
      title="Batas Wilayah"
      icon={<BoundarySectionIcon />}
      subtitle="Bagian ini menggantikan Visi & Misi sesuai schema `batas_wilayah_desa`."
    >
      {items.map((item) => (
        <EditFormCard
          key={item.id}
          title={item.arah}
          deleteForm={<DeleteButtonForm resource="batas_wilayah_desa" id={item.id} onDelete={onDelete} />}
        >
          <form onSubmit={onSave} className="space-y-4">
            <input type="hidden" name="resource" value="batas_wilayah_desa" />
            <input type="hidden" name="id" value={item.id} />
            <input type="hidden" name="redirect_to" value={PROFILE_REDIRECT} />
            <div className="grid gap-4 md:grid-cols-2">
              <TextInput label="Arah" name="arah" defaultValue={item.arah} required />
              <TextInput
                label="Urutan Tampil"
                name="urutan_tampil"
                type="number"
                defaultValue={item.urutan_tampil}
                required
              />
            </div>
            <TextArea
              label="Deskripsi"
              name="deskripsi"
              defaultValue={item.deskripsi}
              rows={4}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="rounded-xl bg-[#8b6d00] px-4 py-2.5 text-sm font-bold text-white"
              >
                Simpan Batas Wilayah
              </button>
            </div>
          </form>
        </EditFormCard>
      ))}

      <EditFormCard title="Tambah Batas Wilayah">
        <form onSubmit={onSave} className="space-y-4">
          <input type="hidden" name="resource" value="batas_wilayah_desa" />
          <input type="hidden" name="redirect_to" value={PROFILE_REDIRECT} />
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Arah" name="arah" required />
            <TextInput
              label="Urutan Tampil"
              name="urutan_tampil"
              type="number"
              defaultValue={0}
              required
            />
          </div>
          <TextArea label="Deskripsi" name="deskripsi" rows={4} required />
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl border border-[#d7c9a2] bg-[#fff8e6] px-4 py-2.5 text-sm font-bold text-[#7f6300]"
            >
              Tambah Batas
            </button>
          </div>
        </form>
      </EditFormCard>
    </SectionShell>
  );
}

function OfficialsForms({
  items,
  onSave,
  onDelete,
}: {
  items: AdminOfficial[];
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <SectionShell
      title="Struktur Organisasi"
      icon={<PeopleIcon />}
      subtitle="Bagian ini memakai data `aparatur_desa` dan ditampilkan sebagai kartu anggota."
    >
      <div className="grid gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-[1.2rem] border border-[#e2d7ba] bg-white p-4 shadow-[0_14px_28px_-24px_rgba(95,70,17,0.35)]"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1rem] bg-[#f3f1ea] text-base font-bold text-[#8b6d00] sm:h-18 sm:w-18 sm:text-lg">
                  {getInitials(item.nama)}
                </div>
                <div>
                  <p className="text-base font-bold text-[#2f2a1f] sm:text-[1.1rem]">{item.nama}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#8a6c00] sm:text-sm">
                    {item.peran}
                  </p>
                  {item.bio ? (
                    <p className="mt-2 max-w-xl text-sm leading-7 text-[#716c60]">{item.bio}</p>
                  ) : (
                    <p className="mt-2 text-sm text-[#989280]">Belum ada bio singkat.</p>
                  )}
                </div>
              </div>
              <DeleteButtonForm resource="aparatur_desa" id={item.id} onDelete={onDelete} />
            </div>

            <form onSubmit={onSave} className="mt-5 grid gap-4">
              <input type="hidden" name="resource" value="aparatur_desa" />
              <input type="hidden" name="id" value={item.id} />
              <input type="hidden" name="redirect_to" value={PROFILE_REDIRECT} />
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput label="Nama" name="nama" defaultValue={item.nama} required />
                <TextInput label="Peran" name="peran" defaultValue={item.peran} required />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextInput
                  label="URL Foto"
                  name="url_foto"
                  type="url"
                  defaultValue={item.url_foto}
                  placeholder="https://..."
                />
                <TextInput
                  label="Urutan Tampil"
                  name="urutan_tampil"
                  type="number"
                  defaultValue={item.urutan_tampil}
                  required
                />
              </div>
              <TextArea
                label="Bio"
                name="bio"
                defaultValue={item.bio}
                rows={3}
                placeholder="Deskripsi singkat anggota aparatur"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-xl bg-[#8b6d00] px-4 py-2.5 text-sm font-bold text-white"
                >
                  Simpan Anggota
                </button>
              </div>
            </form>
          </div>
        ))}
      </div>

      <EditFormCard title="Tambah Anggota Struktur">
        <form onSubmit={onSave} className="grid gap-4">
          <input type="hidden" name="resource" value="aparatur_desa" />
          <input type="hidden" name="redirect_to" value={PROFILE_REDIRECT} />
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Nama" name="nama" required />
            <TextInput label="Peran" name="peran" required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="URL Foto" name="url_foto" type="url" placeholder="https://..." />
            <TextInput
              label="Urutan Tampil"
              name="urutan_tampil"
              type="number"
              defaultValue={0}
              required
            />
          </div>
          <TextArea
            label="Bio"
            name="bio"
            rows={3}
            placeholder="Deskripsi singkat anggota aparatur"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="rounded-xl border border-[#d7c9a2] bg-[#fff8e6] px-4 py-2.5 text-sm font-bold text-[#7f6300]"
            >
              Tambah Anggota
            </button>
          </div>
        </form>
      </EditFormCard>
    </SectionShell>
  );
}

function ProfileModal({
  section,
  onClose,
  data,
  onSave,
  onDelete,
}: {
  section: ProfileSectionKey | null;
  onClose: () => void;
  data: AdminDashboardData;
  onSave: (event: FormEvent<HTMLFormElement>) => void;
  onDelete: (event: FormEvent<HTMLFormElement>) => void;
}) {
  if (!section) {
    return null;
  }

  const content =
    section === "stats" ? (
      <StatisticForms items={data.profileStats} onSave={onSave} onDelete={onDelete} />
    ) : section === "boundaries" ? (
      <BoundaryForms items={data.boundaries} onSave={onSave} onDelete={onDelete} />
    ) : (
      <OfficialsForms items={data.officials} onSave={onSave} onDelete={onDelete} />
    );

  const title =
    section === "stats"
      ? "Edit Sejarah Desa"
      : section === "boundaries"
        ? "Edit Visi & Misi"
        : "Edit Struktur Organisasi";

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-[#1f1a0f]/45 px-4 py-6 backdrop-blur-sm sm:py-8">
      <div className="max-h-[calc(100vh-2rem)] w-full max-w-5xl overflow-y-auto rounded-[1.4rem] border border-[#d9ceb0] bg-[#fdfaf2] p-4 shadow-[0_30px_70px_-28px_rgba(31,26,15,0.6)] sm:max-h-[calc(100vh-4rem)] sm:rounded-[1.8rem] sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b6d00]">
              Kelola Profil Desa
            </p>
            <h2 className="mt-2 font-heading text-[1.45rem] font-bold text-[#2f2a1f] sm:text-[2rem]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="self-start rounded-full border border-[#d9ceb0] bg-white px-4 py-2 text-sm font-bold text-[#655a3f]"
          >
            Tutup
          </button>
        </div>

        <div className="mt-6">{content}</div>
      </div>
    </div>
  );
}

export function AdminProfileManager({
  currentAdmin,
  data,
  status,
  message,
}: AdminProfileManagerProps) {
  const { handleDeleteSubmit, handleSaveSubmit } = useAdminMutationHandlers();
  const [openSection, setOpenSection] = useState<ProfileSectionKey | null>(null);
  const sidebarItems = [
    { key: "dashboard", href: "/admin/", label: "Dashboard Overview", icon: <DashboardIcon /> },
    { key: "berita", href: "/admin/berita/", label: "Kelola Berita", icon: <NewsIcon /> },
    {
      key: "dokumentasi",
      href: "/admin/dokumentasi/",
      label: "Kelola Dokumentasi",
      icon: <GalleryIcon />,
    },
    { key: "pengaturan", href: "/admin/profil-desa/", label: "Pengaturan", icon: <SettingsIcon /> },
  ] as const;

  const sectionRows = useMemo<ProfileSectionSummary[]>(
    () => [
      {
        key: "stats",
        title: "Sejarah Desa",
        description: "Dipetakan ke statistik profil desa",
        status: data.profileStats.length > 0 ? "Aktif" : "Draft",
        updatedLabel: formatUpdatedLabel(data.profileStats.map((item) => item.updated_at)),
        entries: data.profileStats.length,
      },
      {
        key: "boundaries",
        title: "Visi & Misi",
        description: "Dipetakan ke batas wilayah desa",
        status: data.boundaries.length > 0 ? "Aktif" : "Draft",
        updatedLabel: formatUpdatedLabel(data.boundaries.map((item) => item.updated_at)),
        entries: data.boundaries.length,
      },
      {
        key: "officials",
        title: "Struktur Organisasi",
        description: "Dipetakan ke data aparatur desa",
        status: data.officials.length > 0 ? "Aktif" : "Draft",
        updatedLabel: formatUpdatedLabel(data.officials.map((item) => item.updated_at)),
        entries: data.officials.length,
      },
    ],
    [data.boundaries, data.officials, data.profileStats],
  );

  return (
    <main className="min-h-screen bg-[#fcfbf8] text-[#1f1b13]">
      <AdminSidebar active="pengaturan" items={sidebarItems} />

      <div className="lg:ml-[18rem]">
        <header className="sticky top-0 z-30 border-b border-[#decfae] bg-[#fcfbf8]/95 backdrop-blur">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-9">
            <h2 className="font-heading text-[1.55rem] font-bold text-[#8a6c00] sm:text-[1.9rem]">
              Kelola Profil Desa
            </h2>

            <div className="flex items-center gap-3">
              <div className="hidden min-w-[18rem] items-center gap-3 rounded-full bg-[#f5f2eb] px-4 py-3 text-[#8d8778] lg:flex">
                <SearchIcon />
                <span className="text-[1rem]">Cari pengaturan...</span>
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
            <AdminMobileMenu active="pengaturan" />
          </div>

          <section className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#8a8373]">Pengaturan &gt; Profil Desa</p>
              <h1 className="mt-2 font-heading text-[1.9rem] font-bold leading-tight text-[#8a6c00] sm:text-[2.35rem]">
                Daftar Profil Desa
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f695c] sm:text-base sm:leading-8">
                Bagian Sejarah Desa dipetakan ke statistik profil, Visi &amp; Misi dipetakan ke batas wilayah, dan Struktur Organisasi memakai data aparatur desa.
              </p>
            </div>

            <div className="flex w-full gap-3 sm:w-auto">
              <Link
                href="/profil-desa"
                className="inline-flex min-h-[3.1rem] w-full items-center justify-center rounded-[1rem] border border-[#bcae84] bg-white px-5 text-sm font-bold text-[#6a5715] sm:w-auto"
              >
                Pratinjau Situs
              </Link>
            </div>
          </section>

          <section className="mt-8 rounded-[1.25rem] border border-[#ddd2b5] bg-white shadow-[0_22px_45px_-34px_rgba(95,70,17,0.32)] sm:rounded-[1.5rem]">
            <div className="flex flex-col gap-4 border-b border-[#eee4c7] px-4 py-4 sm:px-5 sm:py-5 md:flex-row md:items-center md:justify-between">
              <h3 className="font-heading text-[1.2rem] font-bold text-[#2f2a1f] sm:text-[1.45rem]">
                Daftar Profil Desa
              </h3>
              <div className="rounded-[0.9rem] border border-[#ddd2b5] bg-[#fffdfa] px-4 py-2 text-sm text-[#6f695c]">
                Semua Status
              </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-[#eee4c7] bg-[#faf7ef] text-left text-xs font-bold uppercase tracking-[0.12em] text-[#746d5d]">
                    <th className="px-5 py-4">Nama Bagian</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Terakhir Diperbarui</th>
                    <th className="px-5 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {sectionRows.map((section) => (
                    <tr key={section.key} className="border-b border-[#f1ead5] last:border-b-0">
                      <td className="px-5 py-5 align-top">
                        <p className="text-[1rem] font-bold text-[#2f2a1f]">{section.title}</p>
                        <p className="mt-1 text-sm text-[#857e6f]">
                          {section.description} - {section.entries} item
                        </p>
                      </td>
                      <td className="px-5 py-5 align-top">
                        <TableStatus value={section.status} />
                      </td>
                      <td className="px-5 py-5 align-top text-sm text-[#5f5a4c]">
                        {section.updatedLabel}
                      </td>
                      <td className="px-5 py-5 align-top">
                        <div className="flex items-center gap-2 text-[#6d5d2d]">
                          <button
                            type="button"
                            onClick={() => setOpenSection(section.key)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d7b8] bg-[#fffdf7] transition hover:bg-[#f8f0d8]"
                            aria-label={`Edit ${section.title}`}
                          >
                            <PencilIcon />
                          </button>
                          <Link
                            href="/profil-desa"
                            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#e4d7b8] bg-[#fffdf7] transition hover:bg-[#f8f0d8]"
                            aria-label={`Pratinjau ${section.title}`}
                          >
                            <EyeIcon />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grid gap-4 p-4 md:hidden">
              {sectionRows.map((section) => (
                <div key={section.key} className="rounded-[1.1rem] border border-[#ece2c8] bg-[#fffdf8] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-[#2f2a1f]">{section.title}</p>
                      <p className="mt-1 text-sm leading-6 text-[#857e6f]">
                        {section.description} - {section.entries} item
                      </p>
                    </div>
                    <TableStatus value={section.status} />
                  </div>
                  <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#8a8373]">
                    Terakhir diperbarui
                  </p>
                  <p className="mt-1 text-sm text-[#5f5a4c]">{section.updatedLabel}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOpenSection(section.key)}
                      className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-[#e4d7b8] bg-[#fffdf7] text-[#6d5d2d]"
                    >
                      <PencilIcon />
                    </button>
                    <Link
                      href="/profil-desa"
                      className="inline-flex h-10 flex-1 items-center justify-center rounded-full border border-[#e4d7b8] bg-[#fffdf7] text-[#6d5d2d]"
                    >
                      <EyeIcon />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <ProfileModal
        section={openSection}
        onClose={() => setOpenSection(null)}
        data={data}
        onSave={handleSaveSubmit}
        onDelete={handleDeleteSubmit}
      />
    </main>
  );
}
