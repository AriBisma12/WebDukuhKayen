-- Script SQL untuk membuat/memperbarui tabel Supabase Portal Padukuhan Kayen
-- Jalankan sebagai migration atau paste ke SQL Editor Supabase.
-- Struktur tabel mengikuti database proyek saat ini.

create extension if not exists pgcrypto;

-- ==========================================
-- TABEL UTAMA WEBSITE
-- ==========================================

-- Tabel: tautan_navigasi
create table if not exists public.tautan_navigasi (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    href text not null unique,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Tabel: berita_desa
create table if not exists public.berita_desa (
    id uuid primary key default gen_random_uuid(),
    kategori text not null,
    judul text not null,
    ringkasan text not null,
    url_gambar text,
    tanggal_terbit date,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Tabel: statistik_desa
create table if not exists public.statistik_desa (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    value text not null,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Tabel: kategori_dokumentasi
create table if not exists public.kategori_dokumentasi (
    id uuid primary key default gen_random_uuid(),
    nama text not null unique,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Tabel: posting_dokumentasi
create table if not exists public.posting_dokumentasi (
    id uuid primary key default gen_random_uuid(),
    kategori_id uuid references public.kategori_dokumentasi(id) on delete set null,
    judul text not null,
    ringkasan text not null,
    url_gambar text,
    tanggal_terbit date,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Tabel: foto_dokumentasi
create table if not exists public.foto_dokumentasi (
    id uuid primary key default gen_random_uuid(),
    posting_id uuid not null references public.posting_dokumentasi(id) on delete cascade,
    url_foto text not null,
    teks_alt text,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Tabel: video_dokumentasi
create table if not exists public.video_dokumentasi (
    id uuid primary key default gen_random_uuid(),
    judul text not null,
    durasi text,
    url_gambar text,
    url_video text,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Tabel: statistik_profil
create table if not exists public.statistik_profil (
    id uuid primary key default gen_random_uuid(),
    label text not null,
    value text not null,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Tabel: aparatur_desa
create table if not exists public.aparatur_desa (
    id uuid primary key default gen_random_uuid(),
    nama text not null,
    peran text not null,
    url_foto text,
    bio text,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- Tabel: batas_wilayah_desa
create table if not exists public.batas_wilayah_desa (
    id uuid primary key default gen_random_uuid(),
    arah text not null,
    deskripsi text not null,
    urutan_tampil integer not null default 0,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now()
);

-- ==========================================
-- INDEX UNTUK URUTAN DAN RELASI
-- ==========================================

create index if not exists idx_tautan_navigasi_urutan
    on public.tautan_navigasi (urutan_tampil);

create index if not exists idx_berita_desa_urutan_tanggal
    on public.berita_desa (urutan_tampil, tanggal_terbit desc);

create index if not exists idx_statistik_desa_urutan
    on public.statistik_desa (urutan_tampil);

create index if not exists idx_kategori_dokumentasi_urutan
    on public.kategori_dokumentasi (urutan_tampil);

create index if not exists idx_posting_dokumentasi_kategori
    on public.posting_dokumentasi (kategori_id);

create index if not exists idx_posting_dokumentasi_urutan_tanggal
    on public.posting_dokumentasi (urutan_tampil, tanggal_terbit desc);

create index if not exists idx_foto_dokumentasi_posting_urutan
    on public.foto_dokumentasi (posting_id, urutan_tampil);

create index if not exists idx_video_dokumentasi_urutan
    on public.video_dokumentasi (urutan_tampil);

create index if not exists idx_statistik_profil_urutan
    on public.statistik_profil (urutan_tampil);

create index if not exists idx_aparatur_desa_urutan
    on public.aparatur_desa (urutan_tampil);

create index if not exists idx_batas_wilayah_desa_urutan
    on public.batas_wilayah_desa (urutan_tampil);

-- ==========================================
-- TRIGGER UPDATED_AT
-- ==========================================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_tautan_navigasi_updated_at on public.tautan_navigasi;
create trigger set_tautan_navigasi_updated_at
before update on public.tautan_navigasi
for each row execute function public.set_updated_at();

drop trigger if exists set_berita_desa_updated_at on public.berita_desa;
create trigger set_berita_desa_updated_at
before update on public.berita_desa
for each row execute function public.set_updated_at();

drop trigger if exists set_statistik_desa_updated_at on public.statistik_desa;
create trigger set_statistik_desa_updated_at
before update on public.statistik_desa
for each row execute function public.set_updated_at();

drop trigger if exists set_kategori_dokumentasi_updated_at on public.kategori_dokumentasi;
create trigger set_kategori_dokumentasi_updated_at
before update on public.kategori_dokumentasi
for each row execute function public.set_updated_at();

drop trigger if exists set_posting_dokumentasi_updated_at on public.posting_dokumentasi;
create trigger set_posting_dokumentasi_updated_at
before update on public.posting_dokumentasi
for each row execute function public.set_updated_at();

drop trigger if exists set_foto_dokumentasi_updated_at on public.foto_dokumentasi;
create trigger set_foto_dokumentasi_updated_at
before update on public.foto_dokumentasi
for each row execute function public.set_updated_at();

drop trigger if exists set_video_dokumentasi_updated_at on public.video_dokumentasi;
create trigger set_video_dokumentasi_updated_at
before update on public.video_dokumentasi
for each row execute function public.set_updated_at();

drop trigger if exists set_statistik_profil_updated_at on public.statistik_profil;
create trigger set_statistik_profil_updated_at
before update on public.statistik_profil
for each row execute function public.set_updated_at();

drop trigger if exists set_aparatur_desa_updated_at on public.aparatur_desa;
create trigger set_aparatur_desa_updated_at
before update on public.aparatur_desa
for each row execute function public.set_updated_at();

drop trigger if exists set_batas_wilayah_desa_updated_at on public.batas_wilayah_desa;
create trigger set_batas_wilayah_desa_updated_at
before update on public.batas_wilayah_desa
for each row execute function public.set_updated_at();

-- ==========================================
-- MENGAKTIFKAN ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table public.tautan_navigasi enable row level security;
alter table public.berita_desa enable row level security;
alter table public.statistik_desa enable row level security;
alter table public.kategori_dokumentasi enable row level security;
alter table public.posting_dokumentasi enable row level security;
alter table public.foto_dokumentasi enable row level security;
alter table public.video_dokumentasi enable row level security;
alter table public.statistik_profil enable row level security;
alter table public.aparatur_desa enable row level security;
alter table public.batas_wilayah_desa enable row level security;

-- ==========================================
-- POLICY: SEMUA ORANG BISA MEMBACA DATA
-- ==========================================

drop policy if exists "Allow public read-only access" on public.tautan_navigasi;
create policy "Allow public read-only access" on public.tautan_navigasi
for select to anon, authenticated using (true);

drop policy if exists "Allow public read-only access" on public.berita_desa;
create policy "Allow public read-only access" on public.berita_desa
for select to anon, authenticated using (true);

drop policy if exists "Allow public read-only access" on public.statistik_desa;
create policy "Allow public read-only access" on public.statistik_desa
for select to anon, authenticated using (true);

drop policy if exists "Allow public read-only access" on public.kategori_dokumentasi;
create policy "Allow public read-only access" on public.kategori_dokumentasi
for select to anon, authenticated using (true);

drop policy if exists "Allow public read-only access" on public.posting_dokumentasi;
create policy "Allow public read-only access" on public.posting_dokumentasi
for select to anon, authenticated using (true);

drop policy if exists "Allow public read-only access" on public.foto_dokumentasi;
create policy "Allow public read-only access" on public.foto_dokumentasi
for select to anon, authenticated using (true);

drop policy if exists "Allow public read-only access" on public.video_dokumentasi;
create policy "Allow public read-only access" on public.video_dokumentasi
for select to anon, authenticated using (true);

drop policy if exists "Allow public read-only access" on public.statistik_profil;
create policy "Allow public read-only access" on public.statistik_profil
for select to anon, authenticated using (true);

drop policy if exists "Allow public read-only access" on public.aparatur_desa;
create policy "Allow public read-only access" on public.aparatur_desa
for select to anon, authenticated using (true);

drop policy if exists "Allow public read-only access" on public.batas_wilayah_desa;
create policy "Allow public read-only access" on public.batas_wilayah_desa
for select to anon, authenticated using (true);

-- ==========================================
-- POLICY: ADMIN LOGIN SUPABASE AUTH BISA MENGUBAH DATA
-- ==========================================

drop policy if exists "Allow authenticated full access" on public.tautan_navigasi;
create policy "Allow authenticated full access" on public.tautan_navigasi
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated full access" on public.berita_desa;
create policy "Allow authenticated full access" on public.berita_desa
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated full access" on public.statistik_desa;
create policy "Allow authenticated full access" on public.statistik_desa
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated full access" on public.kategori_dokumentasi;
create policy "Allow authenticated full access" on public.kategori_dokumentasi
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated full access" on public.posting_dokumentasi;
create policy "Allow authenticated full access" on public.posting_dokumentasi
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated full access" on public.foto_dokumentasi;
create policy "Allow authenticated full access" on public.foto_dokumentasi
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated full access" on public.video_dokumentasi;
create policy "Allow authenticated full access" on public.video_dokumentasi
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated full access" on public.statistik_profil;
create policy "Allow authenticated full access" on public.statistik_profil
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated full access" on public.aparatur_desa;
create policy "Allow authenticated full access" on public.aparatur_desa
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

drop policy if exists "Allow authenticated full access" on public.batas_wilayah_desa;
create policy "Allow authenticated full access" on public.batas_wilayah_desa
for all to authenticated
using (auth.role() = 'authenticated')
with check (auth.role() = 'authenticated');

-- ==========================================
-- GRANT AKSES UNTUK SUPABASE API
-- ==========================================

grant usage on schema public to anon, authenticated;

grant select on
    public.tautan_navigasi,
    public.berita_desa,
    public.statistik_desa,
    public.kategori_dokumentasi,
    public.posting_dokumentasi,
    public.foto_dokumentasi,
    public.video_dokumentasi,
    public.statistik_profil,
    public.aparatur_desa,
    public.batas_wilayah_desa
to anon, authenticated;

grant insert, update, delete on
    public.tautan_navigasi,
    public.berita_desa,
    public.statistik_desa,
    public.kategori_dokumentasi,
    public.posting_dokumentasi,
    public.foto_dokumentasi,
    public.video_dokumentasi,
    public.statistik_profil,
    public.aparatur_desa,
    public.batas_wilayah_desa
to authenticated;

-- ==========================================
-- OPSIONAL: DATA AWAL SESUAI PROJECT
-- ==========================================

insert into public.tautan_navigasi (label, href, urutan_tampil)
values
    ('Beranda', '/', 1),
    ('Profil Padukuhan', '/profil-desa', 2),
    ('Kabar Padukuhan', '/kabar-padukuhan', 3),
    ('Dokumentasi Kegiatan', '/dokumentasi-kegiatan', 4)
on conflict (href) do update
set label = excluded.label,
    urutan_tampil = excluded.urutan_tampil;

do $$
begin
    if not exists (select 1 from public.berita_desa) then
        insert into public.berita_desa (kategori, judul, ringkasan, url_gambar, tanggal_terbit, urutan_tampil)
        values
            (
                'Berita',
                'Panen Raya Padi Organik Meningkat 20% Tahun Ini',
                'Pemerintah padukuhan bersama kelompok tani menyiapkan panen raya dengan sistem pengairan baru.',
                'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
                '2024-05-12',
                1
            ),
            (
                'Pengumuman',
                'Jadwal Pemeriksaan Kesehatan Gratis di Puskesmas Padukuhan',
                'Program kesehatan lansia, ibu hamil, dan balita dibuka kembali setiap hari Rabu pekan kedua.',
                'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
                '2024-05-08',
                2
            ),
            (
                'Pembangunan',
                'Rehabilitasi Jalan Dusun III Telah Selesai 100%',
                'Akses jalan utama diperlebar untuk mendukung mobilitas warga dan distribusi hasil pertanian.',
                'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
                '2024-05-03',
                3
            );
    end if;
end $$;

do $$
begin
    if not exists (select 1 from public.statistik_desa) then
        insert into public.statistik_desa (label, value, urutan_tampil)
        values
            ('Total Penduduk', '4.520', 1),
            ('Luas Wilayah', '125', 2),
            ('Kepala Keluarga', '1.280', 3),
            ('Sektor Pertanian', '85%', 4);
    end if;
end $$;

insert into public.kategori_dokumentasi (nama, urutan_tampil)
values
    ('Budaya', 1),
    ('Infrastruktur', 2),
    ('Sosial', 3)
on conflict (nama) do update
set urutan_tampil = excluded.urutan_tampil;

do $$
begin
    if not exists (select 1 from public.posting_dokumentasi) then
        insert into public.posting_dokumentasi (
            kategori_id,
            judul,
            ringkasan,
            url_gambar,
            tanggal_terbit,
            urutan_tampil
        )
        values
            (
                (select id from public.kategori_dokumentasi where nama = 'Sosial'),
                'Gotong Royong Kebersihan Lingkungan',
                'Kegiatan rutin bulanan warga Padukuhan Kayen dalam menjaga kebersihan drainase dan fasilitas umum untuk mencegah banjir dan wabah penyakit.',
                'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
                '2024-03-12',
                1
            ),
            (
                (select id from public.kategori_dokumentasi where nama = 'Budaya'),
                'Pesta Rakyat Kemerdekaan RI ke-78',
                'Perayaan meriah dengan berbagai lomba tradisional dan pementasan seni budaya dari seluruh dusun di padukuhan.',
                'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
                '2023-08-17',
                2
            ),
            (
                (select id from public.kategori_dokumentasi where nama = 'Infrastruktur'),
                'Pembangunan Irigasi Sawah Dusun III',
                'Peningkatan sistem pengairan sawah sepanjang 2 km untuk mendukung produktivitas petani padi lokal.',
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
                '2024-02-05',
                3
            ),
            (
                (select id from public.kategori_dokumentasi where nama = 'Sosial'),
                'Musyawarah Perencanaan Pembangunan',
                'Diskusi terbuka antara perangkat padukuhan dan tokoh masyarakat dalam menentukan arah pembangunan padukuhan tahun anggaran 2024.',
                'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
                '2024-01-20',
                4
            );
    end if;

    if not exists (select 1 from public.foto_dokumentasi) then
        insert into public.foto_dokumentasi (posting_id, url_foto, teks_alt, urutan_tampil)
        values
            (
                (select id from public.posting_dokumentasi where judul = 'Gotong Royong Kebersihan Lingkungan'),
                'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
                'Warga padukuhan bergotong royong di area terbuka',
                1
            ),
            (
                (select id from public.posting_dokumentasi where judul = 'Gotong Royong Kebersihan Lingkungan'),
                'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
                'Suasana musyawarah warga setelah kegiatan bersama',
                2
            ),
            (
                (select id from public.posting_dokumentasi where judul = 'Pesta Rakyat Kemerdekaan RI ke-78'),
                'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
                'Mikrofon panggung untuk acara budaya padukuhan',
                1
            ),
            (
                (select id from public.posting_dokumentasi where judul = 'Pesta Rakyat Kemerdekaan RI ke-78'),
                'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
                'Keramaian warga dalam festival padukuhan',
                2
            ),
            (
                (select id from public.posting_dokumentasi where judul = 'Pembangunan Irigasi Sawah Dusun III'),
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
                'Area persawahan dengan saluran irigasi baru',
                1
            ),
            (
                (select id from public.posting_dokumentasi where judul = 'Pembangunan Irigasi Sawah Dusun III'),
                'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
                'Jalur pembangunan infrastruktur padukuhan',
                2
            ),
            (
                (select id from public.posting_dokumentasi where judul = 'Musyawarah Perencanaan Pembangunan'),
                'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
                'Pertemuan warga dan perangkat padukuhan',
                1
            ),
            (
                (select id from public.posting_dokumentasi where judul = 'Musyawarah Perencanaan Pembangunan'),
                'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
                'Forum diskusi pembangunan di balai padukuhan',
                2
            );
    end if;
end $$;

do $$
begin
    if not exists (select 1 from public.video_dokumentasi) then
        insert into public.video_dokumentasi (judul, durasi, url_gambar, url_video, urutan_tampil)
        values
            (
                'Rangkuman Festival Padukuhan Kayen 2023',
                '05:42',
                'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
                '#',
                1
            ),
            (
                'Profil Padukuhan Kayen: Menuju Padukuhan Mandiri',
                '12:15',
                'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
                'https://youtu.be/eKLrQ2ztNhA?si=IwLO',
                2
            );
    end if;

    if not exists (select 1 from public.statistik_profil) then
        insert into public.statistik_profil (label, value, urutan_tampil)
        values
            ('Tahun Berdiri', '1924', 1),
            ('Jumlah Penduduk', '12K+', 2),
            ('Dusun Aktif', '7', 3);
    end if;

    if not exists (select 1 from public.aparatur_desa) then
        insert into public.aparatur_desa (nama, peran, urutan_tampil)
        values
            ('H. Ahmad Fauzi', 'Kepala Padukuhan', 1),
            ('Siti Aminah', 'Sekretaris Padukuhan', 2),
            ('Budi Santoso', 'Kaur Keuangan', 3),
            ('Irfan Hakim', 'Kaur Pembangunan', 4);
    end if;

    if not exists (select 1 from public.batas_wilayah_desa) then
        insert into public.batas_wilayah_desa (arah, deskripsi, urutan_tampil)
        values
            (
                'Batas Utara',
                'Berbatasan langsung dengan Hutan Lindung Gunung Hijau dan Padukuhan Makmur.',
                1
            ),
            (
                'Batas Selatan',
                'Dibatasi aliran Sungai Jernih yang menghubungkan padukuhan dengan kawasan kabupaten tetangga.',
                2
            ),
            (
                'Batas Timur & Barat',
                'Dikelilingi kawasan persawahan produktif yang berbatasan dengan Padukuhan Harapan dan Padukuhan Jaya.',
                3
            );
    end if;
end $$;
