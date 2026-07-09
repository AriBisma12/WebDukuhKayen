"use client";

import Link from "next/link";
import { useState } from "react";

type NavigationItem = {
  label: string;
  href: string;
};

type SiteHeaderShellProps = {
  currentPath: string;
  navigation: NavigationItem[];
};

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-5">
      <span
        className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-[7px] rounded-full bg-[#5d4405] transition ${
          open ? "translate-y-0 rotate-45" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-1/2 h-0.5 w-5 -translate-y-1/2 rounded-full bg-[#5d4405] transition ${
          open ? "opacity-0" : ""
        }`}
      />
      <span
        className={`absolute left-0 top-1/2 h-0.5 w-5 translate-y-[6px] rounded-full bg-[#5d4405] transition ${
          open ? "translate-y-0 -rotate-45" : ""
        }`}
      />
    </span>
  );
}

export function SiteHeaderShell({
  navigation,
  currentPath,
}: SiteHeaderShellProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#d9d0be] bg-[#f7f3ea]/95 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-8">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="font-heading text-lg font-bold text-[#3f2d11] sm:text-xl">
            Padukuhan Kayen
          </Link>

          <nav className="hidden items-center gap-7 text-sm text-[#7b6b55] md:flex">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`transition hover:text-[#7a5b0a] ${
                    isActive ? "font-semibold text-[#7a5b0a]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/admin/login"
              className="rounded-xl border border-[#d2c3a5] px-4 py-2 text-xs font-semibold text-[#7a5b0a] transition hover:bg-[#f2eadb]"
            >
              Login
            </Link>
            <Link
              href="/profil-desa#kontak-padukuhan"
              className="rounded-xl bg-[#7a5b0a] px-4 py-2 text-xs font-semibold !text-white shadow-[0_10px_25px_-18px_rgba(122,91,10,0.9)] transition hover:bg-[#614808] hover:!text-white"
            >
              Kontak Kami
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Link
              href="/profil-desa#kontak-padukuhan"
              className="rounded-xl bg-[#7a5b0a] px-4 py-2 text-xs font-semibold !text-white shadow-[0_10px_25px_-18px_rgba(122,91,10,0.9)] transition hover:bg-[#614808] hover:!text-white"
            >
              Kontak Kami
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8ceb9] bg-white shadow-[0_10px_25px_-18px_rgba(122,91,10,0.45)]"
            >
              <MenuIcon open={menuOpen} />
            </button>
          </div>
        </div>

        {menuOpen ? (
          <div className="mt-4 rounded-[1.4rem] border border-[#ddd1bf] bg-white p-4 shadow-[0_24px_45px_-30px_rgba(52,37,13,0.42)] md:hidden">
            <nav className="flex flex-col gap-2">
              {navigation.map((item) => {
                const isActive = currentPath === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-[#f4e7c5] text-[#7a5b0a]"
                        : "text-[#6d604d] hover:bg-[#f8f3e8]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link
                href="/admin/login"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-xl border border-[#d2c3a5] px-4 py-3 text-center text-sm font-semibold text-[#7a5b0a] transition hover:bg-[#f2eadb]"
              >
                Login
              </Link>
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
