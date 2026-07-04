begin;

delete from public.foto_dokumentasi;
delete from public.posting_dokumentasi;
delete from public.kategori_dokumentasi;
delete from public.video_dokumentasi;
delete from public.berita_desa;
delete from public.tautan_navigasi;
delete from public.statistik_desa;
delete from public.statistik_profil;
delete from public.aparatur_desa;
delete from public.batas_wilayah_desa;

insert into public.tautan_navigasi (label, href, urutan_tampil)
values
  ('Beranda', '/', 1),
  ('Profil Padukuhan', '/profil-desa', 2),
  ('Kabar Padukuhan', '/kabar-padukuhan', 3),
  ('Dokumentasi Kegiatan', '/dokumentasi-kegiatan', 4);

insert into public.berita_desa (kategori, judul, ringkasan, url_gambar, tanggal_terbit, urutan_tampil)
values
  (
    'Berita',
    'Panen Raya Padi Organik Meningkat 20% Tahun Ini',
    'Pemerintah padukuhan bersama kelompok tani menyiapkan panen raya dengan sistem pengairan baru.',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    '2024-05-12',
    1
  ),
  (
    'Pengumuman',
    'Jadwal Pemeriksaan Kesehatan Gratis di Puskesmas Padukuhan',
    'Program kesehatan lansia, ibu hamil, dan balita dibuka kembali setiap hari Rabu pekan kedua.',
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80',
    '2024-05-08',
    2
  ),
  (
    'Pembangunan',
    'Rehabilitasi Jalan Dusun III Telah Selesai 100%',
    'Akses jalan utama diperlebar untuk mendukung mobilitas warga dan distribusi hasil pertanian.',
    'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
    '2024-05-03',
    3
  );

insert into public.statistik_desa (label, value, urutan_tampil)
values
  ('Total Penduduk', '4.520', 1),
  ('Luas Wilayah', '125', 2),
  ('Kepala Keluarga', '1.280', 3),
  ('Sektor Pertanian', '85%', 4);

insert into public.kategori_dokumentasi (nama, urutan_tampil)
values
  ('Budaya', 1),
  ('Infrastruktur', 2),
  ('Sosial', 3);

insert into public.posting_dokumentasi (
  kategori_id,
  judul,
  ringkasan,
  url_gambar,
  tanggal_terbit,
  urutan_tampil
)
values
  (
    (select id from public.kategori_dokumentasi where nama = 'Sosial'),
    'Gotong Royong Kebersihan Lingkungan',
    'Kegiatan rutin bulanan warga Padukuhan Sejahtera dalam menjaga kebersihan drainase dan fasilitas umum untuk mencegah banjir dan wabah penyakit.',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    '2024-03-12',
    1
  ),
  (
    (select id from public.kategori_dokumentasi where nama = 'Budaya'),
    'Pesta Rakyat Kemerdekaan RI ke-78',
    'Perayaan meriah dengan berbagai lomba tradisional dan pementasan seni budaya dari seluruh dusun di padukuhan.',
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    '2023-08-17',
    2
  ),
  (
    (select id from public.kategori_dokumentasi where nama = 'Infrastruktur'),
    'Pembangunan Irigasi Sawah Dusun III',
    'Peningkatan sistem pengairan sawah sepanjang 2 km untuk mendukung produktivitas petani padi lokal.',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    '2024-02-05',
    3
  ),
  (
    (select id from public.kategori_dokumentasi where nama = 'Sosial'),
    'Musyawarah Perencanaan Pembangunan',
    'Diskusi terbuka antara perangkat padukuhan dan tokoh masyarakat dalam menentukan arah pembangunan padukuhan tahun anggaran 2024.',
    'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
    '2024-01-20',
    4
  );

insert into public.foto_dokumentasi (posting_id, url_foto, teks_alt, urutan_tampil)
values
  (
    (select id from public.posting_dokumentasi where judul = 'Gotong Royong Kebersihan Lingkungan'),
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
    'Warga padukuhan bergotong royong di area terbuka',
    1
  ),
  (
    (select id from public.posting_dokumentasi where judul = 'Gotong Royong Kebersihan Lingkungan'),
    'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
    'Suasana musyawarah warga setelah kegiatan bersama',
    2
  ),
  (
    (select id from public.posting_dokumentasi where judul = 'Pesta Rakyat Kemerdekaan RI ke-78'),
    'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
    'Mikrofon panggung untuk acara budaya padukuhan',
    1
  ),
  (
    (select id from public.posting_dokumentasi where judul = 'Pesta Rakyat Kemerdekaan RI ke-78'),
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    'Keramaian warga dalam festival padukuhan',
    2
  ),
  (
    (select id from public.posting_dokumentasi where judul = 'Pembangunan Irigasi Sawah Dusun III'),
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'Area persawahan dengan saluran irigasi baru',
    1
  ),
  (
    (select id from public.posting_dokumentasi where judul = 'Pembangunan Irigasi Sawah Dusun III'),
    'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
    'Jalur pembangunan infrastruktur padukuhan',
    2
  ),
  (
    (select id from public.posting_dokumentasi where judul = 'Musyawarah Perencanaan Pembangunan'),
    'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=1200&q=80',
    'Pertemuan warga dan perangkat padukuhan',
    1
  ),
  (
    (select id from public.posting_dokumentasi where judul = 'Musyawarah Perencanaan Pembangunan'),
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
    'Forum diskusi pembangunan di balai padukuhan',
    2
  );

insert into public.video_dokumentasi (judul, durasi, url_gambar, url_video, urutan_tampil)
values
  (
    'Rangkuman Festival Padukuhan Sejahtera 2023',
    '05:42',
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    '#',
    1
  ),
  (
    'Profil Padukuhan Sejahtera: Menuju Padukuhan Mandiri',
    '12:15',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80',
    'https://youtu.be/eKLrQ2ztNhA?si=IwLO',
    2
  );

insert into public.statistik_profil (label, value, urutan_tampil)
values
  ('Tahun Berdiri', '1924', 1),
  ('Jumlah Penduduk', '12K+', 2),
  ('Dusun Aktif', '7', 3);

insert into public.aparatur_desa (nama, peran, urutan_tampil)
values
  ('H. Ahmad Fauzi', 'Kepala Padukuhan', 1),
  ('Siti Aminah', 'Sekretaris Padukuhan', 2),
  ('Budi Santoso', 'Kaur Keuangan', 3),
  ('Irfan Hakim', 'Kaur Pembangunan', 4);

insert into public.batas_wilayah_desa (arah, deskripsi, urutan_tampil)
values
  (
    'Batas Utara',
    'Berbatasan langsung dengan Hutan Lindung Gunung Hijau dan Padukuhan Makmur.',
    1
  ),
  (
    'Batas Selatan',
    'Dibatasi aliran Sungai Jernih yang menghubungkan padukuhan dengan kawasan kabupaten tetangga.',
    2
  ),
  (
    'Batas Timur & Barat',
    'Dikelilingi kawasan persawahan produktif yang berbatasan dengan Padukuhan Harapan dan Padukuhan Jaya.',
    3
  );

commit;
