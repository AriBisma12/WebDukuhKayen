create extension if not exists pgcrypto;

create table if not exists public.navigation_links (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.featured_services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  icon text not null,
  href text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.village_news (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  title text not null,
  excerpt text not null,
  image_url text,
  published_at date,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.village_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documentation_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documentation_posts (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.documentation_categories(id) on delete set null,
  title text not null,
  excerpt text not null,
  image_url text,
  published_at date,
  is_featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.documentation_videos (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  duration text,
  image_url text,
  video_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_stats (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile_officials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  photo_url text,
  bio text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.village_boundaries (
  id uuid primary key default gen_random_uuid(),
  direction text not null,
  description text not null,
  sort_order integer not null default 0,
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

drop trigger if exists set_navigation_links_updated_at on public.navigation_links;
create trigger set_navigation_links_updated_at
before update on public.navigation_links
for each row execute function public.set_updated_at();

drop trigger if exists set_featured_services_updated_at on public.featured_services;
create trigger set_featured_services_updated_at
before update on public.featured_services
for each row execute function public.set_updated_at();

drop trigger if exists set_village_news_updated_at on public.village_news;
create trigger set_village_news_updated_at
before update on public.village_news
for each row execute function public.set_updated_at();

drop trigger if exists set_village_stats_updated_at on public.village_stats;
create trigger set_village_stats_updated_at
before update on public.village_stats
for each row execute function public.set_updated_at();

drop trigger if exists set_documentation_categories_updated_at on public.documentation_categories;
create trigger set_documentation_categories_updated_at
before update on public.documentation_categories
for each row execute function public.set_updated_at();

drop trigger if exists set_documentation_posts_updated_at on public.documentation_posts;
create trigger set_documentation_posts_updated_at
before update on public.documentation_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_documentation_videos_updated_at on public.documentation_videos;
create trigger set_documentation_videos_updated_at
before update on public.documentation_videos
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_stats_updated_at on public.profile_stats;
create trigger set_profile_stats_updated_at
before update on public.profile_stats
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_officials_updated_at on public.profile_officials;
create trigger set_profile_officials_updated_at
before update on public.profile_officials
for each row execute function public.set_updated_at();

drop trigger if exists set_village_boundaries_updated_at on public.village_boundaries;
create trigger set_village_boundaries_updated_at
before update on public.village_boundaries
for each row execute function public.set_updated_at();

alter table public.navigation_links enable row level security;
alter table public.featured_services enable row level security;
alter table public.village_news enable row level security;
alter table public.village_stats enable row level security;
alter table public.documentation_categories enable row level security;
alter table public.documentation_posts enable row level security;
alter table public.documentation_videos enable row level security;
alter table public.profile_stats enable row level security;
alter table public.profile_officials enable row level security;
alter table public.village_boundaries enable row level security;

drop policy if exists "Public read navigation_links" on public.navigation_links;
create policy "Public read navigation_links"
on public.navigation_links for select
to anon, authenticated
using (true);

drop policy if exists "Public read featured_services" on public.featured_services;
create policy "Public read featured_services"
on public.featured_services for select
to anon, authenticated
using (true);

drop policy if exists "Public read village_news" on public.village_news;
create policy "Public read village_news"
on public.village_news for select
to anon, authenticated
using (true);

drop policy if exists "Public read village_stats" on public.village_stats;
create policy "Public read village_stats"
on public.village_stats for select
to anon, authenticated
using (true);

drop policy if exists "Public read documentation_categories" on public.documentation_categories;
create policy "Public read documentation_categories"
on public.documentation_categories for select
to anon, authenticated
using (true);

drop policy if exists "Public read documentation_posts" on public.documentation_posts;
create policy "Public read documentation_posts"
on public.documentation_posts for select
to anon, authenticated
using (true);

drop policy if exists "Public read documentation_videos" on public.documentation_videos;
create policy "Public read documentation_videos"
on public.documentation_videos for select
to anon, authenticated
using (true);

drop policy if exists "Public read profile_stats" on public.profile_stats;
create policy "Public read profile_stats"
on public.profile_stats for select
to anon, authenticated
using (true);

drop policy if exists "Public read profile_officials" on public.profile_officials;
create policy "Public read profile_officials"
on public.profile_officials for select
to anon, authenticated
using (true);

drop policy if exists "Public read village_boundaries" on public.village_boundaries;
create policy "Public read village_boundaries"
on public.village_boundaries for select
to anon, authenticated
using (true);
