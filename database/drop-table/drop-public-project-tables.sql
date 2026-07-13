-- ============================================================
-- DROP TABLE database publik Portal Padukuhan Kayen
-- PERINGATAN: script ini menghapus data tabel public secara permanen.
-- Jalankan hanya jika ingin reset database sebelum setup ulang schema.
--
-- Tidak menghapus user Supabase Auth karena auth berada di schema `auth`.
-- Setelah menjalankan ini, lanjutkan dengan:
-- 1. supabase/schema.sql
-- 2. supabase/seed.sql (opsional)
-- ============================================================

begin;

-- Tabel aktif proyek React + Supabase.
drop table if exists public.foto_dokumentasi cascade;
drop table if exists public.posting_dokumentasi cascade;
drop table if exists public.kategori_dokumentasi cascade;
drop table if exists public.video_dokumentasi cascade;
drop table if exists public.berita_desa cascade;
drop table if exists public.statistik_desa cascade;
drop table if exists public.statistik_profil cascade;
drop table if exists public.aparatur_desa cascade;
drop table if exists public.batas_wilayah_desa cascade;
drop table if exists public.tautan_navigasi cascade;

-- Tabel admin lama jika pernah dibuat dari versi sebelumnya.
drop table if exists public.admin_users cascade;

-- Tabel legacy berbahasa Inggris dari schema lama.
drop table if exists public.navigation_links cascade;
drop table if exists public.village_news cascade;
drop table if exists public.village_stats cascade;
drop table if exists public.documentation_categories cascade;
drop table if exists public.documentation_posts cascade;
drop table if exists public.documentation_videos cascade;
drop table if exists public.profile_stats cascade;
drop table if exists public.profile_officials cascade;
drop table if exists public.village_boundaries cascade;
drop table if exists public.featured_services cascade;

-- Tabel contoh dari script SQL lama yang pernah kamu lampirkan.
drop table if exists public.profiles cascade;
drop table if exists public.stats cascade;
drop table if exists public.potentials cascade;
drop table if exists public.programs cascade;
drop table if exists public.news cascade;
drop table if exists public.galleries cascade;
drop table if exists public.contacts cascade;
drop table if exists public.demographics cascade;
drop table if exists public.infrastructure cascade;
drop table if exists public.facilities cascade;
drop table if exists public.occupations cascade;
drop table if exists public.government_structure cascade;

-- Function helper public yang dibuat schema proyek.
drop function if exists public.set_updated_at() cascade;
drop function if exists public.is_current_admin() cascade;
drop function if exists public.claim_admin_access() cascade;

commit;
