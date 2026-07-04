begin;

create extension if not exists pgcrypto;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'navigation_links'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'tautan_navigasi'
  ) then
    alter table public.navigation_links rename to tautan_navigasi;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'featured_services'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'layanan_unggulan'
  ) then
    alter table public.featured_services rename to layanan_unggulan;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'village_news'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'berita_desa'
  ) then
    alter table public.village_news rename to berita_desa;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'village_stats'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'statistik_desa'
  ) then
    alter table public.village_stats rename to statistik_desa;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'documentation_categories'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'kategori_dokumentasi'
  ) then
    alter table public.documentation_categories rename to kategori_dokumentasi;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'documentation_posts'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'posting_dokumentasi'
  ) then
    alter table public.documentation_posts rename to posting_dokumentasi;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'documentation_videos'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'video_dokumentasi'
  ) then
    alter table public.documentation_videos rename to video_dokumentasi;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'profile_stats'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'statistik_profil'
  ) then
    alter table public.profile_stats rename to statistik_profil;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'profile_officials'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'aparatur_desa'
  ) then
    alter table public.profile_officials rename to aparatur_desa;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'village_boundaries'
  ) and not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'batas_wilayah_desa'
  ) then
    alter table public.village_boundaries rename to batas_wilayah_desa;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'tautan_navigasi' and column_name = 'sort_order'
  ) then
    alter table public.tautan_navigasi rename column sort_order to urutan_tampil;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'berita_desa' and column_name = 'category'
  ) then
    alter table public.berita_desa rename column category to kategori;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'berita_desa' and column_name = 'title'
  ) then
    alter table public.berita_desa rename column title to judul;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'berita_desa' and column_name = 'excerpt'
  ) then
    alter table public.berita_desa rename column excerpt to ringkasan;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'berita_desa' and column_name = 'image_url'
  ) then
    alter table public.berita_desa rename column image_url to url_gambar;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'berita_desa' and column_name = 'published_at'
  ) then
    alter table public.berita_desa rename column published_at to tanggal_terbit;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'berita_desa' and column_name = 'sort_order'
  ) then
    alter table public.berita_desa rename column sort_order to urutan_tampil;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'statistik_desa' and column_name = 'sort_order'
  ) then
    alter table public.statistik_desa rename column sort_order to urutan_tampil;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'kategori_dokumentasi' and column_name = 'name'
  ) then
    alter table public.kategori_dokumentasi rename column name to nama;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'kategori_dokumentasi' and column_name = 'sort_order'
  ) then
    alter table public.kategori_dokumentasi rename column sort_order to urutan_tampil;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posting_dokumentasi' and column_name = 'category_id'
  ) then
    alter table public.posting_dokumentasi rename column category_id to kategori_id;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posting_dokumentasi' and column_name = 'title'
  ) then
    alter table public.posting_dokumentasi rename column title to judul;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posting_dokumentasi' and column_name = 'excerpt'
  ) then
    alter table public.posting_dokumentasi rename column excerpt to ringkasan;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posting_dokumentasi' and column_name = 'image_url'
  ) then
    alter table public.posting_dokumentasi rename column image_url to url_gambar;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posting_dokumentasi' and column_name = 'published_at'
  ) then
    alter table public.posting_dokumentasi rename column published_at to tanggal_terbit;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posting_dokumentasi' and column_name = 'sort_order'
  ) then
    alter table public.posting_dokumentasi rename column sort_order to urutan_tampil;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posting_dokumentasi' and column_name = 'unggulan'
  ) then
    alter table public.posting_dokumentasi drop column unggulan;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'posting_dokumentasi' and column_name = 'is_featured'
  ) then
    alter table public.posting_dokumentasi drop column is_featured;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'video_dokumentasi' and column_name = 'title'
  ) then
    alter table public.video_dokumentasi rename column title to judul;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'video_dokumentasi' and column_name = 'duration'
  ) then
    alter table public.video_dokumentasi rename column duration to durasi;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'video_dokumentasi' and column_name = 'image_url'
  ) then
    alter table public.video_dokumentasi rename column image_url to url_gambar;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'video_dokumentasi' and column_name = 'video_url'
  ) then
    alter table public.video_dokumentasi rename column video_url to url_video;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'video_dokumentasi' and column_name = 'sort_order'
  ) then
    alter table public.video_dokumentasi rename column sort_order to urutan_tampil;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'statistik_profil' and column_name = 'sort_order'
  ) then
    alter table public.statistik_profil rename column sort_order to urutan_tampil;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'aparatur_desa' and column_name = 'name'
  ) then
    alter table public.aparatur_desa rename column name to nama;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'aparatur_desa' and column_name = 'role'
  ) then
    alter table public.aparatur_desa rename column role to peran;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'aparatur_desa' and column_name = 'photo_url'
  ) then
    alter table public.aparatur_desa rename column photo_url to url_foto;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'aparatur_desa' and column_name = 'sort_order'
  ) then
    alter table public.aparatur_desa rename column sort_order to urutan_tampil;
  end if;
