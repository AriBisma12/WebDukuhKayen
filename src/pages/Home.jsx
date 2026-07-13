import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { missionPoints } from '../data/site';
import { getVillageNews, getVillageStats } from '../lib/siteContent';

export default function Home() {
  const [villageNews, setVillageNews] = useState([]);
  const [villageStats, setVillageStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [news, stats] = await Promise.all([
        getVillageNews(),
        getVillageStats(),
      ]);
      setVillageNews(news);
      setVillageStats(stats);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-[#3e3323]">
      <Helmet>
        <title>Beranda | Portal Padukuhan Kayen</title>
        <meta
          name="description"
          content="Halaman utama Portal Padukuhan Kayen yang menampilkan layanan unggulan, visi misi, berita, dan statistik padukuhan."
        />
      </Helmet>

      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80"
            alt="Pemandangan sawah bertingkat padukuhan"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,_rgba(55,39,10,0.38),_rgba(55,39,10,0.1)_48%,_rgba(55,39,10,0.3))]" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-8 md:py-24">
          <div className="grid min-h-[560px] items-center lg:grid-cols-[1.05fr_0.95fr]">
            <div className="max-w-xl rounded-[2rem] border border-[#d9cdb9] bg-[#f5f1e8]/96 p-8 shadow-[0_30px_60px_-34px_rgba(50,34,11,0.7)] md:p-10">
              <h1 className="font-heading text-4xl font-extrabold leading-tight text-[#79580c] md:text-5xl">
                Harmoni Alam,
                <br />
                Kearifan Lokal.
              </h1>
              <p className="mt-5 text-base leading-8 text-[#746954]">
                Selamat datang di portal resmi Padukuhan Kayen. Kami berkomitmen
                untuk mewujudkan pelayanan publik yang transparan, akuntabel,
                dan berbasis digital demi kesejahteraan seluruh warga.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/profil-desa" className="hero-primary-button">
                  Profil padukuhan
                </Link>
                <Link to="/profil-desa" className="hero-secondary-button">
                  Jelajahi padukuhan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:px-8 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <div className="text-center lg:text-left">
            <h2 className="font-heading text-4xl font-bold text-[#7a5b0a]">
              Visi &amp; Misi
            </h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-[#c59f38] lg:mx-0" />
          </div>
          <div className="mt-12 space-y-5">
            <article className="mission-card mission-card-active">
              <span className="mission-badge">01</span>
              <div>
                <h3 className="font-heading text-xl font-bold text-[#5b4308]">Visi Kami</h3>
                <p className="mt-2 leading-7 text-[#7a6e5a]">
                  Mewujudkan Padukuhan Kayen yang mandiri, agamis, dan sejahtera melalui penguatan
                  ekonomi kerakyatan dan tata kelola pemerintahan yang bersih.
                </p>
              </div>
            </article>
            <article className="mission-card">
              <span className="mission-badge mission-badge-muted">02</span>
              <div>
                <h3 className="font-heading text-xl font-bold text-[#5b4308]">Misi Utama</h3>
                <ul className="mt-2 space-y-2 text-[#7a6e5a]">
                  {missionPoints.map((item) => (
                    <li key={item} className="flex gap-3 leading-7">
                      <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#c59f38]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] border border-[#dccfb8] bg-white p-3 shadow-[0_28px_60px_-36px_rgba(50,34,11,0.8)]">
            <img
              src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80"
              alt="Pertemuan warga di balai padukuhan"
              className="h-[520px] w-full rounded-[1.4rem] object-cover"
            />
          </div>
          <div className="absolute bottom-5 left-5 rounded-2xl bg-[#f4c94b] px-5 py-4 shadow-[0_18px_35px_-25px_rgba(122,91,10,0.9)]">
            <p className="font-heading text-sm font-bold text-[#5e4300]">100%</p>
            <p className="text-xs text-[#6f5311]">Transparansi Dana padukuhan</p>
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="mx-auto max-w-7xl px-4 py-10 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="font-heading text-4xl font-bold text-[#7a5b0a]">Kabar padukuhan Terbaru</h2>
            <p className="mt-2 text-[#7b6e5c]">Informasi terkini mengenai kegiatan dan pengumuman padukuhan.</p>
          </div>
          <Link to="/kabar-padukuhan" className="text-sm font-semibold text-[#7a5b0a]">
            Lihat Semua Berita {"->"}
          </Link>
        </div>

        {loading ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-[380px] rounded-[1.6rem] bg-[#ece8df] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {villageNews.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden rounded-[1.6rem] border border-[#dccfb8] bg-[#fbf8f2] shadow-[0_22px_40px_-34px_rgba(50,34,11,0.8)]"
              >
                <div className="relative h-52">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  <span className="absolute left-4 top-4 rounded-full bg-[#7a5b0a] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                    {item.category}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#b29e7b]">{item.date}</p>
                  <h3 className="mt-3 font-heading text-xl font-bold text-[#45351b]">{item.title}</h3>
                  <p className="mt-3 leading-7 text-[#7a6e5a]">{item.excerpt}</p>
                  <Link to="/kabar-padukuhan" className="mt-5 inline-flex text-sm font-semibold text-[#7a5b0a]">
                    Baca Selengkapnya {"->"}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Stats Section */}
      <section className="mt-16 bg-[#8b6c08] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="text-center">
            <h2 className="font-heading text-4xl font-bold">Statistik padukuhan Tahun 2024</h2>
            <p className="mt-3 text-white/80">Data kependudukan dan geografis Padukuhan Kayen secara real-time.</p>
          </div>
          {loading ? (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-28 rounded-[1.4rem] bg-white/10 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {villageStats.map((stat) => (
                <div key={stat.label} className="rounded-[1.4rem] border border-white/20 bg-white/10 px-6 py-8 text-center">
                  <p className="font-heading text-4xl font-extrabold">{stat.value}</p>
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-white/75">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="rounded-[2rem] bg-[#ece8df] px-6 py-12 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] md:px-12">
          <h2 className="font-heading text-4xl font-bold text-[#7a5b0a]">Butuh Informasi Lebih Lanjut?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-8 text-[#7b6e5c]">
            Kami siap melayani Anda. Hubungi kantor padukuhan atau akses pusat bantuan kami untuk
            pertanyaan seputar layanan publik dan administrasi.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/profil-desa" className="hero-primary-button">Hubungi Kami Sekarang</Link>
            <Link to="/profil-desa" className="hero-secondary-button">Pusat Bantuan</Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
