import { useEffect, useState } from "react";
import { Link } from "@/lib/react-router";
import { navigation as fallbackNavigation, type NavigationLink } from "@/app/_data/site";
import { getNavigationLinks } from "@/lib/site-content";

export function SiteFooter() {
  const [navigation, setNavigation] = useState<NavigationLink[]>(fallbackNavigation);

  useEffect(() => {
    let mounted = true;
    void getNavigationLinks().then((items) => {
      if (mounted) {
        setNavigation(items);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer
      id="kontak-padukuhan"
      className="mt-16 border-t border-[#ddd3c2] bg-[#ece8df] text-[#6d624f]"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 md:px-8">
        <div>
          <h3 className="font-heading text-2xl font-bold text-[#49381b]">
            Padukuhan Kayen
          </h3>
          <p className="mt-4 max-w-sm leading-7">
            Portal informasi resmi Pemerintah Padukuhan Kayen, Kecamatan Teladan,
            Kabupaten Makmur. Berkomitmen untuk kemajuan dan transparansi Padukuhan.
          </p>
          <div className="mt-5 flex gap-3">
            <span className="footer-social">ig</span>
            <span className="footer-social">yt</span>
            <span className="footer-social">fb</span>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#49381b]">Tautan Cepat</h4>
          <div className="mt-4 space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block hover:text-[#7a5b0a]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#49381b]">Kontak Resmi</h4>
          <div className="mt-4 space-y-3 leading-7">
            <p>Jl. Raya Utama No. 01, Padukuhan Kayen, 12435</p>
            <p>kontak@padukuhankayen.go.id</p>
            <p>(021) 555-0123</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#ddd3c2]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm md:flex-row md:items-center md:justify-between md:px-8">
          <p>Copyright 2024 Pemerintah Padukuhan Kayen. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex gap-5">
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
