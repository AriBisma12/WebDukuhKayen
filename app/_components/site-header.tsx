import Link from "next/link";
import { getNavigationLinks } from "@/lib/site-content";

type SiteHeaderProps = {
  currentPath?: string;
};

export async function SiteHeader({ currentPath = "/" }: SiteHeaderProps) {
  const navigation = await getNavigationLinks();

  return (
    <header className="sticky top-0 z-50 border-b border-[#d9d0be] bg-[#f7f3ea]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-8">
        <Link href="/" className="font-heading text-lg font-bold text-[#3f2d11]">
          Desa Sejahtera
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

        <Link
          href="/profil-desa#kontak-desa"
          className="rounded-xl bg-[#7a5b0a] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_25px_-18px_rgba(122,91,10,0.9)] transition hover:bg-[#614808]"
        >
          Kontak Kami
        </Link>
      </div>
    </header>
  );
}
