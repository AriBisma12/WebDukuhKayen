create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  display_name text not null,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_sessions (
  id uuid primary key default gen_random_uuid(),
  admin_user_id uuid not null references public.admin_users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  last_used_at timestamptz not null default now()
);

create index if not exists idx_admin_users_username_lower
on public.admin_users (lower(username));

create index if not exists idx_admin_sessions_expires_at
on public.admin_sessions (expires_at);

create index if not exists idx_admin_sessions_admin_user_id
on public.admin_sessions (admin_user_id);

drop trigger if exists set_admin_users_updated_at on public.admin_users;
create trigger set_admin_users_updated_at
before update on public.admin_users
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.admin_sessions enable row level security;

create or replace function public.hash_admin_password(raw_password text)
returns text
language sql
security definer
set search_path = public, extensions
as $$
  select crypt(raw_password, gen_salt('bf'));
$$;

create or replace function public.verify_admin_credentials(
  login_username text,
  login_password text
)
returns table (
  id uuid,
  username text,
  display_name text,
  is_active boolean
)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  select
    admin.id,
    admin.username,
    admin.display_name,
    admin.is_active
  from public.admin_users as admin
  where lower(admin.username) = lower(login_username)
    and admin.is_active = true
    and admin.password_hash = crypt(login_password, admin.password_hash)
  limit 1;
end;
$$;

revoke all on function public.hash_admin_password(text) from public;
revoke all on function public.verify_admin_credentials(text, text) from public;
grant execute on function public.hash_admin_password(text) to service_role;
grant execute on function public.verify_admin_credentials(text, text) to service_role;
