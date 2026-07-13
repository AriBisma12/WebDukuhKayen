# Drop Table Scripts

Folder ini berisi script SQL destruktif untuk menghapus tabel database `public`
yang dipakai website Portal Padukuhan Kayen.

Gunakan hanya kalau database ingin dikosongkan/reset sebelum menjalankan ulang:

1. `database/drop-table/drop-public-project-tables.sql`
2. `supabase/schema.sql`
3. `supabase/seed.sql` jika ingin mengisi data awal contoh

Script ini tidak menghapus user Supabase Auth di schema `auth`.
