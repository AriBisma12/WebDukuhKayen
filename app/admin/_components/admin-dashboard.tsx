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

function Section({ id, title, description, children }: SectionProps) {
  return (
    <details
      id={id}
      className="group rounded-[2rem] border border-[#ddd0b8] bg-white/80 shadow-[0_25px_60px_-42px_rgba(52,37,13,0.75)]"
    >
      <summary className="cursor-pointer list-none p-6 md:p-8">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9a7b18]">
              Kelola Data
            </p>
            <h2 className="mt-2 font-heading text-3xl font-bold text-[#4d3906]">
              {title}
            </h2>
            <p className="mt-3 max-w-3xl leading-7 text-[#746650]">{description}</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#f4ead1] text-2xl font-bold text-[#7a5b0a] transition group-open:rotate-45">
            +
          </div>
        </div>
      </summary>
      <div className="border-t border-[#eadfca] px-6 pb-6 pt-2 md:px-8 md:pb-8">
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
      <span className="mb-2 block text-sm font-semibold text-[#674e12]">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-[#dacdb5] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
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
      <span className="mb-2 block text-sm font-semibold text-[#674e12]">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue ?? ""}
        rows={rows}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-[#dacdb5] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
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
    <div className="rounded-[1.6rem] border border-[#e2d7c4] bg-[#fffcf5] p-5 shadow-[0_18px_40px_-35px_rgba(52,37,13,0.72)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-heading text-2xl font-bold text-[#4c3807]">{title}</h3>
        {recordId && deletable ? (
          <form action={deleteRecordAction}>
            <input type="hidden" name="resource" value={resource} />
            <input type="hidden" name="id" value={recordId} />
            <button
              type="submit"
              className="rounded-full border border-[#e2b9b9] bg-[#fff4f4] px-4 py-2 text-sm font-semibold text-[#a24040] transition hover:bg-[#ffe9e9]"
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
        <button type="submit" className="hero-primary-button">
          {recordId ? "Simpan Perubahan" : "Tambah Data"}
        </button>
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
      className={`rounded-[1.4rem] border px-5 py-4 text-sm leading-7 ${
        isError
          ? "border-[#ebc7c7] bg-[#fff1f1] text-[#9d3333]"
          : "border-[#d9dfc6] bg-[#f5faea] text-[#476224]"
      }`}
    >
      {message}
    </div>
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
          <TextInput label="Urutan Tampil" name="urutan_tampil" type="number" defaultValue={0} required />
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
    >
      {items.map((item) => (
        <FormCard key={item.id} resource="berita_desa" recordId={item.id} title={item.judul}>
          <div className="grid gap-4 md:grid-cols-3">
            <TextInput label="Kategori" name="kategori" defaultValue={item.kategori} required />
            <TextInput label="Tanggal Terbit" name="tanggal_terbit" type="date" defaultValue={item.tanggal_terbit} />
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
          <TextInput label="URL Gambar" name="url_gambar" type="url" defaultValue={item.url_gambar} />
        </FormCard>
      ))}

      <FormCard resource="berita_desa" title="Tambah Berita Baru" deletable={false}>
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput label="Kategori" name="kategori" required />
          <TextInput label="Tanggal Terbit" name="tanggal_terbit" type="date" />
          <TextInput label="Urutan Tampil" name="urutan_tampil" type="number" defaultValue={0} required />
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
    <Section id={id} title={title} description={description}>
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
          <TextInput label="Urutan Tampil" name="urutan_tampil" type="number" defaultValue={0} required />
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
          <TextInput label="Urutan Tampil" name="urutan_tampil" type="number" defaultValue={0} required />
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
  return (
    <Section
      id="posting-dokumentasi"
      title="Posting Dokumentasi"
      description="Foto dokumentasi diisi dalam format JSON array. Setiap item wajib punya `image` dan opsional `alt`, `order`."
    >
      {posts.map((post) => (
        <FormCard key={post.id} resource="posting_dokumentasi" recordId={post.id} title={post.judul}>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#674e12]">
                Kategori
              </span>
              <select
                name="kategori_id"
                defaultValue={post.kategori_id ?? ""}
                className="w-full rounded-2xl border border-[#dacdb5] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
              >
                <option value="">Tanpa kategori</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nama}
                  </option>
                ))}
              </select>
            </label>
            <TextInput label="Tanggal Terbit" name="tanggal_terbit" type="date" defaultValue={post.tanggal_terbit} />
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
          <TextInput label="URL Gambar Cover" name="url_gambar" type="url" defaultValue={post.url_gambar} />
          <TextArea
            label="Photos JSON"
            name="photos_json"
            rows={8}
            defaultValue={photosToJson(post.foto_dokumentasi)}
            placeholder='[{"image":"https://...","alt":"Teks alt","order":1}]'
          />
        </FormCard>
      ))}

      <FormCard resource="posting_dokumentasi" title="Tambah Posting Dokumentasi" deletable={false}>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#674e12]">
              Kategori
            </span>
            <select
              name="kategori_id"
              defaultValue=""
              className="w-full rounded-2xl border border-[#dacdb5] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
            >
              <option value="">Tanpa kategori</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.nama}
                </option>
              ))}
            </select>
          </label>
          <TextInput label="Tanggal Terbit" name="tanggal_terbit" type="date" />
          <TextInput label="Urutan Tampil" name="urutan_tampil" type="number" defaultValue={0} required />
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
            <TextInput label="URL Video" name="url_video" type="url" defaultValue={item.url_video} />
          </div>
          <TextInput label="Judul" name="judul" defaultValue={item.judul} required />
          <TextInput label="URL Gambar" name="url_gambar" type="url" defaultValue={item.url_gambar} />
        </FormCard>
      ))}

      <FormCard resource="video_dokumentasi" title="Tambah Video Baru" deletable={false}>
        <div className="grid gap-4 md:grid-cols-3">
          <TextInput label="Durasi" name="durasi" />
          <TextInput label="Urutan Tampil" name="urutan_tampil" type="number" defaultValue={0} required />
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
          <TextInput label="Urutan Tampil" name="urutan_tampil" type="number" defaultValue={0} required />
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
          <TextInput label="Urutan Tampil" name="urutan_tampil" type="number" defaultValue={0} required />
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
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#674e12]">
                Status Akun
              </span>
              <select
                name="is_active"
                defaultValue={item.is_active ? "true" : "false"}
                className="w-full rounded-2xl border border-[#dacdb5] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
              >
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </label>
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
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-[#674e12]">
              Status Akun
            </span>
            <select
              name="is_active"
              defaultValue="true"
              className="w-full rounded-2xl border border-[#dacdb5] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
            >
              <option value="true">Aktif</option>
              <option value="false">Nonaktif</option>
            </select>
          </label>
        </div>
      </FormCard>
    </Section>
  );
}

