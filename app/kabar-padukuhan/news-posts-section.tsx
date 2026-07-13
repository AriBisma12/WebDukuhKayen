"use client";

import { useEffect, useState } from "react";
import { Image } from "@/lib/react-image";
import type { NewsItem } from "../_data/site";

type NewsPostsSectionProps = {
  posts: NewsItem[];
};

function NewsModal({
  post,
  onClose,
}: {
  post: NewsItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!post) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, post]);

  if (!post) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2d2008]/65 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-[#fbf8f2] shadow-[0_32px_80px_-28px_rgba(38,24,4,0.75)]"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Tutup modal"
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/92 text-xl font-bold text-[#5f4608] shadow-[0_14px_28px_-20px_rgba(52,37,13,0.9)] transition hover:bg-white"
        >
          x
        </button>

        <div className="relative h-[280px] md:h-[420px]">
          <Image src={post.image} alt={post.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(31,21,4,0.08),_rgba(31,21,4,0.72))]" />
          <div className="absolute left-6 top-6 rounded-full bg-[#f0cc5a] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#684e08]">
            {post.category}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/82">
              {post.date}
            </p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-tight md:text-5xl">
              {post.title}
            </h2>
          </div>
        </div>

        <div className="space-y-6 px-6 py-8 md:px-8 md:py-10">
          <p className="text-lg leading-8 text-[#6f624d]">{post.excerpt}</p>
          <p className="leading-8 text-[#7a6e5a]">
            Informasi ini merupakan bagian dari kabar terbaru padukuhan dan
            dapat dikembangkan lebih lanjut menjadi artikel lengkap, arsip
            pengumuman, atau laporan kegiatan resmi dari basis data.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-[#efe3b4] px-4 py-2 text-sm font-semibold text-[#6f5311]">
              Kategori: {post.category}
            </span>
            <span className="rounded-full bg-[#ece6da] px-4 py-2 text-sm font-semibold text-[#6c604d]">
              Tanggal: {post.date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClickableNewsCard({
  post,
  onOpen,
}: {
  post: NewsItem;
  onOpen: (post: NewsItem) => void;
}) {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen(post);
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={() => onOpen(post)}
      onKeyDown={handleKeyDown}
      className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.9rem] border border-[#ddd1bf] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-36px_rgba(53,38,13,0.88)] focus:outline-none focus:ring-2 focus:ring-[#8b6c08] focus:ring-offset-4"
    >
      <div className="relative h-[240px] sm:h-[260px]">
        <Image src={post.image} alt={post.title} fill className="object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-[#7a5b0a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-[#af9d80]">
          {post.date}
        </p>
        <h3 className="mt-4 font-heading text-[2rem] font-bold leading-tight text-[#47361a]">
          {post.title}
        </h3>
        <p className="mt-5 flex-1 leading-8 text-[#7a6e5a]">{post.excerpt}</p>
        <span className="mt-6 inline-flex text-sm font-semibold text-[#7a5b0a]">
          Baca Selengkapnya {"->"}
        </span>
      </div>
    </article>
  );
}

export function NewsPostsSection({ posts }: NewsPostsSectionProps) {
  const [selectedPost, setSelectedPost] = useState<NewsItem | null>(null);

  if (posts.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <ClickableNewsCard
            key={post.title}
            post={post}
            onOpen={setSelectedPost}
          />
        ))}
      </div>

      <NewsModal
        key={selectedPost?.title ?? "news-modal"}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </>
  );
}
