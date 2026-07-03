import Link from "next/link";
import { getNavigationLinks } from "@/lib/site-content";

export async function SiteFooter() {
  const navigation = await getNavigationLinks();

  return (
    <footer
      id="kontak-Padukuhan"
      className="mt-16 border-t border-[#ddd3c2] bg-[#ece8df] text-[#6d624f]"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 md:px-8">
        <div>
          <h3 className="font-heading text-2xl font-bold text-[#49381b]">
            Padukuhan Sejahtera
          </h3>
          <p className="mt-4 max-w-sm leading-7">
            Portal informasi resmi Pemerintah Padukuhan Sejahtera, Kecamatan Teladan,
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
            <p>Jl. Raya Utama No. 01, Padukuhan Sejahtera, 12435</p>
            <p>kontak@Padukuhansejahtera.go.id</p>
            <p>(021) 555-0123</p>
          </div>
        </div>
      </div>

      <div className="border-t border-[#ddd3c2]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-5 text-sm md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2024 Pemerintah Padukuhan Sejahtera. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex gap-5">
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
