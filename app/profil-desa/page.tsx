import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "../_components/site-footer";
import { SiteHeader } from "../_components/site-header";
import {
  getProfileOfficials,
  getProfileStats,
  getVillageBoundaries,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Profil Desa | Portal Desa Sejahtera",
  description:
    "Informasi profil Desa Sejahtera mencakup sejarah desa, struktur organisasi, statistik, dan gambaran wilayah.",
};

export default async function ProfilDesaPage() {
  const [profileOfficials, profileStats, villageBoundaries] = await Promise.all([
    getProfileOfficials(),
    getProfileStats(),
    getVillageBoundaries(),
  ]);
  const [villageHead, ...staff] = profileOfficials;

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#3e3323]">
      <SiteHeader currentPath="/profil-desa" />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
            alt="Panorama desa dan perbukitan"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(36,28,12,0.12),_rgba(36,28,12,0.72))]" />
        </div>

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-6 pb-16 pt-14 md:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-[#f0cc5a] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#624a08]">
              Profil Utama
            </span>
            <h1 className="mt-5 font-heading text-4xl font-extrabold text-white md:text-6xl">
              Pusat Pelayanan Masyarakat Desa Sejahtera
            </h1>
            <p className="mt-5 text-base leading-8 text-white/88 md:text-lg">
              Wujud transparansi dan modernisasi pelayanan warga yang tetap
              berakar pada gotong royong, budaya, dan kekuatan komunitas desa.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-14 px-6 py-20 md:px-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <div>
            <p className="section-kicker">Sejarah Desa</p>
            <h2 className="section-title">Akar sejarah yang tumbuh bersama zaman</h2>
          </div>
          <div className="space-y-4 leading-8 text-[#7a6e5a]">
            <p>
              Desa Sejahtera didirikan pada awal abad ke-20 dari pemukiman kecil
              di kaki perbukitan yang dikelilingi lahan pertanian subur. Sejak
              awal, desa ini tumbuh dengan semangat musyawarah dan kerja
              bersama antarkeluarga.
            </p>
            <p>
              Dalam perjalanannya, desa berkembang dari kawasan agraris
              tradisional menjadi desa yang mulai mengadopsi layanan digital,
              tanpa meninggalkan nilai adat, solidaritas sosial, dan kearifan
              lokal yang diwariskan para tetua.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {profileStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.4rem] border border-[#ddd1bf] bg-[#fbf8f2] p-5 shadow-[0_20px_40px_-36px_rgba(52,37,13,0.8)]"
              >
                <p className="font-heading text-3xl font-extrabold text-[#7a5b0a]">
                  {stat.value}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#8e7d63]">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-[#ddd1bf] bg-white p-3 shadow-[0_28px_60px_-36px_rgba(52,37,13,0.82)]">
            <Image
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"
              alt="Dokumentasi sejarah dan pertemuan warga desa"
              width={1200}
              height={1500}
              className="h-[560px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
          <div className="absolute bottom-6 left-6 max-w-[220px] rounded-[1.4rem] bg-[#f4c94b] px-5 py-4 shadow-[0_20px_40px_-28px_rgba(122,91,10,0.95)]">
            <p className="font-heading text-sm font-bold text-[#5f4600]">
              &quot;Membangun masa depan tanpa melupakan akar budaya.&quot;
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-6 md:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-kicker justify-center">Struktur Organisasi</p>
          <h2 className="section-title">Kepemimpinan yang terbuka dan akuntabel</h2>
          <p className="mt-4 leading-8 text-[#7a6e5a]">
            Struktur ini memakai data dummy dan siap dikembangkan ke format
            profil aparatur lengkap berikut foto dan tugas pokok.
          </p>
        </div>

        <div className="mt-14 overflow-x-auto pb-4">
          <div className="min-w-[860px]">
            <div className="flex flex-col items-center">
              <div className="relative rounded-[1.7rem] bg-[#7a5b0a] px-8 py-7 text-center text-white shadow-[0_28px_50px_-30px_rgba(122,91,10,0.95)]">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-white/12 font-heading text-2xl font-bold">
                  AD
                </div>
                <h3 className="font-heading text-2xl font-bold">{villageHead.name}</h3>
                <p className="mt-1 text-sm uppercase tracking-[0.16em] text-white/78">
                  {villageHead.role}
                </p>
                <div className="absolute left-1/2 top-full h-12 w-px -translate-x-1/2 bg-[#ccbfa6]" />
              </div>

              <div className="relative mt-12 w-full">
                <div className="absolute left-1/2 top-0 h-px w-[68%] -translate-x-1/2 bg-[#ccbfa6]" />
                <div className="grid grid-cols-3 gap-8 pt-10">
                  {staff.map((official) => (
                    <div key={official.name} className="relative text-center">
                      <div className="absolute left-1/2 top-[-2.5rem] h-10 w-px -translate-x-1/2 bg-[#ccbfa6]" />
                      <div className="rounded-[1.4rem] border border-[#ddd1bf] bg-[#fbf8f2] px-5 py-6 shadow-[0_20px_40px_-36px_rgba(52,37,13,0.8)]">
                        <h4 className="font-heading text-xl font-bold text-[#5a430d]">
                          {official.name}
                        </h4>
                        <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#8f7d61]">
                          {official.role}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl items-center gap-14 px-6 py-20 md:px-8 lg:grid-cols-[0.98fr_1.02fr]">
        <div className="relative order-2 lg:order-1">
          <div className="overflow-hidden rounded-[2rem] border border-[#ddd1bf] bg-[#f0ece4] shadow-[0_28px_60px_-36px_rgba(52,37,13,0.82)]">
            <Image
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80"
              alt="Peta wilayah dan area pertanian desa"
              width={1200}
              height={1200}
              className="h-[520px] w-full object-cover opacity-90"
            />
          </div>
          <div className="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-[#7a5b0a] shadow-[0_20px_35px_-26px_rgba(52,37,13,0.7)] backdrop-blur">
            Luas Wilayah: 1.420 Hektar
          </div>
        </div>

        <div className="order-1 space-y-7 lg:order-2">
          <div>
            <p className="section-kicker">Wilayah Desa</p>
            <h2 className="section-title">Lanskap strategis dengan potensi alam yang kuat</h2>
            <p className="mt-4 leading-8 text-[#7a6e5a]">
              Desa Sejahtera berada di wilayah perbukitan subur dengan
              persawahan produktif, sumber air yang memadai, dan konektivitas
              antardusun yang terus dikembangkan.
            </p>
          </div>

          <div className="space-y-5">
            {villageBoundaries.map((item) => (
              <div
                key={item.direction}
                className="flex gap-4 rounded-[1.35rem] border border-[#ddd1bf] bg-[#fbf8f2] p-5 shadow-[0_18px_35px_-34px_rgba(52,37,13,0.82)]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0cc5a] font-heading text-sm font-bold text-[#664d08]">
                  {item.direction.split(" ")[1]?.slice(0, 1) ?? "D"}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-[#5a430d]">
                    {item.direction}
                  </h3>
                  <p className="mt-2 leading-7 text-[#7a6e5a]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
