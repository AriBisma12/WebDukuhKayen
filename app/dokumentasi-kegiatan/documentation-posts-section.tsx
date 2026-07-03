"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { DocumentationPost } from "../_data/site";

type DocumentationPostsSectionProps = {
  posts: DocumentationPost[];
};

function DocumentationModal({
  post,
  onClose,
}: {
  post: DocumentationPost | null;
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
          <Image
            src={post.photos?.[0]?.image ?? post.image}
            alt={post.photos?.[0]?.alt ?? post.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(31,21,4,0.08),_rgba(31,21,4,0.7))]" />
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
          {post.photos && post.photos.length > 1 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {post.photos.map((photo) => (
                <div
                  key={`${post.title}-${photo.image}`}
                  className="relative h-32 overflow-hidden rounded-[1.25rem] border border-[#e2d7c4]"
                >
                  <Image
                    src={photo.image}
                    alt={photo.alt}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
          <p className="text-lg leading-8 text-[#6f624d]">{post.excerpt}</p>
          <p className="leading-8 text-[#7a6e5a]">
            Dokumentasi ini menampilkan rangkuman kegiatan desa yang telah
            berlangsung dan menjadi bagian dari arsip keterbukaan informasi
            untuk masyarakat. Konten dapat dikembangkan lagi dengan detail
            narasi yang lebih lengkap dari database.
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

function ClickableArticle({
  post,
  className,
  imageHeightClass,
  titleClassName,
  excerptClassName,
  showReadMore = false,
  onOpen,
}: {
  post: DocumentationPost;
  className: string;
  imageHeightClass: string;
  titleClassName: string;
  excerptClassName: string;
  showReadMore?: boolean;
  onOpen: (post: DocumentationPost) => void;
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
      className={`${className} cursor-pointer transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-36px_rgba(53,38,13,0.88)] focus:outline-none focus:ring-2 focus:ring-[#8b6c08] focus:ring-offset-4`}
    >
      <div className={`relative ${imageHeightClass}`}>
        <Image src={post.image} alt={post.title} fill className="object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-[#f0cc5a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-[#684e08]">
          {post.category}
        </span>
      </div>
      <div className="p-6 md:p-7">
        <p className="text-xs uppercase tracking-[0.16em] text-[#af9d80]">
          {post.date}
        </p>
        <h3 className={titleClassName}>{post.title}</h3>
        <p className={excerptClassName}>{post.excerpt}</p>
        {showReadMore ? (
          <span className="mt-6 inline-flex text-sm font-semibold text-[#7a5b0a]">
            Baca Selengkapnya {"->"}
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function DocumentationPostsSection({
  posts,
}: DocumentationPostsSectionProps) {
  const [selectedPost, setSelectedPost] = useState<DocumentationPost | null>(
    null,
  );
  const [featuredPost, sidePost, ...bottomPosts] = posts;

  if (!featuredPost || !sidePost) {
    return null;
  }

  return (
    <>
      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_0.68fr]">
        <ClickableArticle
          post={featuredPost}
          onOpen={setSelectedPost}
          className="overflow-hidden rounded-[1.75rem] border border-[#ddd1bf] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)]"
          imageHeightClass="h-[300px] md:h-[360px]"
          titleClassName="mt-3 font-heading text-3xl font-bold text-[#47361a]"
          excerptClassName="mt-4 max-w-3xl leading-8 text-[#7a6e5a]"
          showReadMore
        />

        <ClickableArticle
          post={sidePost}
          onOpen={setSelectedPost}
          className="overflow-hidden rounded-[1.75rem] border border-[#ddd1bf] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)]"
          imageHeightClass="h-[300px]"
          titleClassName="mt-3 font-heading text-2xl font-bold text-[#47361a]"
          excerptClassName="mt-4 leading-8 text-[#7a6e5a]"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.62fr_0.62fr_0.76fr]">
        {bottomPosts.map((post) => (
          <ClickableArticle
            key={post.title}
            post={post}
            onOpen={setSelectedPost}
            className="overflow-hidden rounded-[1.65rem] border border-[#ddd1bf] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)]"
            imageHeightClass="h-[220px]"
            titleClassName="mt-3 font-heading text-2xl font-bold text-[#47361a]"
            excerptClassName="mt-4 leading-8 text-[#7a6e5a]"
          />
        ))}
      </div>

      <DocumentationModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </>
  );
}
