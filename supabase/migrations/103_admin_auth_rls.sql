alter table public.admin_users
add column if not exists email text;

alter table public.admin_users
add column if not exists auth_user_id uuid unique;

create unique index if not exists idx_admin_users_email_lower
on public.admin_users (lower(email))
where email is not null;

create or replace function public.is_current_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users as admin_user
    where admin_user.auth_user_id = auth.uid()
      and admin_user.is_active = true
  );
$$;

create or replace function public.claim_admin_access()
returns table (
  id uuid,
  username text,
  email text,
  display_name text,
  is_active boolean,
  auth_user_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  jwt_email text := lower(coalesce(auth.jwt() ->> 'email', ''));
  current_uid uuid := auth.uid();
begin
  if current_uid is null or jwt_email = '' then
    return;
  end if;

  update public.admin_users as admin_user
  set auth_user_id = current_uid,
      updated_at = now()
  where admin_user.auth_user_id is null
    and admin_user.is_active = true
    and lower(admin_user.email) = jwt_email;

  return query
  select
    admin_user.id,
    admin_user.username,
    admin_user.email,
    admin_user.display_name,
    admin_user.is_active,
    admin_user.auth_user_id
  from public.admin_users as admin_user
  where admin_user.auth_user_id = current_uid
    and admin_user.is_active = true
  limit 1;
end;
$$;

revoke all on function public.is_current_admin() from public;
revoke all on function public.claim_admin_access() from public;
grant execute on function public.is_current_admin() to authenticated;
grant execute on function public.claim_admin_access() to authenticated;

drop policy if exists "Admin read admin_users" on public.admin_users;
create policy "Admin read admin_users"
on public.admin_users
for select
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin update admin_users" on public.admin_users;
create policy "Admin update admin_users"
on public.admin_users
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin insert tautan_navigasi" on public.tautan_navigasi;
create policy "Admin insert tautan_navigasi"
on public.tautan_navigasi
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update tautan_navigasi" on public.tautan_navigasi;
create policy "Admin update tautan_navigasi"
on public.tautan_navigasi
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete tautan_navigasi" on public.tautan_navigasi;
create policy "Admin delete tautan_navigasi"
on public.tautan_navigasi
for delete
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin insert berita_desa" on public.berita_desa;
create policy "Admin insert berita_desa"
on public.berita_desa
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update berita_desa" on public.berita_desa;
create policy "Admin update berita_desa"
on public.berita_desa
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete berita_desa" on public.berita_desa;
create policy "Admin delete berita_desa"
on public.berita_desa
for delete
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin insert statistik_desa" on public.statistik_desa;
create policy "Admin insert statistik_desa"
on public.statistik_desa
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update statistik_desa" on public.statistik_desa;
create policy "Admin update statistik_desa"
on public.statistik_desa
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete statistik_desa" on public.statistik_desa;
create policy "Admin delete statistik_desa"
on public.statistik_desa
for delete
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin insert kategori_dokumentasi" on public.kategori_dokumentasi;
create policy "Admin insert kategori_dokumentasi"
on public.kategori_dokumentasi
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update kategori_dokumentasi" on public.kategori_dokumentasi;
create policy "Admin update kategori_dokumentasi"
on public.kategori_dokumentasi
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete kategori_dokumentasi" on public.kategori_dokumentasi;
create policy "Admin delete kategori_dokumentasi"
on public.kategori_dokumentasi
for delete
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin insert posting_dokumentasi" on public.posting_dokumentasi;
create policy "Admin insert posting_dokumentasi"
on public.posting_dokumentasi
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update posting_dokumentasi" on public.posting_dokumentasi;
create policy "Admin update posting_dokumentasi"
on public.posting_dokumentasi
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete posting_dokumentasi" on public.posting_dokumentasi;
create policy "Admin delete posting_dokumentasi"
on public.posting_dokumentasi
for delete
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin insert foto_dokumentasi" on public.foto_dokumentasi;
create policy "Admin insert foto_dokumentasi"
on public.foto_dokumentasi
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update foto_dokumentasi" on public.foto_dokumentasi;
create policy "Admin update foto_dokumentasi"
on public.foto_dokumentasi
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete foto_dokumentasi" on public.foto_dokumentasi;
create policy "Admin delete foto_dokumentasi"
on public.foto_dokumentasi
for delete
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin insert video_dokumentasi" on public.video_dokumentasi;
create policy "Admin insert video_dokumentasi"
on public.video_dokumentasi
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update video_dokumentasi" on public.video_dokumentasi;
create policy "Admin update video_dokumentasi"
on public.video_dokumentasi
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete video_dokumentasi" on public.video_dokumentasi;
create policy "Admin delete video_dokumentasi"
on public.video_dokumentasi
for delete
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin insert statistik_profil" on public.statistik_profil;
create policy "Admin insert statistik_profil"
on public.statistik_profil
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update statistik_profil" on public.statistik_profil;
create policy "Admin update statistik_profil"
on public.statistik_profil
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete statistik_profil" on public.statistik_profil;
create policy "Admin delete statistik_profil"
on public.statistik_profil
for delete
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin insert aparatur_desa" on public.aparatur_desa;
create policy "Admin insert aparatur_desa"
on public.aparatur_desa
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update aparatur_desa" on public.aparatur_desa;
create policy "Admin update aparatur_desa"
on public.aparatur_desa
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete aparatur_desa" on public.aparatur_desa;
create policy "Admin delete aparatur_desa"
on public.aparatur_desa
for delete
to authenticated
using ((select public.is_current_admin()));

drop policy if exists "Admin insert batas_wilayah_desa" on public.batas_wilayah_desa;
create policy "Admin insert batas_wilayah_desa"
on public.batas_wilayah_desa
for insert
to authenticated
with check ((select public.is_current_admin()));

drop policy if exists "Admin update batas_wilayah_desa" on public.batas_wilayah_desa;
create policy "Admin update batas_wilayah_desa"
on public.batas_wilayah_desa
for update
to authenticated
using ((select public.is_current_admin()))
with check ((select public.is_current_admin()));

drop policy if exists "Admin delete batas_wilayah_desa" on public.batas_wilayah_desa;
create policy "Admin delete batas_wilayah_desa"
on public.batas_wilayah_desa
for delete
to authenticated
using ((select public.is_current_admin()));
