import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigation } from '../data/site';

export function SiteHeader() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  const handleContactClick = (event) => {
    event.preventDefault();

    if (location.pathname === '/profil-desa') {
      const el = document.getElementById('kontak-padukuhan');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    navigate('/profil-desa#kontak-padukuhan');
  };

  const navLinkClass = (isActive) =>
    `transition hover:text-[#7a5b0a] ${
      isActive ? 'font-semibold text-[#7a5b0a]' : ''
    }`;

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
                className={navLinkClass(isActive)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/admin/login"
            className="rounded-xl border border-[#d7c6a7] bg-white/70 px-4 py-2 text-xs font-semibold text-[#6c5220] transition hover:border-[#b99649] hover:text-[#7a5b0a]"
          >
            Login
          </Link>
          <a
            href="#/profil-desa#kontak-padukuhan"
            onClick={handleContactClick}
            className="rounded-xl bg-[#7a5b0a] px-4 py-2 text-xs font-semibold !text-white shadow-[0_10px_25px_-18px_rgba(122,91,10,0.9)] transition hover:bg-[#614808] hover:!text-white"
          >
            Kontak Kami
          </a>
        </div>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#d7c6a7] bg-white/80 text-[#6c5220] md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label="Buka menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="text-lg font-bold">{isMobileMenuOpen ? 'X' : '='}</span>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="border-t border-[#e1d6c3] bg-[#fbf8f2] px-4 py-4 md:hidden">
          <nav className="space-y-1 text-sm text-[#7b6b55]">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`block rounded-xl px-4 py-3 ${navLinkClass(isActive)} ${
                    isActive ? 'bg-[#efe6d6]' : 'hover:bg-[#f1ebdf]'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/admin/login"
              className="block rounded-xl border border-[#d7c6a7] bg-white px-4 py-3 font-semibold text-[#6c5220]"
            >
              Login Admin
            </Link>
            <a
              href="#/profil-desa#kontak-padukuhan"
              onClick={handleContactClick}
              className="block rounded-xl bg-[#7a5b0a] px-4 py-3 text-center font-semibold text-white"
            >
              Kontak Kami
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
