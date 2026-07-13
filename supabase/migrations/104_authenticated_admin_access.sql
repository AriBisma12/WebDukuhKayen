drop policy if exists "Admin insert tautan_navigasi" on public.tautan_navigasi;
create policy "Authenticated insert tautan_navigasi"
on public.tautan_navigasi
for insert
to authenticated
with check (true);

drop policy if exists "Admin update tautan_navigasi" on public.tautan_navigasi;
create policy "Authenticated update tautan_navigasi"
on public.tautan_navigasi
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete tautan_navigasi" on public.tautan_navigasi;
create policy "Authenticated delete tautan_navigasi"
on public.tautan_navigasi
for delete
to authenticated
using (true);

drop policy if exists "Admin insert berita_desa" on public.berita_desa;
create policy "Authenticated insert berita_desa"
on public.berita_desa
for insert
to authenticated
with check (true);

drop policy if exists "Admin update berita_desa" on public.berita_desa;
create policy "Authenticated update berita_desa"
on public.berita_desa
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete berita_desa" on public.berita_desa;
create policy "Authenticated delete berita_desa"
on public.berita_desa
for delete
to authenticated
using (true);

drop policy if exists "Admin insert statistik_desa" on public.statistik_desa;
create policy "Authenticated insert statistik_desa"
on public.statistik_desa
for insert
to authenticated
with check (true);

drop policy if exists "Admin update statistik_desa" on public.statistik_desa;
create policy "Authenticated update statistik_desa"
on public.statistik_desa
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete statistik_desa" on public.statistik_desa;
create policy "Authenticated delete statistik_desa"
on public.statistik_desa
for delete
to authenticated
using (true);

drop policy if exists "Admin insert kategori_dokumentasi" on public.kategori_dokumentasi;
create policy "Authenticated insert kategori_dokumentasi"
on public.kategori_dokumentasi
for insert
to authenticated
with check (true);

drop policy if exists "Admin update kategori_dokumentasi" on public.kategori_dokumentasi;
create policy "Authenticated update kategori_dokumentasi"
on public.kategori_dokumentasi
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete kategori_dokumentasi" on public.kategori_dokumentasi;
create policy "Authenticated delete kategori_dokumentasi"
on public.kategori_dokumentasi
for delete
to authenticated
using (true);

drop policy if exists "Admin insert posting_dokumentasi" on public.posting_dokumentasi;
create policy "Authenticated insert posting_dokumentasi"
on public.posting_dokumentasi
for insert
to authenticated
with check (true);

drop policy if exists "Admin update posting_dokumentasi" on public.posting_dokumentasi;
create policy "Authenticated update posting_dokumentasi"
on public.posting_dokumentasi
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete posting_dokumentasi" on public.posting_dokumentasi;
create policy "Authenticated delete posting_dokumentasi"
on public.posting_dokumentasi
for delete
to authenticated
using (true);

drop policy if exists "Admin insert foto_dokumentasi" on public.foto_dokumentasi;
create policy "Authenticated insert foto_dokumentasi"
on public.foto_dokumentasi
for insert
to authenticated
with check (true);

drop policy if exists "Admin update foto_dokumentasi" on public.foto_dokumentasi;
create policy "Authenticated update foto_dokumentasi"
on public.foto_dokumentasi
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete foto_dokumentasi" on public.foto_dokumentasi;
create policy "Authenticated delete foto_dokumentasi"
on public.foto_dokumentasi
for delete
to authenticated
using (true);

drop policy if exists "Admin insert video_dokumentasi" on public.video_dokumentasi;
create policy "Authenticated insert video_dokumentasi"
on public.video_dokumentasi
for insert
to authenticated
with check (true);

drop policy if exists "Admin update video_dokumentasi" on public.video_dokumentasi;
create policy "Authenticated update video_dokumentasi"
on public.video_dokumentasi
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete video_dokumentasi" on public.video_dokumentasi;
create policy "Authenticated delete video_dokumentasi"
on public.video_dokumentasi
for delete
to authenticated
using (true);

drop policy if exists "Admin insert statistik_profil" on public.statistik_profil;
create policy "Authenticated insert statistik_profil"
on public.statistik_profil
for insert
to authenticated
with check (true);

drop policy if exists "Admin update statistik_profil" on public.statistik_profil;
create policy "Authenticated update statistik_profil"
on public.statistik_profil
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete statistik_profil" on public.statistik_profil;
create policy "Authenticated delete statistik_profil"
on public.statistik_profil
for delete
to authenticated
using (true);

drop policy if exists "Admin insert aparatur_desa" on public.aparatur_desa;
create policy "Authenticated insert aparatur_desa"
on public.aparatur_desa
for insert
to authenticated
with check (true);

drop policy if exists "Admin update aparatur_desa" on public.aparatur_desa;
create policy "Authenticated update aparatur_desa"
on public.aparatur_desa
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete aparatur_desa" on public.aparatur_desa;
create policy "Authenticated delete aparatur_desa"
on public.aparatur_desa
for delete
to authenticated
using (true);

drop policy if exists "Admin insert batas_wilayah_desa" on public.batas_wilayah_desa;
create policy "Authenticated insert batas_wilayah_desa"
on public.batas_wilayah_desa
for insert
to authenticated
with check (true);

drop policy if exists "Admin update batas_wilayah_desa" on public.batas_wilayah_desa;
create policy "Authenticated update batas_wilayah_desa"
on public.batas_wilayah_desa
for update
to authenticated
using (true)
with check (true);

drop policy if exists "Admin delete batas_wilayah_desa" on public.batas_wilayah_desa;
create policy "Authenticated delete batas_wilayah_desa"
on public.batas_wilayah_desa
for delete
to authenticated
using (true);
