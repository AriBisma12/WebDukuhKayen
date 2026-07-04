begin;

insert into public.admin_users (
  username,
  display_name,
  password_hash,
  is_active
)
values (
  'admin',
  'Administrator Portal',
  public.hash_admin_password('admin12345'),
  true
)
on conflict (username) do update
set
  display_name = excluded.display_name,
  password_hash = excluded.password_hash,
  is_active = excluded.is_active,
  updated_at = now();

commit;
