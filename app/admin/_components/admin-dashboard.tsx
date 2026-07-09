import type { ReactNode } from "react";
import type { AdminSessionUser } from "@/lib/admin-auth";
import type {
  AdminBoundary,
  AdminDashboardData,
  AdminDocumentationCategory,
  AdminDocumentationPost,
  AdminDocumentationVideo,
  AdminNavigationLink,
  AdminNewsItem,
  AdminOfficial,
  AdminStatItem,
  AdminUserRecord,
} from "@/lib/admin-data";
import {
  deleteRecordAction,
  logoutAdminAction,
  saveRecordAction,
} from "../actions";

type AdminDashboardProps = {
  currentAdmin: AdminSessionUser;
  data: AdminDashboardData;
  status?: string;
  message?: string;
};

type SectionProps = {
  id: string;
  title: string;
  description: string;
  badge?: string;
  count?: number;
  children: ReactNode;
};

type TextInputProps = {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  type?: "text" | "number" | "date" | "url" | "password";
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

type SelectInputProps = {
  label: string;
  name: string;
  defaultValue?: string;
  options: Array<{ label: string; value: string }>;
};

type SectionNavItem = {
  id: string;
  label: string;
  description: string;
  count: number;
};

function formatAdminDate(dateValue: string | null | undefined) {
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
  }).format(date);
}

function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-2 block text-sm font-semibold tracking-[0.01em] text-[#674e12]">
      {children}
    </span>
  );
}

function SelectInput({ label, name, defaultValue, options }: SelectInputProps) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <select
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-2xl border border-[#d7c9b1] bg-[#fffdfa] px-4 py-3 text-[#3f3015] outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Section({
  id,
  title,
  description,
  badge = "Kelola Data",
  count,
  children,
}: SectionProps) {
  return (
    <details
      id={id}
      open
      className="group overflow-hidden rounded-[2rem] border border-[#d9ccb5] bg-[linear-gradient(180deg,_rgba(255,252,246,0.96),_rgba(250,244,232,0.95))] shadow-[0_28px_70px_-48px_rgba(52,37,13,0.78)]"
    >
      <summary className="cursor-pointer list-none p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className="inline-flex rounded-full bg-[#f3df9f] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#775700]">
                {badge}
              </p>
              {typeof count === "number" ? (
                <span className="inline-flex rounded-full border border-[#dfcfb1] bg-white/80 px-3 py-1 text-xs font-semibold text-[#7a6240]">
                  {count} item
                </span>
              ) : null}
            </div>
            <h2 className="mt-4 font-heading text-3xl font-bold text-[#4d3906] md:text-[2.15rem]">
              {title}
            </h2>
            <p className="mt-3 max-w-3xl text-[1rem] leading-7 text-[#746650]">
              {description}
            </p>
          </div>

          <div className="flex items-center gap-3 text-sm font-semibold text-[#7c6435]">
            <span className="hidden md:inline">Buka panel</span>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#e1d5c0] bg-white/85 text-2xl font-bold text-[#7a5b0a] transition duration-200 group-open:rotate-45">
              +
            </div>
          </div>
        </div>
      </summary>
      <div className="border-t border-[#eadfca] px-6 pb-6 pt-5 md:px-8 md:pb-8">
        <div className="space-y-5">{children}</div>
      </div>
    </details>
  );
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
        className="w-full rounded-2xl border border-[#d7c9b1] bg-[#fffdfa] px-4 py-3 text-[#3f3015] outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
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
        className="w-full rounded-2xl border border-[#d7c9b1] bg-[#fffdfa] px-4 py-3 text-[#3f3015] outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
      />
    </label>
  );
}

