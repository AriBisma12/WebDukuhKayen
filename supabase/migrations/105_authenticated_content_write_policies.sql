do $$
declare
  table_name text;
  table_names text[] := array[
    'tautan_navigasi',
    'berita_desa',
    'statistik_desa',
    'kategori_dokumentasi',
    'posting_dokumentasi',
    'foto_dokumentasi',
    'video_dokumentasi',
    'statistik_profil',
    'aparatur_desa',
    'batas_wilayah_desa'
  ];
begin
  foreach table_name in array table_names loop
    execute format('alter table public.%I enable row level security', table_name);

    execute format(
      'drop policy if exists %I on public.%I',
      'Authenticated content write ' || table_name,
      table_name
    );

    execute format(
      'create policy %I on public.%I as permissive for all to authenticated using (auth.uid() is not null) with check (auth.uid() is not null)',
      'Authenticated content write ' || table_name,
      table_name
    );
  end loop;
end $$;
