import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { getVillageNews } from '../lib/siteContent';

function NewsModal({ post, onClose }) {
  useEffect(() => {
    if (!post) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener('keydown', onKeyDown); };
  }, [onClose, post]);

  if (!post) return null;
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#2d2008]/65 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] bg-[#fbf8f2] shadow-[0_32px_80px_-28px_rgba(38,24,4,0.75)]" onClick={(e) => e.stopPropagation()}>
        <button type="button" aria-label="Tutup modal" onClick={onClose} className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-xl font-bold text-[#5f4608] shadow-[0_14px_28px_-20px_rgba(52,37,13,0.9)] transition hover:bg-white">x</button>
        <div className="relative h-[280px] md:h-[420px]">
          <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(31,21,4,0.08),_rgba(31,21,4,0.72))]" />
          <div className="absolute left-6 top-6 rounded-full bg-[#f0cc5a] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#684e08]">{post.category}</div>
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white md:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/80">{post.date}</p>
            <h2 className="mt-3 max-w-3xl font-heading text-3xl font-bold leading-tight md:text-5xl">{post.title}</h2>
          </div>
        </div>
        <div className="space-y-6 px-6 py-8 md:px-8 md:py-10">
          <p className="text-lg leading-8 text-[#6f624d]">{post.excerpt}</p>
          <p className="leading-8 text-[#7a6e5a]">Informasi ini merupakan bagian dari kabar terbaru padukuhan dan dapat dikembangkan lebih lanjut menjadi artikel lengkap, arsip pengumuman, atau laporan kegiatan resmi dari basis data.</p>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full bg-[#efe3b4] px-4 py-2 text-sm font-semibold text-[#6f5311]">Kategori: {post.category}</span>
            <span className="rounded-full bg-[#ece6da] px-4 py-2 text-sm font-semibold text-[#6c604d]">Tanggal: {post.date}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ClickableNewsCard({ post, onOpen }) {
  const handleKeyDown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(post); } };
  return (
    <article role="button" tabIndex={0} onClick={() => onOpen(post)} onKeyDown={handleKeyDown} className="flex h-full cursor-pointer flex-col overflow-hidden rounded-[1.9rem] border border-[#ddd1bf] bg-white shadow-[0_24px_50px_-38px_rgba(53,38,13,0.8)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-36px_rgba(53,38,13,0.88)] focus:outline-none focus:ring-2 focus:ring-[#8b6c08] focus:ring-offset-4">
      <div className="relative h-[240px] sm:h-[260px]">
        <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-[#7a5b0a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">{post.category}</span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-[#af9d80]">{post.date}</p>
        <h3 className="mt-4 font-heading text-[2rem] font-bold leading-tight text-[#47361a]">{post.title}</h3>
        <p className="mt-5 flex-1 leading-8 text-[#7a6e5a]">{post.excerpt}</p>
        <span className="mt-6 inline-flex text-sm font-semibold text-[#7a5b0a]">Baca Selengkapnya {"->"}</span>
      </div>
    </article>
  );
}

export default function KabarPadukuhan() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [activeCategory, setActiveCategory] = useState('Semua');

  useEffect(() => {
    getVillageNews().then((data) => { setPosts(data); setLoading(false); });
  }, []);

  const categories = ['Semua', ...new Set(posts.map((p) => p.category))];
  const filteredPosts = activeCategory === 'Semua' ? posts : posts.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#3e3323]">
      <Helmet>
        <title>Kabar Padukuhan | Portal Padukuhan Kayen</title>
        <meta name="description" content="Halaman kabar padukuhan yang menampilkan berita, pengumuman, dan informasi terbaru Padukuhan Kayen." />
      </Helmet>
      <SiteHeader />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80" alt="Pemandangan padukuhan" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(42,30,8,0.18),_rgba(42,30,8,0.66))]" />
        </div>
        <div className="relative mx-auto flex min-h-[380px] max-w-7xl items-center justify-center px-6 py-16 text-center md:px-8">
          <div className="max-w-3xl">
            <h1 className="font-heading text-4xl font-extrabold text-white md:text-6xl">Kabar Padukuhan</h1>
            <p className="mt-5 text-base leading-8 text-white/80 md:text-lg">Informasi terbaru seputar kegiatan, pengumuman, dan perkembangan Padukuhan Kayen dalam satu halaman yang rapi dan mudah diikuti.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 md:px-8">
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <button key={category} type="button" onClick={() => setActiveCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${category === activeCategory ? 'bg-[#8b6c08] text-white shadow-[0_16px_30px_-20px_rgba(139,108,8,0.95)]' : 'bg-[#ebe6dd] text-[#736754] hover:bg-[#e3ddcf]'}`}>
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
              <ClickableNewsCard key={post.title} post={post} onOpen={setSelectedPost} />
            ))}
          </div>
        )}
      </section>

      <NewsModal key={selectedPost?.title ?? 'news-modal'} post={selectedPost} onClose={() => setSelectedPost(null)} />
      <SiteFooter />
    </main>
  );
}
