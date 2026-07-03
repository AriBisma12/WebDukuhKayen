create extension if not exists pgcrypto;

create table if not exists public.tautan_navigasi (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null unique,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.berita_desa (
  id uuid primary key default gen_random_uuid(),
  kategori text not null,
  judul text not null,
  ringkasan text not null,
  url_gambar text,
  tanggal_terbit date,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.statistik_desa (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.kategori_dokumentasi (
  id uuid primary key default gen_random_uuid(),
  nama text not null unique,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.posting_dokumentasi (
  id uuid primary key default gen_random_uuid(),
  kategori_id uuid references public.kategori_dokumentasi(id) on delete set null,
  judul text not null,
  ringkasan text not null,
  url_gambar text,
  tanggal_terbit date,
  unggulan boolean not null default false,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.foto_dokumentasi (
  id uuid primary key default gen_random_uuid(),
  posting_id uuid not null references public.posting_dokumentasi(id) on delete cascade,
  url_foto text not null,
  teks_alt text,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.video_dokumentasi (
  id uuid primary key default gen_random_uuid(),
  judul text not null,
  durasi text,
  url_gambar text,
  url_video text,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.statistik_profil (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.aparatur_desa (
  id uuid primary key default gen_random_uuid(),
  nama text not null,
  peran text not null,
  url_foto text,
  bio text,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.batas_wilayah_desa (
  id uuid primary key default gen_random_uuid(),
  arah text not null,
  deskripsi text not null,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

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

drop policy if exists "Public read tautan_navigasi" on public.tautan_navigasi;
create policy "Public read tautan_navigasi"
on public.tautan_navigasi for select
to anon, authenticated
using (true);

drop policy if exists "Public read berita_desa" on public.berita_desa;
create policy "Public read berita_desa"
on public.berita_desa for select
to anon, authenticated
using (true);

drop policy if exists "Public read statistik_desa" on public.statistik_desa;
create policy "Public read statistik_desa"
on public.statistik_desa for select
to anon, authenticated
using (true);

drop policy if exists "Public read kategori_dokumentasi" on public.kategori_dokumentasi;
create policy "Public read kategori_dokumentasi"
on public.kategori_dokumentasi for select
to anon, authenticated
using (true);

drop policy if exists "Public read posting_dokumentasi" on public.posting_dokumentasi;
create policy "Public read posting_dokumentasi"
on public.posting_dokumentasi for select
to anon, authenticated
using (true);

drop policy if exists "Public read foto_dokumentasi" on public.foto_dokumentasi;
create policy "Public read foto_dokumentasi"
on public.foto_dokumentasi for select
to anon, authenticated
using (true);

drop policy if exists "Public read video_dokumentasi" on public.video_dokumentasi;
create policy "Public read video_dokumentasi"
on public.video_dokumentasi for select
to anon, authenticated
using (true);

drop policy if exists "Public read statistik_profil" on public.statistik_profil;
create policy "Public read statistik_profil"
on public.statistik_profil for select
to anon, authenticated
using (true);

drop policy if exists "Public read aparatur_desa" on public.aparatur_desa;
create policy "Public read aparatur_desa"
on public.aparatur_desa for select
to anon, authenticated
using (true);

drop policy if exists "Public read batas_wilayah_desa" on public.batas_wilayah_desa;
create policy "Public read batas_wilayah_desa"
on public.batas_wilayah_desa for select
to anon, authenticated
using (true);