function FormCard({
  resource,
  recordId,
  title,
  children,
  deletable = true,
}: {
  resource: string;
  recordId?: string;
  title: string;
  children: ReactNode;
  deletable?: boolean;
}) {
  return (
    <div className="rounded-[1.7rem] border border-[#e1d5c0] bg-[linear-gradient(180deg,_#fffef9,_#fbf5e8)] p-5 shadow-[0_20px_45px_-34px_rgba(52,37,13,0.72)] md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="inline-flex rounded-full bg-[#f7efd8] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-[#896915]">
            {recordId ? "Edit Data" : "Data Baru"}
          </div>
          <h3 className="mt-3 font-heading text-[1.7rem] font-bold leading-tight text-[#4c3807]">
            {title}
          </h3>
        </div>
        {recordId && deletable ? (
          <form action={deleteRecordAction}>
            <input type="hidden" name="resource" value={resource} />
            <input type="hidden" name="id" value={recordId} />
            <button
              type="submit"
              className="rounded-full border border-[#e6bcbc] bg-[#fff5f5] px-4 py-2 text-sm font-semibold text-[#a24040] transition hover:bg-[#ffeaea]"
            >
              Hapus
            </button>
          </form>
        ) : null}
      </div>

      <form action={saveRecordAction} className="mt-5 space-y-4">
        <input type="hidden" name="resource" value={resource} />
        {recordId ? <input type="hidden" name="id" value={recordId} /> : null}
        {children}
        <div className="flex justify-end pt-2">
          <button type="submit" className="hero-primary-button">
            {recordId ? "Simpan Perubahan" : "Tambah Data"}
          </button>
        </div>
      </form>
    </div>
  );
}

function MessageBanner({
  status,
  message,
}: {
  status?: string;
  message?: string;
}) {
  if (!message) {
    return null;
  }

  const isError = status === "error";

  return (
    <div
      className={`rounded-[1.6rem] border px-5 py-4 text-sm leading-7 shadow-[0_18px_34px_-28px_rgba(52,37,13,0.4)] ${
        isError
          ? "border-[#ebc7c7] bg-[#fff1f1] text-[#9d3333]"
          : "border-[#d9dfc6] bg-[#f5faea] text-[#476224]"
      }`}
    >
      {message}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
  badge,
}: {
  label: string;
  value: string;
  accent: string;
  badge?: string;
}) {
  return (
    <div className="rounded-[1.45rem] border border-[#ddcfb0] bg-white p-7 shadow-[0_18px_34px_-26px_rgba(98,75,10,0.24)]">
      <div className="flex items-start justify-between gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f8efd6] text-2xl font-bold"
          style={{ color: accent }}
        >
          □
        </div>
        {badge ? (
          <span className="rounded-xl bg-[#ffd867] px-3 py-1 text-xs font-bold text-[#866800]">
            {badge}
          </span>
        ) : null}
      </div>
      <p className="mt-6 text-sm font-semibold uppercase tracking-[0.12em] text-[#73684f]">
        {label}
      </p>
      <p className="mt-2 font-heading text-[2.3rem] font-extrabold text-[#8a6c00]">
        {value}
      </p>
    </div>
  );
}

function SideNavigation({ items }: { items: SectionNavItem[] }) {
  const primaryItems = [
    {
      id: "dashboard-overview",
      label: "Dashboard Overview",
      description: "Ringkasan utama panel admin",
    },
    {
      id: "berita",
      label: "Kelola Berita",
      description: "Berita dan pengumuman desa",
    },
    {
      id: "posting-dokumentasi",
      label: "Kelola Dokumentasi",
      description: "Galeri foto dan video kegiatan",
    },
    {
      id: "akun-admin",
      label: "Pengaturan",
      description: "Akun admin dan akses panel",
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[22rem] flex-col border-r border-[#dccdab] bg-[#f8f6f1] px-6 py-7 shadow-[8px_0_30px_-28px_rgba(98,75,10,0.24)] lg:flex">
      <div className="mb-12 px-1">
        <h1 className="font-heading text-[2.1rem] font-extrabold text-[#8a6c00]">
          Padukuhan Kayen
        </h1>
        <p className="mt-1 text-lg text-[#8a816e]">Village Admin Panel</p>
      </div>

      <div className="space-y-3">
        {primaryItems.map((item, index) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`block rounded-3xl px-5 py-4 transition ${
              index === 0
                ? "bg-[#8a6c00] text-white shadow-[0_18px_28px_-24px_rgba(98,75,10,0.85)]"
                : "text-[#5e5647] hover:bg-[#efe8d8]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[1.15rem] font-semibold leading-7">{item.label}</p>
                <p
                  className={`mt-1 text-sm leading-6 ${
                    index === 0 ? "text-[#f8efd6]" : "text-[#8a816e]"
                  }`}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[#e3d7ba] bg-white/70 p-4">
        <p className="text-sm font-semibold text-[#73684f]">
          Modul lain di schema: {items.length} koleksi data
        </p>
        <p className="mt-2 text-sm leading-6 text-[#8a816e]">
          Navigasi, statistik, aparatur, batas wilayah, dan akun admin tetap tersedia di bawah
          halaman ini.
        </p>
      </div>

      <div className="mt-auto border-t border-[#ddcfb0] pt-5">
        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="w-full rounded-2xl px-4 py-3 text-left text-lg font-semibold text-[#6e6045] transition hover:bg-[#efe8d8]"
          >
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}

function photosToJson(photos: AdminDocumentationPost["foto_dokumentasi"]) {
  return JSON.stringify(
    photos.map((photo) => ({
      image: photo.url_foto,
      alt: photo.teks_alt ?? "",
      order: photo.urutan_tampil,
    })),
    null,
    2,
  );
}

function NavigationSection({ items }: { items: AdminNavigationLink[] }) {
  return (
    <Section
      id="navigasi"
      title="Tautan Navigasi"
      description="Atur menu yang muncul pada header situs. Href sebaiknya memakai path internal seperti `/profil-desa`."
      badge="Header Situs"
      count={items.length}
    >
      {items.map((item) => (
        <FormCard
          key={item.id}
          resource="tautan_navigasi"
          recordId={item.id}
          title={item.label}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput label="Label" name="label" defaultValue={item.label} required />
            <TextInput label="Href" name="href" defaultValue={item.href} required />
            <TextInput
              label="Urutan Tampil"
              name="urutan_tampil"
              type="number"
              defaultValue={item.urutan_tampil}
              required
            />
          </div>
        </FormCard>
      ))}

      <FormCard resource="tautan_navigasi" title="Tambah Tautan Baru" deletable={false}>
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput label="Label" name="label" required />
          <TextInput label="Href" name="href" required placeholder="/halaman-baru" />
          <TextInput
            label="Urutan Tampil"
            name="urutan_tampil"
            type="number"
            defaultValue={0}
            required
          />
        </div>
      </FormCard>
    </Section>
  );
}

function NewsSection({ items }: { items: AdminNewsItem[] }) {
  return (
    <Section
      id="berita"
      title="Kabar Padukuhan"
      description="Kelola kartu berita yang tampil di beranda dan halaman kabar padukuhan."
      badge="Konten Berita"
      count={items.length}
    >
      {items.map((item) => (
        <FormCard key={item.id} resource="berita_desa" recordId={item.id} title={item.judul}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput label="Kategori" name="kategori" defaultValue={item.kategori} required />
            <TextInput
              label="Tanggal Terbit"
              name="tanggal_terbit"
              type="date"
              defaultValue={item.tanggal_terbit}
            />
            <TextInput
              label="Urutan Tampil"
              name="urutan_tampil"
              type="number"
              defaultValue={item.urutan_tampil}
              required
            />
          </div>
          <TextInput label="Judul" name="judul" defaultValue={item.judul} required />
          <TextArea label="Ringkasan" name="ringkasan" defaultValue={item.ringkasan} required />
          <TextInput
            label="URL Gambar"
            name="url_gambar"
            type="url"
            defaultValue={item.url_gambar}
          />
        </FormCard>
      ))}

      <FormCard resource="berita_desa" title="Tambah Berita Baru" deletable={false}>
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput label="Kategori" name="kategori" required />
          <TextInput label="Tanggal Terbit" name="tanggal_terbit" type="date" />
          <TextInput
            label="Urutan Tampil"
            name="urutan_tampil"
            type="number"
            defaultValue={0}
            required
          />
        </div>
        <TextInput label="Judul" name="judul" required />
        <TextArea label="Ringkasan" name="ringkasan" required />
        <TextInput label="URL Gambar" name="url_gambar" type="url" />
      </FormCard>
    </Section>
  );
}

function StatSection({
  id,
  title,
  description,
  resource,
  items,
}: {
  id: string;
  title: string;
  description: string;
  resource: "statistik_desa" | "statistik_profil";
  items: AdminStatItem[];
}) {
  return (
    <Section
      id={id}
      title={title}
      description={description}
      badge="Angka Ringkas"
      count={items.length}
    >
      {items.map((item) => (
        <FormCard key={item.id} resource={resource} recordId={item.id} title={item.label}>
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
        </FormCard>
      ))}

      <FormCard resource={resource} title={`Tambah ${title}`} deletable={false}>
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
      </FormCard>
    </Section>
  );
}

function DocumentationCategorySection({ items }: { items: AdminDocumentationCategory[] }) {
  return (
    <Section
      id="kategori-dokumentasi"
      title="Kategori Dokumentasi"
      description="Kategori ini dipakai oleh posting dokumentasi. Hapus kategori hanya jika tidak lagi dipakai."
      badge="Dokumentasi"
      count={items.length}
    >
      {items.map((item) => (
        <FormCard
          key={item.id}
          resource="kategori_dokumentasi"
          recordId={item.id}
          title={item.nama}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Nama Kategori" name="nama" defaultValue={item.nama} required />
            <TextInput
              label="Urutan Tampil"
              name="urutan_tampil"
              type="number"
              defaultValue={item.urutan_tampil}
              required
            />
          </div>
        </FormCard>
      ))}

      <FormCard resource="kategori_dokumentasi" title="Tambah Kategori Baru" deletable={false}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Nama Kategori" name="nama" required />
          <TextInput
            label="Urutan Tampil"
            name="urutan_tampil"
            type="number"
            defaultValue={0}
            required
          />
        </div>
      </FormCard>
    </Section>
  );
}

function DocumentationPostSection({
  categories,
  posts,
}: {
  categories: AdminDocumentationCategory[];
  posts: AdminDocumentationPost[];
}) {
  const categoryOptions = [
    { label: "Tanpa kategori", value: "" },
    ...categories.map((category) => ({
      label: category.nama,
      value: category.id,
    })),
  ];

  return (
    <Section
      id="posting-dokumentasi"
      title="Posting Dokumentasi"
      description="Foto dokumentasi diisi dalam format JSON array. Setiap item wajib punya `image` dan opsional `alt`, `order`."
      badge="Galeri Kegiatan"
      count={posts.length}
    >
      {posts.map((post) => (
        <FormCard
          key={post.id}
          resource="posting_dokumentasi"
          recordId={post.id}
          title={post.judul}
        >
          <div className="grid gap-4 md:grid-cols-3">
            <SelectInput
              label="Kategori"
              name="kategori_id"
              defaultValue={post.kategori_id ?? ""}
              options={categoryOptions}
            />
            <TextInput
              label="Tanggal Terbit"
              name="tanggal_terbit"
              type="date"
              defaultValue={post.tanggal_terbit}
            />
            <TextInput
              label="Urutan Tampil"
              name="urutan_tampil"
              type="number"
              defaultValue={post.urutan_tampil}
              required
            />
          </div>
          <TextInput label="Judul" name="judul" defaultValue={post.judul} required />
          <TextArea label="Ringkasan" name="ringkasan" defaultValue={post.ringkasan} required />
          <TextInput
            label="URL Gambar Cover"
            name="url_gambar"
            type="url"
            defaultValue={post.url_gambar}
          />
          <TextArea
            label="Photos JSON"
            name="photos_json"
            rows={8}
            defaultValue={photosToJson(post.foto_dokumentasi)}
            placeholder='[{"image":"https://...","alt":"Teks alt","order":1}]'
          />
        </FormCard>
      ))}

      <FormCard
        resource="posting_dokumentasi"
        title="Tambah Posting Dokumentasi"
        deletable={false}
      >
        <div className="grid gap-4 md:grid-cols-3">
          <SelectInput
            label="Kategori"
            name="kategori_id"
            defaultValue=""
            options={categoryOptions}
          />
          <TextInput label="Tanggal Terbit" name="tanggal_terbit" type="date" />
          <TextInput
            label="Urutan Tampil"
            name="urutan_tampil"
            type="number"
            defaultValue={0}
            required
          />
        </div>
        <TextInput label="Judul" name="judul" required />
        <TextArea label="Ringkasan" name="ringkasan" required />
        <TextInput label="URL Gambar Cover" name="url_gambar" type="url" />
        <TextArea
          label="Photos JSON"
          name="photos_json"
          rows={8}
          placeholder='[{"image":"https://...","alt":"Teks alt","order":1}]'
        />
      </FormCard>
    </Section>
  );
}

function VideoSection({ items }: { items: AdminDocumentationVideo[] }) {
  return (
    <Section
      id="video-dokumentasi"
      title="Video Dokumentasi"
      description="Kelola video dokumentasi yang muncul di halaman dokumentasi kegiatan."
      badge="Media Video"
      count={items.length}
    >
      {items.map((item) => (
        <FormCard key={item.id} resource="video_dokumentasi" recordId={item.id} title={item.judul}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput label="Durasi" name="durasi" defaultValue={item.durasi} />
            <TextInput
              label="Urutan Tampil"
              name="urutan_tampil"
              type="number"
              defaultValue={item.urutan_tampil}
              required
            />
            <TextInput
              label="URL Video"
              name="url_video"
              type="url"
              defaultValue={item.url_video}
            />
          </div>
          <TextInput label="Judul" name="judul" defaultValue={item.judul} required />
          <TextInput
            label="URL Gambar"
            name="url_gambar"
            type="url"
            defaultValue={item.url_gambar}
          />
        </FormCard>
      ))}

      <FormCard resource="video_dokumentasi" title="Tambah Video Baru" deletable={false}>
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput label="Durasi" name="durasi" />
          <TextInput
            label="Urutan Tampil"
            name="urutan_tampil"
            type="number"
            defaultValue={0}
            required
          />
          <TextInput label="URL Video" name="url_video" type="url" />
        </div>
        <TextInput label="Judul" name="judul" required />
        <TextInput label="URL Gambar" name="url_gambar" type="url" />
      </FormCard>
    </Section>
  );
}

function OfficialsSection({ items }: { items: AdminOfficial[] }) {
  return (
    <Section
      id="aparatur"
      title="Aparatur Padukuhan"
      description="Kelola susunan aparatur yang tampil pada halaman profil padukuhan."
      badge="Profil Desa"
      count={items.length}
    >
      {items.map((item) => (
        <FormCard key={item.id} resource="aparatur_desa" recordId={item.id} title={item.nama}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput label="Nama" name="nama" defaultValue={item.nama} required />
            <TextInput label="Peran" name="peran" defaultValue={item.peran} required />
            <TextInput
              label="Urutan Tampil"
              name="urutan_tampil"
              type="number"
              defaultValue={item.urutan_tampil}
              required
            />
          </div>
          <TextInput label="URL Foto" name="url_foto" type="url" defaultValue={item.url_foto} />
          <TextArea label="Bio" name="bio" defaultValue={item.bio} rows={5} />
        </FormCard>
      ))}

      <FormCard resource="aparatur_desa" title="Tambah Aparatur Baru" deletable={false}>
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput label="Nama" name="nama" required />
          <TextInput label="Peran" name="peran" required />
          <TextInput
            label="Urutan Tampil"
            name="urutan_tampil"
            type="number"
            defaultValue={0}
            required
          />
        </div>
        <TextInput label="URL Foto" name="url_foto" type="url" />
        <TextArea label="Bio" name="bio" rows={5} />
      </FormCard>
    </Section>
  );
}

function BoundariesSection({ items }: { items: AdminBoundary[] }) {
  return (
    <Section
      id="batas-wilayah"
      title="Batas Wilayah"
      description="Kelola deskripsi batas wilayah yang muncul di halaman profil padukuhan."
      badge="Wilayah"
      count={items.length}
    >
      {items.map((item) => (
        <FormCard key={item.id} resource="batas_wilayah_desa" recordId={item.id} title={item.arah}>
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
          <TextArea label="Deskripsi" name="deskripsi" defaultValue={item.deskripsi} required />
        </FormCard>
      ))}

      <FormCard resource="batas_wilayah_desa" title="Tambah Batas Wilayah" deletable={false}>
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
        <TextArea label="Deskripsi" name="deskripsi" required />
      </FormCard>
    </Section>
  );
}

function AdminUsersSection({
  currentAdmin,
  items,
}: {
  currentAdmin: AdminSessionUser;
  items: AdminUserRecord[];
}) {
  return (
    <Section
      id="akun-admin"
      title="Akun Admin"
      description="Kelola akun login admin panel. Password hanya berubah jika field password diisi."
      badge="Keamanan"
      count={items.length}
    >
      {items.map((item) => (
        <FormCard
          key={item.id}
          resource="admin_users"
          recordId={item.id}
          title={`${item.display_name} (${item.username})`}
          deletable={item.id !== currentAdmin.id}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput label="Username" name="username" defaultValue={item.username} required />
            <TextInput
              label="Nama Tampilan"
              name="display_name"
              defaultValue={item.display_name}
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Password Baru"
              name="password"
              type="password"
              placeholder="Kosongkan jika tidak diganti"
            />
            <SelectInput
              label="Status Akun"
              name="is_active"
              defaultValue={item.is_active ? "true" : "false"}
              options={[
                { label: "Aktif", value: "true" },
                { label: "Nonaktif", value: "false" },
              ]}
            />
          </div>
          {item.id === currentAdmin.id ? (
            <p className="rounded-2xl bg-[#f7efd9] px-4 py-3 text-sm leading-7 text-[#715b28]">
              Ini akun yang sedang Anda pakai, jadi tombol hapus disembunyikan untuk keamanan.
            </p>
          ) : null}
        </FormCard>
      ))}

      <FormCard resource="admin_users" title="Tambah Akun Admin Baru" deletable={false}>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Username" name="username" required />
          <TextInput label="Nama Tampilan" name="display_name" required />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Password" name="password" type="password" required />
          <SelectInput
            label="Status Akun"
            name="is_active"
            defaultValue="true"
            options={[
              { label: "Aktif", value: "true" },
              { label: "Nonaktif", value: "false" },
            ]}
          />
        </div>
      </FormCard>
    </Section>
  );
}

function QuickActivity({
  data,
}: {
  data: AdminDashboardData;
}) {
  const latestNews = data.news[0];
  const latestDocumentation = data.documentationPosts[0] ?? data.documentationVideos[0];
  const rows = [
    latestNews
      ? {
          label: latestNews.judul,
          detail: `Berita kategori ${latestNews.kategori}`,
          status: "Live",
          time: formatAdminDate(latestNews.tanggal_terbit),
        }
      : {
          label: "Belum ada berita",
          detail: "Tambahkan berita pertama dari panel ini",
          status: "Kosong",
          time: "-",
        },
    latestDocumentation
      ? {
          label: latestDocumentation.judul,
          detail:
            "foto_dokumentasi" in latestDocumentation
              ? `${latestDocumentation.foto_dokumentasi.length} foto dokumentasi tersimpan`
              : "Video dokumentasi tersedia untuk publik",
          status: "Update",
          time: formatAdminDate(
            "tanggal_terbit" in latestDocumentation
              ? latestDocumentation.tanggal_terbit
              : null,
          ),
        }
      : {
          label: "Belum ada posting dokumentasi",
          detail: "Galeri kegiatan belum memiliki posting",
          status: "Kosong",
          time: "-",
        },
  ];

  return (
    <section className="rounded-[1.85rem] border border-[#ddcfb0] bg-white px-8 py-7 shadow-[0_18px_34px_-28px_rgba(98,75,10,0.24)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-4xl font-bold text-[#8a6c00]">Aktivitas Terbaru</h2>
        </div>
        <span className="text-2xl font-medium text-[#8a6c00]">Lihat Semua</span>
      </div>

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[620px] text-left">
          <thead className="text-sm uppercase tracking-[0.08em] text-[#6f6555]">
            <tr>
              <th className="border-b border-[#e3d7ba] px-3 py-4 font-semibold">Aktivitas</th>
              <th className="border-b border-[#e3d7ba] px-3 py-4 font-semibold">Status</th>
              <th className="border-b border-[#e3d7ba] px-3 py-4 font-semibold">Waktu</th>
              <th className="border-b border-[#e3d7ba] px-3 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#efe6d2]">
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="px-3 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ffd34d] text-xl font-bold text-white">
                      ≣
                    </div>
                    <div>
                      <p className="text-2xl font-medium text-[#4b453b]">{row.label}</p>
                      <p className="text-lg text-[#8a816e]">{row.detail}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-6">
                  <span className="rounded-full bg-[#dedede] px-4 py-2 text-lg font-semibold text-[#585858]">
                    {row.status}
                  </span>
                </td>
                <td className="px-3 py-6 text-xl text-[#726858]">{row.time}</td>
                <td className="px-3 py-6 text-3xl text-[#7b715e]">⋮</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function InfoPanel({ data }: { data: AdminDashboardData }) {
  const documentationTotal = data.documentationPosts.length + data.documentationVideos.length;
  const totalAdmin = data.adminUsers.length;
  const activeAdmin = data.adminUsers.filter((item) => item.is_active).length;

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-[1.85rem] bg-[#8a6c00] p-8 text-white shadow-[0_22px_40px_-28px_rgba(98,75,10,0.7)]">
        <div className="relative z-10 max-w-2xl">
          <h3 className="font-heading text-[2.8rem] font-bold">Informasi Desa</h3>
          <p className="mt-6 text-[1.8rem] leading-[1.6] text-[#f7efd8]">
            Pastikan seluruh data publik portal desa sudah diverifikasi sebelum dipublikasikan
            kepada warga.
          </p>
          <a
            href="#navigasi"
            className="mt-10 inline-flex text-2xl font-bold text-white"
          >
            Kelola Konten Sekarang
          </a>
        </div>
        <div className="pointer-events-none absolute -bottom-6 -right-4 text-[10rem] font-bold text-white/10">
          ◔
        </div>
      </div>

      <div className="rounded-[1.85rem] border border-[#ddcfb0] bg-white p-8 shadow-[0_18px_34px_-28px_rgba(98,75,10,0.24)]">
        <h3 className="font-heading text-[2.7rem] font-bold text-[#8a6c00]">Status Konten</h3>
        <div className="mt-6 space-y-5">
          {[
            {
              label: "Berita",
              value: `${data.news.length} item`,
              width:
                data.news.length > 0
                  ? `${Math.min(100, Math.max(18, data.news.length * 12))}%`
                  : "0%",
              color: "#8a6c00",
            },
            {
              label: "Dokumentasi",
              value: `${documentationTotal} media`,
              width:
                documentationTotal > 0
                  ? `${Math.min(100, Math.max(18, documentationTotal * 10))}%`
                  : "0%",
              color: "#b28a00",
            },
            {
              label: "Admin Aktif",
              value: `${activeAdmin}/${totalAdmin}`,
              width:
                totalAdmin > 0
                  ? `${Math.round((activeAdmin / totalAdmin) * 100)}%`
                  : "0%",
              color: "#cf2b2b",
            },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-3 flex items-center justify-between text-xl">
                <span className="font-medium text-[#73684f]">{item.label}</span>
                <span className="font-bold text-[#8a6c00]">{item.value}</span>
              </div>
              <div className="h-3 rounded-full bg-[#ececec]">
                <div
                  className="h-3 rounded-full"
                  style={{ width: item.width, backgroundColor: item.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AdminDashboard({
  currentAdmin,
  data,
  status,
  message,
}: AdminDashboardProps) {
  const sectionItems: SectionNavItem[] = [
    {
      id: "navigasi",
      label: "Navigasi",
      description: "Header dan tautan utama situs",
      count: data.navigation.length,
    },
    {
      id: "berita",
      label: "Berita",
      description: "Kabar terbaru padukuhan",
      count: data.news.length,
    },
    {
      id: "statistik-beranda",
      label: "Statistik Beranda",
      description: "Angka ringkas di halaman utama",
      count: data.villageStats.length,
    },
    {
      id: "kategori-dokumentasi",
      label: "Kategori",
      description: "Pengelompokan dokumentasi kegiatan",
      count: data.documentationCategories.length,
    },
    {
      id: "posting-dokumentasi",
      label: "Posting Dokumentasi",
      description: "Galeri dan foto kegiatan",
      count: data.documentationPosts.length,
    },
    {
      id: "video-dokumentasi",
      label: "Video",
      description: "Video dokumentasi publik",
      count: data.documentationVideos.length,
    },
    {
      id: "statistik-profil",
      label: "Statistik Profil",
      description: "Angka ringkas profil desa",
      count: data.profileStats.length,
    },
    {
      id: "aparatur",
      label: "Aparatur",
      description: "Daftar pengurus padukuhan",
      count: data.officials.length,
    },
    {
      id: "batas-wilayah",
      label: "Batas Wilayah",
      description: "Deskripsi area administratif",
      count: data.boundaries.length,
    },
    {
      id: "akun-admin",
      label: "Akun Admin",
      description: "Akses login panel",
      count: data.adminUsers.length,
    },
  ];

  return (
    <main className="min-h-screen bg-[#fcfbf8] text-[#191c1d]">
      <SideNavigation items={sectionItems} />

      <div className="lg:ml-[22rem]">
        <header className="sticky top-0 z-30 border-b border-[#ddcfb0] bg-[#fcfbf8]/95 backdrop-blur">
          <div className="flex min-h-16 items-center justify-between gap-4 px-8 py-6">
            <div>
              <h2 className="font-heading text-[3rem] font-bold text-[#8a6c00]">Admin Dashboard</h2>
            </div>

            <div className="flex flex-1 items-center justify-end gap-3">
              <div className="hidden w-full max-w-md items-center rounded-full bg-[#f7f5ef] px-6 py-3 lg:flex">
                <span className="text-2xl text-[#8a816e]">Search...</span>
              </div>
              <div className="rounded-full border border-[#ddcfb0] bg-white px-4 py-2 text-lg font-semibold text-[#73684f]">
                {currentAdmin.displayName}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1400px] space-y-10 px-8 py-10">
          <section id="dashboard-overview" className="bg-white">
            <div className="grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
              <div>
                <h1 className="max-w-4xl font-heading text-[4.4rem] font-extrabold leading-[1.1] text-[#8a6c00]">
                  Welcome, {currentAdmin.displayName}
                </h1>
                <p className="mt-5 max-w-3xl text-[2rem] leading-[1.55] text-[#7f7566]">
                  Overview of village activities and administrative tasks for today.
                </p>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  <SummaryCard
                    label="Tautan Navigasi"
                    value={String(data.navigation.length)}
                    accent="#8a6c00"
                    badge={data.navigation.length > 0 ? "Active" : undefined}
                  />
                  <SummaryCard
                    label="Berita Baru"
                    value={String(data.news.length)}
                    accent="#8a6c00"
                    badge={data.news.length > 0 ? "Update" : undefined}
                  />
                  <SummaryCard
                    label="Galeri Update"
                    value={String(data.documentationPosts.length + data.documentationVideos.length)}
                    accent="#8a6c00"
                    badge={
                      data.documentationPosts.length + data.documentationVideos.length > 0
                        ? "Active"
                        : undefined
                    }
                  />
                </div>
              </div>

              <div className="flex flex-col justify-start pt-20">
                <div className="flex flex-wrap gap-5">
                  <a
                    href="#berita"
                    className="inline-flex min-h-[5.8rem] min-w-[18rem] items-center justify-center rounded-2xl bg-[#8a6c00] px-8 text-[1.9rem] font-bold text-white shadow-[0_20px_30px_-24px_rgba(98,75,10,0.8)]"
                  >
                    Buat Berita Baru
                  </a>
                  <a
                    href="#posting-dokumentasi"
                    className="inline-flex min-h-[5.8rem] min-w-[20rem] items-center justify-center rounded-2xl border-2 border-[#8a6c00] bg-white px-8 text-[1.9rem] font-bold text-[#8a6c00]"
                  >
                    Tambah Dokumentasi
                  </a>
                </div>
              </div>
            </div>
          </section>

          <MessageBanner status={status} message={message} />

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-start">
            <QuickActivity data={data} />
            <InfoPanel data={data} />
          </section>

          <div className="space-y-6">
            <NavigationSection items={data.navigation} />
            <NewsSection items={data.news} />
            <StatSection
              id="statistik-beranda"
              title="Statistik Beranda"
              description="Angka ringkas yang tampil di section statistik pada beranda."
              resource="statistik_desa"
              items={data.villageStats}
            />
            <DocumentationCategorySection items={data.documentationCategories} />
            <DocumentationPostSection
              categories={data.documentationCategories}
              posts={data.documentationPosts}
            />
            <VideoSection items={data.documentationVideos} />
            <StatSection
              id="statistik-profil"
              title="Statistik Profil"
              description="Statistik ringkas pada halaman profil padukuhan."
              resource="statistik_profil"
              items={data.profileStats}
            />
            <OfficialsSection items={data.officials} />
            <BoundariesSection items={data.boundaries} />
            <AdminUsersSection currentAdmin={currentAdmin} items={data.adminUsers} />
          </div>
        </div>
      </div>
    </main>
  );
}
