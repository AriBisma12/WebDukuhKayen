import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { getDocumentationCategories, getDocumentationPosts, getDocumentationVideos } from '../lib/siteContent';

// --- Documentation Modal ---
function DocumentationModal({ post, onClose }) {
  const photos = post?.photos?.length
    ? post.photos
    : post
      ? [{ image: post.image, alt: post.title }]
      : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (!post) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
          return;
        }
        onClose();
      }

      if (lightboxIndex !== null && photos.length > 1) {
        if (event.key === "ArrowLeft") {
          setLightboxIndex((current) =>
            current === null ? 0 : (current - 1 + photos.length) % photos.length
          );
        }
        if (event.key === "ArrowRight") {
          setLightboxIndex((current) =>
            current === null ? 0 : (current + 1) % photos.length
          );
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lightboxIndex, onClose, photos.length, post]);

  if (!post) return null;

  const activePhoto = photos[activeIndex] ?? { image: post.image, alt: post.title };
  const lightboxPhoto = lightboxIndex !== null ? photos[lightboxIndex] ?? activePhoto : null;
  const lightboxPosition = lightboxIndex !== null ? lightboxIndex + 1 : 1;

  const handlePhotoChange = (nextIndex) => {
    if (photos.length === 0) return;
    const normalizedIndex = (nextIndex + photos.length) % photos.length;
    setActiveIndex(normalizedIndex);
  };

  const handleLightboxChange = (nextIndex) => {
    if (photos.length === 0) return;
    const normalizedIndex = (nextIndex + photos.length) % photos.length;
    setLightboxIndex(normalizedIndex);
    setActiveIndex(normalizedIndex);
  };

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
          className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-[#5f4608] shadow-[0_14px_28px_-20px_rgba(52,37,13,0.9)] transition hover:bg-white"
        >
          x
        </button>

        <div className="relative h-[280px] md:h-[420px]">
          <button
            type="button"
            onClick={() => setLightboxIndex(activeIndex)}
            className="absolute inset-0 block"
            aria-label={`Lihat foto ${activeIndex + 1} lebih besar`}
          >
            <img
              src={activePhoto.image}
              alt={activePhoto.alt}
              className="h-full w-full object-cover"
            />
          </button>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(31,21,4,0.08),_rgba(31,21,4,0.7))]" />
          <div className="absolute left-6 top-6 rounded-full bg-[#f0cc5a] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#684e08]">
            {post.category}
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">
              {post.date}
            </p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-tight md:text-5xl">
              {post.title}
            </h2>
          </div>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Foto sebelumnya"
                onClick={() => handlePhotoChange(activeIndex - 1)}
                className="absolute left-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-[#60470a] shadow-[0_18px_36px_-24px_rgba(52,37,13,0.9)] transition hover:bg-white"
              >
                {"<"}
              </button>
              <button
                type="button"
                aria-label="Foto berikutnya"
                onClick={() => handlePhotoChange(activeIndex + 1)}
                className="absolute right-5 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl font-bold text-[#60470a] shadow-[0_18px_36px_-24px_rgba(52,37,13,0.9)] transition hover:bg-white"
              >
                {">"}
              </button>
            </>
          )}
        </div>

        <div className="space-y-6 px-6 py-8 md:px-8 md:py-10">
          {photos.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#9f8f72]">
                    Galeri Dokumentasi
                  </p>
                  <p className="mt-1 text-sm text-[#7a6e5a]">
                    {activeIndex + 1} dari {photos.length} foto
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAllPhotos((value) => !value)}
                  className="rounded-full bg-[#efe3b4] px-4 py-2 text-sm font-semibold text-[#6f5311] transition hover:bg-[#ead99a]"
                >
                  {showAllPhotos ? "Sembunyikan Foto" : "Lihat Semua Foto"}
                </button>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2">
                {photos.map((photo, index) => (
                  <button
                    key={`${post.title}-${photo.image}`}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className={`relative h-24 w-28 shrink-0 overflow-hidden rounded-[1.15rem] border transition ${
                      index === activeIndex
                        ? "border-[#8b6c08] ring-2 ring-[#d7bb67]"
                        : "border-[#e2d7c4] hover:border-[#cbb382]"
                    }`}
                  >
                    <img
                      src={photo.image}
                      alt={photo.alt}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {showAllPhotos && (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {photos.map((photo, index) => (
                    <button
                      key={`${post.title}-full-${photo.image}`}
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      className="relative h-40 overflow-hidden rounded-[1.25rem] border border-[#e2d7c4] transition hover:-translate-y-1 hover:shadow-[0_18px_35px_-28px_rgba(52,37,13,0.9)]"
                    >
                      <img
                        src={photo.image}
                        alt={photo.alt}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          <p className="text-lg leading-8 text-[#6f624d]">{post.excerpt}</p>
          <p className="leading-8 text-[#7a6e5a]">
            Dokumentasi ini menampilkan rangkuman kegiatan padukuhan yang telah
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
            <span className="rounded-full bg-[#ece6da] px-4 py-2 text-sm font-semibold text-[#6c604d]">
              Total Foto: {photos.length}
            </span>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(21,14,3,0.92)] p-4 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative flex h-full max-h-[92vh] w-full max-w-6xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Tutup foto"
              onClick={() => setLightboxIndex(null)}
              className="absolute right-2 top-2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/95 text-xl font-bold text-[#5f4608] shadow-[0_14px_28px_-20px_rgba(52,37,13,0.9)] transition hover:bg-white"
            >
              x
            </button>

            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label="Foto sebelumnya"
                  onClick={() => handleLightboxChange((lightboxIndex ?? 0) - 1)}
                  className="absolute left-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl font-bold text-[#5f4608] shadow-[0_14px_28px_-20px_rgba(52,37,13,0.9)] transition hover:bg-white"
                >
                  {"<"}
                </button>
                <button
                  type="button"
                  aria-label="Foto berikutnya"
                  onClick={() => handleLightboxChange((lightboxIndex ?? 0) + 1)}
                  className="absolute right-2 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-2xl font-bold text-[#5f4608] shadow-[0_14px_28px_-20px_rgba(52,37,13,0.9)] transition hover:bg-white"
                >
                  {">"}
                </button>
              </>
            )}

            <div className="relative h-full max-h-[80vh] w-full overflow-hidden rounded-[1.5rem]">
              <img
                src={lightboxPhoto.image}
                alt={lightboxPhoto.alt}
                className="h-full w-full object-contain"
              />
            </div>

            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/45 px-4 py-2 text-sm text-white">
              <span>
                {lightboxPosition} / {photos.length}
              </span>
              <span className="max-w-[50vw] truncate text-white/85">
                {lightboxPhoto.alt}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Clickable Article Card ---
function ClickableArticle({ post, className, imageHeightClass, titleClassName, excerptClassName, onOpen }) {
  const handleKeyDown = (event) => {
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
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover"
        />
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
        <div className="mt-4 flex items-center gap-3 text-sm text-[#8b7c63]">
          <span>{post.photos?.length ?? 0} foto dokumentasi</span>
        </div>
        <span className="mt-6 inline-flex text-sm font-semibold text-[#7a5b0a]">
          Baca Selengkapnya {"->"}
        </span>
      </div>
    </article>
  );
}

// --- Main Page ---
export default function DokumentasiKegiatan() {
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState(['Semua']);
  const [documentationVideos, setDocumentationVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [cats, docu, vids] = await Promise.all([
        getDocumentationCategories(),
        getDocumentationPosts(),
        getDocumentationVideos(),
      ]);
      setCategories(cats);
      setPosts(docu);
      setDocumentationVideos(vids);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredPosts =
    activeCategory === "Semua"
      ? posts
      : posts.filter((post) => post.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#3e3323]">
      <Helmet>
        <title>Dokumentasi Kegiatan | Portal Padukuhan Kayen</title>
        <meta
          name="description"
          content="Halaman dokumentasi kegiatan Padukuhan Kayen yang menampilkan arsip berita, foto, dan video kegiatan warga."
        />
      </Helmet>

      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
            alt="Pemandangan sawah padukuhan"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(42,30,8,0.18),_rgba(42,30,8,0.66))]" />
        </div>

        <div className="relative mx-auto flex min-h-[380px] max-w-7xl items-center justify-center px-6 py-16 text-center md:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl font-extrabold text-white md:text-6xl">
              Dokumentasi Kegiatan
            </h1>
            <p className="mt-5 text-base leading-8 text-white/80 md:text-lg">
              Jendela keterbukaan dan kebanggaan komunitas Padukuhan Kayen
              melalui rekaman visual kegiatan rutin dan momen spesial.
            </p>
          </div>
        </div>
      </section>

      {/* Posts with filter */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                category === activeCategory
                  ? "bg-[#8b6c08] text-white shadow-[0_16px_30px_-20px_rgba(139,108,8,0.95)]"
                  : "bg-[#ebe6dd] text-[#736754] hover:bg-[#e3ddcf]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>


        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-[420px] rounded-[1.9rem] bg-[#ece8df] animate-pulse" />)}
          </div>
        ) : filteredPosts.length > 0 && (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredPosts.map((post) => (
              <ClickableArticle
                key={post.title}
                post={post}
                onOpen={setSelectedPost}
                className="flex h-full flex-col overflow-hidden rounded-[1.9rem] border border-[#ddd1bf] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)]"
                imageHeightClass="h-[240px] sm:h-[260px]"
                titleClassName="mt-4 font-heading text-[2rem] font-bold leading-tight text-[#47361a]"
                excerptClassName="mt-5 leading-8 text-[#7a6e5a]"
              />
            ))}
          </div>
        )}
      </section>

      {/* Video Section */}
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
            <a href="#" className="text-sm font-semibold text-[#7a5b0a]">
              Lihat Semua Video {"->"}
            </a>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {documentationVideos.map((video) => (
              <a
                key={video.title}
                href={video.videoUrl || "#"}
                target={video.videoUrl ? "_blank" : undefined}
                rel={video.videoUrl ? "noreferrer" : undefined}
                className={`group block overflow-hidden rounded-[1.5rem] border border-[#d7ccb9] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)] ${
                  video.videoUrl ? "" : "pointer-events-none opacity-80"
                }`}
              >
                <div className="relative h-[280px]">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
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
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
              lingkungan masing-masing untuk ditampilkan di galeri resmi padukuhan.
            </p>
            <button type="button" className="mt-8 hero-primary-button">
              Kirim Dokumentasi
            </button>
          </div>
        </div>
      </section>

      {/* Documentation Modal */}
      <DocumentationModal
        key={selectedPost?.title ?? "documentation-modal"}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      <SiteFooter />
    </main>
  );
}
