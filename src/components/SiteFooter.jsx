import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { navigation, siteSectionDefaults } from '../data/site';
import { getSiteSectionContent } from '../lib/siteContent';

export function SiteFooter() {
  const [footerContact, setFooterContact] = useState(siteSectionDefaults.footer_contact);

  useEffect(() => {
    async function fetchFooterContact() {
      const sections = await getSiteSectionContent();
      setFooterContact(sections.footer_contact || siteSectionDefaults.footer_contact);
    }

    fetchFooterContact();
  }, []);

  const normalizedPhone = (footerContact.phone || '').replace(/\D/g, '').replace(/^0/, '');
  const whatsappNumber = normalizedPhone ? `62${normalizedPhone}` : '';
  const whatsappMessage = encodeURIComponent(
    "Halo, saya ingin menghubungi penanggung jawab Padukuhan Kayen."
  );
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : '#';

  return (
    <footer
      id="kontak-padukuhan"
      className="mt-16 border-t border-[#ddd3c2] bg-[#ece8df] text-[#6d624f]"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 md:px-8 md:py-14">
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
                to={item.href}
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
            <p>{footerContact.address}</p>
            <p>{footerContact.email}</p>
            <a
              id="nomor-telepon-padukuhan"
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="block font-semibold text-[#7a5b0a] hover:text-[#5f4506]"
            >
              {footerContact.phone_label}: {footerContact.phone}
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-[#ddd3c2]">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-sm sm:px-6 md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2024 Pemerintah Padukuhan Kayen. Seluruh Hak Cipta Dilindungi.</p>
          <div className="flex flex-wrap gap-4 md:gap-5">
            <a href="#">Kebijakan Privasi</a>
            <a href="#">Syarat &amp; Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
