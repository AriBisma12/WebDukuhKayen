import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter } from "../_components/site-footer";
import { SiteHeader } from "../_components/site-header";
import {
  getDocumentationCategories,
  getDocumentationPosts,
  getDocumentationVideos,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Dokumentasi Kegiatan | Portal Desa Sejahtera",
  description:
    "Halaman dokumentasi kegiatan Desa Sejahtera yang menampilkan arsip berita, foto, dan video kegiatan warga.",
};

export default async function DokumentasiKegiatanPage() {
  const [documentationCategories, documentationHighlights, documentationVideos] =
    await Promise.all([
      getDocumentationCategories(),
      getDocumentationPosts(),
      getDocumentationVideos(),
    ]);
  const [featuredPost, sidePost, ...bottomPosts] = documentationHighlights;

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#3e3323]">
      <SiteHeader currentPath="/dokumentasi-kegiatan" />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
            alt="Pemandangan sawah desa"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(42,30,8,0.18),_rgba(42,30,8,0.66))]" />
        </div>

        <div className="relative mx-auto flex min-h-[380px] max-w-7xl items-center justify-center px-6 py-16 text-center md:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl font-extrabold text-white md:text-6xl">
              Dokumentasi Kegiatan
            </h1>
            <p className="mt-5 text-base leading-8 text-white/88 md:text-lg">
              Jendela keterbukaan dan kebanggaan komunitas Desa Sejahtera
              melalui rekaman visual kegiatan rutin dan momen spesial.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {documentationCategories.map((category, index) => (
            <button
              key={category}
              type="button"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                index === 0
                  ? "bg-[#8b6c08] text-white shadow-[0_16px_30px_-20px_rgba(139,108,8,0.95)]"
                  : "bg-[#ebe6dd] text-[#736754] hover:bg-[#e3ddcf]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.68fr]">
          <article className="overflow-hidden rounded-[1.75rem] border border-[#ddd1bf] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)]">
            <div className="relative h-[300px] md:h-[360px]">
              <Image
                src={featuredPost.image}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[#f0cc5a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#684e08]">
                {featuredPost.category}
              </span>
            </div>
            <div className="p-6 md:p-7">
              <p className="text-xs uppercase tracking-[0.16em] text-[#af9d80]">
                {featuredPost.date}
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold text-[#47361a]">
                {featuredPost.title}
              </h2>
              <p className="mt-4 max-w-3xl leading-8 text-[#7a6e5a]">
                {featuredPost.excerpt}
              </p>
              <Link
                href="#"
                className="mt-6 inline-flex text-sm font-semibold text-[#7a5b0a]"
              >
                Baca Selengkapnya {"->"}
              </Link>
            </div>
          </article>

          <article className="overflow-hidden rounded-[1.75rem] border border-[#ddd1bf] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)]">
            <div className="relative h-[300px]">
              <Image
                src={sidePost.image}
                alt={sidePost.title}
                fill
                className="object-cover"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[#f0cc5a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#684e08]">
                {sidePost.category}
              </span>
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.16em] text-[#af9d80]">
                {sidePost.date}
              </p>
              <h3 className="mt-3 font-heading text-2xl font-bold text-[#47361a]">
                {sidePost.title}
              </h3>
              <p className="mt-4 leading-8 text-[#7a6e5a]">{sidePost.excerpt}</p>
            </div>
          </article>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.62fr_0.62fr_0.76fr]">
          {bottomPosts.map((post) => (
            <article
              key={post.title}
              className="overflow-hidden rounded-[1.65rem] border border-[#ddd1bf] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)]"
            >
              <div className="relative h-[220px]">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#f0cc5a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#684e08]">
                  {post.category}
                </span>
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-[#af9d80]">
                  {post.date}
                </p>
                <h3 className="mt-3 font-heading text-2xl font-bold text-[#47361a]">
                  {post.title}
                </h3>
                <p className="mt-4 leading-8 text-[#7a6e5a]">{post.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#efede8] py-16">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="font-heading text-3xl font-bold text-[#7a5b0a] md:text-4xl">
                Dokumentasi Video
              </h2>
              <p className="mt-2 text-[#7b6e5c]">
                Saksikan rangkuman kegiatan kami dalam format audio-visual yang
                dinamis.
              </p>
            </div>
            <Link href="#" className="text-sm font-semibold text-[#7a5b0a]">
              Lihat Semua Video {"->"}
            </Link>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {documentationVideos.map((video) => (
              <article
                key={video.title}
                className="group overflow-hidden rounded-[1.5rem] border border-[#d7ccb9] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)]"
              >
                <div className="relative h-[280px]">
                  <Image
                    src={video.image}
                    alt={video.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(0,0,0,0.06),_rgba(0,0,0,0.55))]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full border border-white/50 bg-[#8b6c08]/88 text-xl font-bold text-white">
                      {">"}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <h3 className="font-heading text-2xl font-bold">
                      {video.title}
                    </h3>
                    <p className="mt-1 text-sm text-white/85">
                      Durasi: {video.duration}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#f1c94d] px-6 py-14 text-center shadow-[0_28px_60px_-42px_rgba(122,91,10,0.85)] md:px-12">
          <div className="absolute -left-12 bottom-[-4rem] h-40 w-40 rounded-full bg-white/15" />
          <div className="absolute -right-8 top-[-3rem] h-36 w-36 rounded-full bg-[#ddb332]/35" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="font-heading text-3xl font-bold text-[#5d4608] md:text-4xl">
              Punya Dokumentasi Menarik?
            </h2>
            <p className="mt-4 leading-8 text-[#775d14]">
              Kami mengundang warga untuk berbagi foto atau video kegiatan di
              lingkungan masing-masing untuk ditampilkan di galeri resmi desa.
            </p>
            <button type="button" className="mt-8 hero-primary-button">
              Kirim Dokumentasi
            </button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