end
$$;

do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'batas_wilayah_desa' and column_name = 'direction'
  ) then
    alter table public.batas_wilayah_desa rename column direction to arah;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'batas_wilayah_desa' and column_name = 'description'
  ) then
    alter table public.batas_wilayah_desa rename column description to deskripsi;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'batas_wilayah_desa' and column_name = 'sort_order'
  ) then
    alter table public.batas_wilayah_desa rename column sort_order to urutan_tampil;
  end if;
end
$$;

create table if not exists public.foto_dokumentasi (
  id uuid primary key default gen_random_uuid(),
  posting_id uuid not null references public.posting_dokumentasi(id) on delete cascade,
  url_foto text not null,
  teks_alt text,
  urutan_tampil integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.foto_dokumentasi (posting_id, url_foto, teks_alt, urutan_tampil)
select
  p.id,
  p.url_gambar,
  p.judul,
  1
from public.posting_dokumentasi p
where p.url_gambar is not null
  and not exists (
    select 1
    from public.foto_dokumentasi f
    where f.posting_id = p.id
  );

insert into public.tautan_navigasi (label, href, urutan_tampil)
select 'Kabar Padukuhan', '/kabar-padukuhan', 3
where not exists (
  select 1
  from public.tautan_navigasi
  where href = '/kabar-padukuhan'
);

update public.tautan_navigasi
set urutan_tampil = 4
where href = '/dokumentasi-kegiatan'
  and urutan_tampil = 3;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_navigation_links_updated_at on public.tautan_navigasi;
drop trigger if exists set_tautan_navigasi_updated_at on public.tautan_navigasi;
create trigger set_tautan_navigasi_updated_at
before update on public.tautan_navigasi
for each row execute function public.set_updated_at();

drop trigger if exists set_village_news_updated_at on public.berita_desa;
drop trigger if exists set_berita_desa_updated_at on public.berita_desa;
create trigger set_berita_desa_updated_at
before update on public.berita_desa
for each row execute function public.set_updated_at();

drop trigger if exists set_village_stats_updated_at on public.statistik_desa;
drop trigger if exists set_statistik_desa_updated_at on public.statistik_desa;
create trigger set_statistik_desa_updated_at
before update on public.statistik_desa
for each row execute function public.set_updated_at();

drop trigger if exists set_documentation_categories_updated_at on public.kategori_dokumentasi;
drop trigger if exists set_kategori_dokumentasi_updated_at on public.kategori_dokumentasi;
create trigger set_kategori_dokumentasi_updated_at
before update on public.kategori_dokumentasi
for each row execute function public.set_updated_at();

drop trigger if exists set_documentation_posts_updated_at on public.posting_dokumentasi;
drop trigger if exists set_posting_dokumentasi_updated_at on public.posting_dokumentasi;
create trigger set_posting_dokumentasi_updated_at
before update on public.posting_dokumentasi
for each row execute function public.set_updated_at();

drop trigger if exists set_foto_dokumentasi_updated_at on public.foto_dokumentasi;
create trigger set_foto_dokumentasi_updated_at
before update on public.foto_dokumentasi
for each row execute function public.set_updated_at();

drop trigger if exists set_documentation_videos_updated_at on public.video_dokumentasi;
drop trigger if exists set_video_dokumentasi_updated_at on public.video_dokumentasi;
create trigger set_video_dokumentasi_updated_at
before update on public.video_dokumentasi
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_stats_updated_at on public.statistik_profil;
drop trigger if exists set_statistik_profil_updated_at on public.statistik_profil;
create trigger set_statistik_profil_updated_at
before update on public.statistik_profil
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_officials_updated_at on public.aparatur_desa;
drop trigger if exists set_aparatur_desa_updated_at on public.aparatur_desa;
create trigger set_aparatur_desa_updated_at
before update on public.aparatur_desa
for each row execute function public.set_updated_at();

drop trigger if exists set_village_boundaries_updated_at on public.batas_wilayah_desa;
drop trigger if exists set_batas_wilayah_desa_updated_at on public.batas_wilayah_desa;
create trigger set_batas_wilayah_desa_updated_at
before update on public.batas_wilayah_desa
for each row execute function public.set_updated_at();

alter table if exists public.tautan_navigasi enable row level security;
alter table if exists public.berita_desa enable row level security;
alter table if exists public.statistik_desa enable row level security;
alter table if exists public.kategori_dokumentasi enable row level security;
alter table if exists public.posting_dokumentasi enable row level security;
alter table if exists public.foto_dokumentasi enable row level security;
alter table if exists public.video_dokumentasi enable row level security;
alter table if exists public.statistik_profil enable row level security;
alter table if exists public.aparatur_desa enable row level security;
alter table if exists public.batas_wilayah_desa enable row level security;

drop policy if exists "Public read navigation_links" on public.tautan_navigasi;
drop policy if exists "Public read tautan_navigasi" on public.tautan_navigasi;
create policy "Public read tautan_navigasi"
on public.tautan_navigasi for select
to anon, authenticated
using (true);

drop policy if exists "Public read village_news" on public.berita_desa;
drop policy if exists "Public read berita_desa" on public.berita_desa;
create policy "Public read berita_desa"
on public.berita_desa for select
to anon, authenticated
using (true);

drop policy if exists "Public read village_stats" on public.statistik_desa;
drop policy if exists "Public read statistik_desa" on public.statistik_desa;
create policy "Public read statistik_desa"
on public.statistik_desa for select
to anon, authenticated
using (true);

drop policy if exists "Public read documentation_categories" on public.kategori_dokumentasi;
drop policy if exists "Public read kategori_dokumentasi" on public.kategori_dokumentasi;
create policy "Public read kategori_dokumentasi"
on public.kategori_dokumentasi for select
to anon, authenticated
using (true);

drop policy if exists "Public read documentation_posts" on public.posting_dokumentasi;
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

drop policy if exists "Public read documentation_videos" on public.video_dokumentasi;
drop policy if exists "Public read video_dokumentasi" on public.video_dokumentasi;
create policy "Public read video_dokumentasi"
on public.video_dokumentasi for select
to anon, authenticated
using (true);

drop policy if exists "Public read profile_stats" on public.statistik_profil;
drop policy if exists "Public read statistik_profil" on public.statistik_profil;
create policy "Public read statistik_profil"
on public.statistik_profil for select
to anon, authenticated
using (true);

drop policy if exists "Public read profile_officials" on public.aparatur_desa;
drop policy if exists "Public read aparatur_desa" on public.aparatur_desa;
create policy "Public read aparatur_desa"
on public.aparatur_desa for select
to anon, authenticated
using (true);

drop policy if exists "Public read village_boundaries" on public.batas_wilayah_desa;
drop policy if exists "Public read batas_wilayah_desa" on public.batas_wilayah_desa;
create policy "Public read batas_wilayah_desa"
on public.batas_wilayah_desa for select
to anon, authenticated
using (true);

commit;
