import { useEffect } from "react";
import AdminNewsRoute from "@/app/admin/berita/page";
import AdminDocumentationRoute from "@/app/admin/dokumentasi/page";
import AdminLoginPage from "@/app/admin/login/page";
import AdminPage from "@/app/admin/page";
import AdminProfileRoute from "@/app/admin/profil-desa/page";
import DocumentationPage from "@/app/dokumentasi-kegiatan/page";
import NewsPage from "@/app/kabar-padukuhan/page";
import HomePage from "@/app/page";
import ProfilePage from "@/app/profil-desa/page";
import { Link, usePathname } from "@/lib/react-router";

const pageTitles: Record<string, string> = {
  "/": "Portal Padukuhan Kayen",
  "/profil-desa": "Profil Desa | Portal Padukuhan Kayen",
  "/kabar-padukuhan": "Kabar Padukuhan | Portal Padukuhan Kayen",
  "/dokumentasi-kegiatan": "Dokumentasi Kegiatan | Portal Padukuhan Kayen",
  "/admin": "Admin Panel | Portal Padukuhan Kayen",
  "/admin/login": "Login Admin | Portal Padukuhan Kayen",
  "/admin/berita": "Kelola Berita | Admin Panel",
  "/admin/dokumentasi": "Kelola Dokumentasi | Admin Panel",
  "/admin/profil-desa": "Kelola Profil Desa | Admin Panel",
};

function normalizePathname(pathname: string) {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }

  return pathname;
}

function NotFoundPage() {
  return (
    <main className="min-h-screen bg-[#fffdf4] px-4 py-16 text-[#2f2615]">
      <section className="mx-auto max-w-2xl rounded-[2rem] border border-[#ead8b6] bg-white p-8 text-center shadow-[0_24px_60px_-42px_rgba(67,48,15,0.55)]">
        <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#8b6c08]">
          Halaman tidak ditemukan
        </p>
        <h1 className="mt-4 font-heading text-4xl font-black text-[#3f2f08]">
          Rute ini belum tersedia
        </h1>
        <p className="mt-4 leading-8 text-[#6d5c39]">
          Alamat yang dibuka tidak cocok dengan halaman portal Padukuhan Kayen.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-[#7a5b0a] px-6 py-3 font-bold text-white transition hover:bg-[#5f4707]"
        >
          Kembali ke beranda
        </Link>
      </section>
    </main>
  );
}

export default function App() {
  const pathname = normalizePathname(usePathname());

  useEffect(() => {
    document.title = pageTitles[pathname] ?? "Portal Padukuhan Kayen";
  }, [pathname]);

  switch (pathname) {
    case "/":
      return <HomePage />;
    case "/profil-desa":
      return <ProfilePage />;
    case "/kabar-padukuhan":
      return <NewsPage />;
    case "/dokumentasi-kegiatan":
      return <DocumentationPage />;
    case "/admin":
      return <AdminPage />;
    case "/admin/login":
      return <AdminLoginPage />;
    case "/admin/berita":
      return <AdminNewsRoute />;
    case "/admin/dokumentasi":
      return <AdminDocumentationRoute />;
    case "/admin/profil-desa":
      return <AdminProfileRoute />;
    default:
      return <NotFoundPage />;
  }
}