export function AdminDashboard({
  currentAdmin,
  data,
  status,
  message,
}: AdminDashboardProps) {
  return (
    <main className="min-h-screen bg-[#f6f1e6] px-4 py-6 text-[#3d2f18] md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[2.2rem] border border-[#ddd0b8] bg-[linear-gradient(135deg,_rgba(255,252,245,0.96),_rgba(248,239,221,0.95))] p-6 shadow-[0_30px_70px_-44px_rgba(54,39,11,0.72)] md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="inline-flex rounded-full bg-[#f1d36f] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#664d08]">
                Admin Dashboard
              </p>
              <h1 className="mt-5 font-heading text-4xl font-extrabold text-[#4b3706] md:text-5xl">
                Kelola seluruh konten portal padukuhan dari satu tempat.
              </h1>
              <p className="mt-4 text-base leading-8 text-[#6f634f]">
                Login aktif sebagai <strong>{currentAdmin.displayName}</strong> ({currentAdmin.username}).
                Setiap form di bawah ini langsung terhubung ke database Supabase.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a href="#akun-admin" className="hero-secondary-button">
                Kelola Akun
              </a>
              <a href="#berita" className="hero-secondary-button">
                Kelola Berita
              </a>
              <form action={logoutAdminAction}>
                <button type="submit" className="hero-primary-button">
                  Logout
                </button>
              </form>
            </div>
          </div>
        </header>

        <MessageBanner status={status} message={message} />

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
    </main>
  );
}
