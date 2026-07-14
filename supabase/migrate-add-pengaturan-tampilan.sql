create table if not exists public.pengaturan_tampilan (
  id uuid primary key default gen_random_uuid(),
  setting_key text not null unique,
  label text not null,
  content jsonb not null default '{}'::jsonb,
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

drop trigger if exists set_pengaturan_tampilan_updated_at on public.pengaturan_tampilan;
create trigger set_pengaturan_tampilan_updated_at
before update on public.pengaturan_tampilan
for each row execute function public.set_updated_at();

alter table public.pengaturan_tampilan enable row level security;

drop policy if exists "Public read pengaturan_tampilan" on public.pengaturan_tampilan;
create policy "Public read pengaturan_tampilan"
on public.pengaturan_tampilan for select
to anon, authenticated
using (true);

drop policy if exists "Authenticated manage pengaturan_tampilan" on public.pengaturan_tampilan;
create policy "Authenticated manage pengaturan_tampilan"
on public.pengaturan_tampilan for all
to authenticated
using (true)
with check (true);

insert into public.pengaturan_tampilan (setting_key, label, content)
values
  (
    'home_hero',
    'Beranda Hero',
    '{
      "background_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
    }'::jsonb
  ),
  (
    'home_vision',
    'Beranda Visi Misi',
    '{
      "image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"
    }'::jsonb
  ),
  (
    'footer_contact',
    'Footer Kontak',
    '{
      "address": "Jl. Raya Utama No. 01, Padukuhan Kayen, 12435",
      "email": "kontak@padukuhankayen.go.id",
      "phone": "0813-5385-7853",
      "phone_label": "Chat WhatsApp"
    }'::jsonb
  ),
  (
    'profil_intro',
    'Profil Hero dan Sejarah',
    '{
      "hero_background_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80",
      "history_image_url": "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"
    }'::jsonb
  ),
  (
    'profil_region',
    'Profil Wilayah',
    '{
      "image_url": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
    }'::jsonb
  ),
  (
    'dokumentasi_hero',
    'Dokumentasi Hero',
    '{
      "background_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
    }'::jsonb
  ),
  (
    'kabar_hero',
    'Kabar Hero',
    '{
      "background_url": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
    }'::jsonb
  )
on conflict (setting_key) do update
set
  label = excluded.label,
  content = excluded.content;
