"use client";

import { Link } from "@/lib/react-router";
import { useRouter, useSearchParams } from "@/lib/react-router";
import { useState, type FormEvent } from "react";
import { buildAdminRedirectUrl } from "./admin-client-shared";
import { signInAdmin } from "@/lib/admin-client";

function getFirstQueryValue(value: string | null) {
  return value ?? undefined;
}

export function AdminLoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("kayendukuh@gmail.com");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const status = getFirstQueryValue(searchParams.get("status"));
  const message = getFirstQueryValue(searchParams.get("message"));
  const isError = status === "error";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      await signInAdmin(email, password);
      router.replace(buildAdminRedirectUrl("/admin/", "success", "Login admin berhasil."));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Gagal login ke panel admin.";
      router.replace(buildAdminRedirectUrl("/admin/login/", "error", errorMessage));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7edd0,_#eadfc8_45%,_#e4d8bf)] px-4 py-10 text-[#3d2f18] md:px-8">
      <div className="mx-auto max-w-[640px]">
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

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#644d19]">
                Email Admin
              </span>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className="w-full rounded-2xl border border-[#d9ccb4] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
                placeholder="nama@email.com"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-[#644d19]">
                Password
              </span>
              <input
                type="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className="w-full rounded-2xl border border-[#d9ccb4] bg-white px-4 py-3 outline-none transition focus:border-[#8b6c08] focus:ring-2 focus:ring-[#ead08c]"
                placeholder="Masukkan password admin"
              />
            </label>

            <div className="rounded-[1rem] border border-[#ead9b4] bg-[#fff6df] px-4 py-3 text-sm leading-7 text-[#735718]">
              Panel admin ini memakai autentikasi bawaan Supabase. Selama akun berhasil login
              lewat Supabase Auth, akun tersebut bisa masuk ke panel admin.
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="hero-primary-button mt-2 w-full disabled:opacity-70"
            >
              {submitting ? "Memproses Login..." : "Masuk ke Admin Panel"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
