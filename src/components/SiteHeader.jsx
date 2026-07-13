import { Link, useLocation } from 'react-router-dom';
import { navigation } from '../data/site';

export function SiteHeader() {
  const location = useLocation();
  const currentPath = location.pathname;

  const whatsappNumber = "6281353857853";
  const whatsappMessage = encodeURIComponent(
    "Halo, saya ingin menghubungi penanggung jawab Padukuhan Kayen."
  );

  return (
    <header className="sticky top-0 z-50 border-b border-[#d9d0be] bg-[#f7f3ea]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link to="/" className="font-heading text-lg font-bold text-[#3f2d11]">
          Padukuhan Kayen
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-[#7b6b55] md:flex">
          {navigation.map((item) => {
            const isActive = currentPath === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`transition hover:text-[#7a5b0a] ${
                  isActive ? "font-semibold text-[#7a5b0a]" : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <a
          href={`/profil-desa#kontak-padukuhan`}
          onClick={(e) => {
            // Handle anchor link in SPA context
            e.preventDefault();
            const el = document.getElementById('kontak-padukuhan');
            if (el) {
              el.scrollIntoView({ behavior: 'smooth' });
            } else {
              window.location.href = '/profil-desa#kontak-padukuhan';
            }
          }}
          className="rounded-xl bg-[#7a5b0a] px-4 py-2 text-xs font-semibold !text-white shadow-[0_10px_25px_-18px_rgba(122,91,10,0.9)] transition hover:bg-[#614808] hover:!text-white"
        >
          Kontak Kami
        </a>
      </div>
    </header>
  );
}
