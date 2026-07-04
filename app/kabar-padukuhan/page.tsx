import type { Metadata } from "next";
import Image from "next/image";
import { SiteFooter } from "../_components/site-footer";
import { SiteHeader } from "../_components/site-header";
import { getVillageNews } from "@/lib/site-content";
import { NewsPostsSection } from "./news-posts-section";

export const metadata: Metadata = {
  title: "Kabar Padukuhan | Portal Padukuhan Sejahtera",
  description:
    "Halaman kabar padukuhan yang menampilkan berita, pengumuman, dan informasi terbaru Padukuhan Sejahtera.",
};

export default async function KabarPadukuhanPage() {
  const posts = await getVillageNews();
  const categories = ["Semua", ...new Set(posts.map((post) => post.category))];

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#3e3323]">
      <SiteHeader currentPath="/kabar-padukuhan" />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
            alt="Pemandangan padukuhan"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(42,30,8,0.18),_rgba(42,30,8,0.66))]" />
        </div>

        <div className="relative mx-auto flex min-h-[380px] max-w-7xl items-center justify-center px-6 py-16 text-center md:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl font-extrabold text-white md:text-6xl">
              Kabar Padukuhan
            </h1>
            <p className="mt-5 text-base leading-8 text-white/88 md:text-lg">
              Informasi terbaru seputar kegiatan, pengumuman, dan perkembangan
              Padukuhan Sejahtera dalam satu halaman yang rapi dan mudah diikuti.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category, index) => (
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

        <NewsPostsSection posts={posts} />
      </section>

      <SiteFooter />
    </main>
  );
}
