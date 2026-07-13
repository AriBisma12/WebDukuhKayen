# Portal Padukuhan Kayen

Website profil Padukuhan Kayen berbasis React murni dengan Vite, Supabase Auth,
dan Firebase Hosting gratis.

## Development

```powershell
npm install
npm run dev
```

Buka alamat lokal yang ditampilkan Vite, biasanya `http://localhost:5173`.

## Build

```powershell
npm run build
```

Output produksi dibuat ke folder `dist`.

## Firebase Hosting

```powershell
firebase deploy --only hosting
```

Firebase dikonfigurasi sebagai SPA dan akan menyajikan `dist/index.html` untuk
semua route, termasuk halaman admin.

## Environment

Variabel browser harus memakai prefix Vite:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
```
