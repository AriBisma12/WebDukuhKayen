import type { Metadata } from "next";
import Link from "next/link";
import { redirectIfAdminAuthenticated } from "@/lib/admin-auth";
import { loginAdminAction } from "../actions";

export const metadata: Metadata = {
  title: "Login Admin | Portal Padukuhan Sejahtera",
  description: "Masuk ke panel admin untuk mengelola data portal Padukuhan Sejahtera.",
};

export const dynamic = "force-dynamic";

type AdminLoginPageProps = {
  searchParams: Promise<{
    status?: string | string[];
    message?: string | string[];
  }>;
};

function getFirstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  await redirectIfAdminAuthenticated();

  const resolvedSearchParams = await searchParams;
  const status = getFirstQueryValue(resolvedSearchParams.status);
  const message = getFirstQueryValue(resolvedSearchParams.message);
  const isError = status === "error";

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7edd0,_#eadfc8_45%,_#e4d8bf)] px-4 py-10 text-[#3d2f18] md:px-8">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_0.88fr]">
        <section className="rounded-[2.2rem] border border-[#dfd2ba] bg-[rgba(255,252,246,0.84)] p-8 shadow-[0_30px_70px_-40px_rgba(54,39,11,0.55)] backdrop-blur md:p-10">
          <p className="inline-flex rounded-full bg-[#f4d875] px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#6d5107]">
            Akses Admin
          </p>
          <h1 className="mt-6 font-heading text-4xl font-extrabold leading-tight text-[#5a4308] md:text-6xl">
            Kelola portal Padukuhan dalam satu dashboard.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#6f634f]">
            Panel ini dipakai untuk mengatur berita, statistik, dokumentasi,
            profil wilayah, dan akun admin. Semua perubahan langsung tersimpan
            ke database Supabase.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "Login memakai akun admin dari database.",
              "Semua perubahan data dilakukan server-side.",
              "Data publik otomatis direfresh setelah update.",
              "Migration admin dipisah dari migration publik.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.4rem] border border-[#eadcbf] bg-white/70 p-5 text-sm leading-7 text-[#6a5a42]"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2.2rem] border border-[#d7c8aa] bg-[#fffaf0] p-8 shadow-[0_28px_70px_-45px_rgba(54,39,11,0.75)] md:p-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b6c08]">
                Login Panel
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-[#4d3906]">
                Masuk sebagai admin
              </h2>
            </div>
            <Link
              href="/"
              className="rounded-full border border-[#dccfaf] px-4 py-2 text-sm font-semibold text-[#6f5411] transition hover:bg-[#f4ead1]"
            >
              Kembali ke Beranda
            </Link>
          </div>

          {message ? (
            <div
              className={`mt-6 rounded-[1.2rem] border px-4 py-3 text-sm leading-7 ${
                isError
                  ? "border-[#edc9c9] bg-[#fff1f1] text-[#9f2c2c]"
                  : "border-[#d8dfc3] bg-[#f5faea] text-[#476224]"
              }`}
            >
              {message}
            </div>
          ) : null}

          <form action={loginAdminAction} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#644d19]">
                Username
              </span>
              <input
                type="text"
                name="username"
                required
                className="w-full rounded-2xl border border-[#d9ccb4] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
                placeholder="admin"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#644d19]">
                Password
              </span>
              <input
                type="password"
                name="password"
                required
                className="w-full rounded-2xl border border-[#d9ccb4] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
                placeholder="Masukkan password admin"
              />
            </label>

            <button type="submit" className="hero-primary-button mt-2 w-full">
              Masuk ke Admin Panel
            </button>
          </form>

          <div className="mt-8 rounded-[1.4rem] bg-[#f5eedf] p-5 text-sm leading-7 text-[#715f40]">
            Login memakai akun pada tabel `admin_users`. Untuk deploy, pastikan
            env `SUPABASE_SERVICE_ROLE_KEY` sudah diisi dan migration admin
            sudah dijalankan.
          </div>
        </section>
      </div>
    </main>
  );
}
