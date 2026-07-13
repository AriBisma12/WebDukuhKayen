import { Link } from "@/lib/react-router";

type AdminStaticDisabledProps = {
  title: string;
  description: string;
};

export function AdminStaticDisabled({
  title,
  description,
}: AdminStaticDisabledProps) {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#f7edd0,_#eadfc8_45%,_#e4d8bf)] px-4 py-10 text-[#3d2f18] md:px-8">
      <div className="mx-auto max-w-[760px]">
        <section className="rounded-[2.2rem] border border-[#d7c8aa] bg-[#fffaf0] p-8 shadow-[0_28px_70px_-45px_rgba(54,39,11,0.75)] md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b6c08]">
            Mode Hosting Gratis
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-[#4d3906]">
            {title}
          </h1>
          <p className="mt-5 leading-8 text-[#6c5830]">{description}</p>

          <div className="mt-6 rounded-[1.2rem] border border-[#e7d9b8] bg-[#fbf3df] px-4 py-4 text-sm leading-7 text-[#735718]">
            Panel admin, login, cookie sesi, dan sinkronisasi Supabase nonaktif pada
            build statis agar situs bisa di-host di Firebase Hosting gratis.
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/" className="hero-primary-button">
              Kembali ke Beranda
            </Link>
            <Link href="/profil-desa" className="hero-secondary-button">
              Lihat Halaman Publik
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
