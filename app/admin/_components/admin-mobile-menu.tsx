"use client";

import { Link } from "@/lib/react-router";
import { useState } from "react";

type AdminMobileMenuProps = {
  active: "dashboard" | "berita" | "dokumentasi" | "pengaturan";
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

export function AdminMobileMenu({ active }: AdminMobileMenuProps) {
  const [open, setOpen] = useState(false);

  const items = [
    { href: "/admin/", label: "Dashboard", key: "dashboard" },
    { href: "/admin/berita/", label: "Berita", key: "berita" },
    { href: "/admin/dokumentasi/", label: "Dokumentasi", key: "dokumentasi" },
    { href: "/admin/profil-desa/", label: "Pengaturan", key: "pengaturan" },
  ] as const;

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Tutup menu admin" : "Buka menu admin"}
        aria-expanded={open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#d8ceb9] bg-white shadow-[0_10px_25px_-18px_rgba(122,91,10,0.45)]"
      >
        <MenuIcon open={open} />
      </button>

      {open ? (
        <div className="mt-4 rounded-[1.4rem] border border-[#ddd1bf] bg-white p-4 shadow-[0_24px_45px_-30px_rgba(52,37,13,0.42)]">
          <nav className="flex flex-col gap-2">
            {items.map((item) => {
              const isActive = item.key === active;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-[#8a6c00] text-white"
                      : "text-[#6d604d] hover:bg-[#f8f3e8]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      ) : null}
    </div>
  );
}
