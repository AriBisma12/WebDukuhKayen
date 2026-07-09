import type { AdminSessionUser } from "@/lib/admin-auth";
import type { AdminDashboardData } from "@/lib/admin-data";
import Link from "next/link";
import { AdminMobileMenu } from "./admin-mobile-menu";
import { AdminSidebar } from "./admin-sidebar";

type AdminOverviewProps = {
  currentAdmin: AdminSessionUser;
  data: AdminDashboardData;
  status?: string;
  message?: string;
};

function formatAdminDate(dateValue: string | null | undefined) {
  if (!dateValue) {
    return "-";
  }

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function MessageBanner({ status, message }: { status?: string; message?: string }) {
  if (!message) {
    return null;
  }

  const isError = status === "error";

  return (
    <div
      className={`rounded-[1.15rem] border px-4 py-4 text-sm leading-7 sm:px-5 ${
        isError
          ? "border-[#ebc7c7] bg-[#fff4f4] text-[#9d3333]"
          : "border-[#d9dfc6] bg-[#f5faea] text-[#476224]"
      }`}
    >
      {message}
    </div>
  );
}

function DashboardIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function NewsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 5h16v14H4z" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  );
}

function GalleryIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="2" />
      <path d="m21 16-5-5-7 7" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.91 4.6H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.7 0 1.33.4 1.6 1.03.12.3.19.63.19.97s-.07.67-.19.97c-.27.63-.9 1.03-1.6 1.03Z" />
    </svg>
  );
}

function DashboardStatCard({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.25rem] border border-[#decfae] bg-white p-4 shadow-[0_18px_30px_-24px_rgba(117,91,14,0.24)] sm:rounded-[1.45rem] sm:p-5">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fbf1d8] text-sm font-black text-[#907100]">
          []
        </div>
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] text-[#766c59]">
        {label}
      </p>
      <p className="mt-2 font-heading text-[1.75rem] font-extrabold text-[#8a6c00] sm:text-[2.1rem]">
        {value}
      </p>
    </div>
  );
}

function ActivityTable({ data }: { data: AdminDashboardData }) {
  const latestNews = data.news[0];
  const latestDocumentation = data.documentationPosts[0] ?? data.documentationVideos[0];

  const rows = [
    latestNews
      ? {
          title: latestNews.judul,
          detail: `Kategori: ${latestNews.kategori}`,
          time: formatAdminDate(latestNews.tanggal_terbit),
        }
      : null,
    latestDocumentation
      ? {
          title: latestDocumentation.judul,
          detail:
            "foto_dokumentasi" in latestDocumentation
              ? "Dokumentasi kegiatan terbaru"
              : "Video dokumentasi terbaru",
          time: formatAdminDate(
            "tanggal_terbit" in latestDocumentation ? latestDocumentation.tanggal_terbit : null,
          ),
        }
      : null,
  ].filter(Boolean) as Array<{
    title: string;
    detail: string;
    time: string;
  }>;

  const fallbackRows =
    rows.length > 0
      ? rows
      : [
          {
            title: "Belum ada aktivitas konten",
            detail: "Tambahkan berita atau dokumentasi pertama dari panel admin",
            time: "-",
          },
        ];

  return (
    <section className="rounded-[1.25rem] border border-[#decfae] bg-white p-4 shadow-[0_20px_34px_-28px_rgba(117,91,14,0.24)] sm:rounded-[1.6rem] sm:px-6 sm:py-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-heading text-[1.2rem] font-bold text-[#8a6c00] sm:text-[1.6rem]">
          Aktivitas Terbaru
        </h2>
        <Link href="/admin/berita" className="text-sm font-semibold text-[#8a6c00] sm:text-base">
          Lihat Semua
        </Link>
      </div>

      <div className="mt-5 hidden overflow-x-auto md:block">
        <table className="w-full min-w-[680px] text-left">
          <thead className="text-xs uppercase tracking-[0.08em] text-[#716653]">
            <tr>
              <th className="border-b border-[#e5d8bc] px-4 py-4 font-semibold">Aktivitas</th>
              <th className="border-b border-[#e5d8bc] px-4 py-4 font-semibold">Waktu</th>
              <th className="border-b border-[#e5d8bc] px-4 py-4 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f1e7d5]">
            {fallbackRows.map((row) => (
              <tr key={`${row.title}-${row.time}`}>
                <td className="px-4 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#ffd34d] text-sm font-black text-white">
                      ::
                    </div>
                    <div>
                      <p className="text-base font-medium leading-tight text-[#4e473c]">{row.title}</p>
                      <p className="mt-1 text-sm text-[#887e6c]">{row.detail}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 text-sm text-[#6f6556]">{row.time}</td>
                <td className="px-4 py-5 text-xl text-[#7c725f]">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 grid gap-4 md:hidden">
        {fallbackRows.map((row) => (
          <div key={`${row.title}-${row.time}`} className="rounded-[1.1rem] border border-[#eee2c6] bg-[#fffdf8] p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffd34d] text-xs font-black text-white">
                ::
              </div>
              <div className="min-w-0">
                <p className="text-base font-semibold leading-tight text-[#4e473c]">{row.title}</p>
                <p className="mt-1 text-sm leading-6 text-[#887e6c]">{row.detail}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-3 text-sm">
              <span className="text-[#6f6556]">{row.time}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function SideInfo({ data }: { data: AdminDashboardData }) {
  const documentationTotal = data.documentationPosts.length + data.documentationVideos.length;
  const activeAdmin = data.adminUsers.filter((item) => item.is_active).length;
  const totalAdmin = data.adminUsers.length;

  const statusItems = [
    {
      label: "Berita",
      value: `${data.news.length} item`,
      width: data.news.length > 0 ? `${Math.min(100, Math.max(12, data.news.length * 12))}%` : "0%",
      color: "#8a6c00",
    },
    {
      label: "Dokumentasi",
      value: `${documentationTotal} media`,
      width:
        documentationTotal > 0
          ? `${Math.min(100, Math.max(12, documentationTotal * 10))}%`
          : "0%",
      color: "#b18a06",
    },
    {
      label: "Admin Aktif",
      value: `${activeAdmin}/${totalAdmin}`,
      width: totalAdmin > 0 ? `${Math.round((activeAdmin / totalAdmin) * 100)}%` : "0%",
      color: "#cf2b2b",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[1.25rem] bg-[#8a6c00] p-5 text-white shadow-[0_22px_36px_-26px_rgba(117,91,14,0.65)] sm:rounded-[1.6rem] sm:p-6">
        <div className="relative z-10">
          <h3 className="font-heading text-[1.45rem] font-bold sm:text-[1.85rem]">Informasi Kayen</h3>
          <p className="mt-4 text-sm leading-7 text-[#f8efd6] sm:text-base sm:leading-8">
            Pastikan seluruh data publik portal Padukuhan Kayen sudah diverifikasi sebelum dipublikasikan kepada warga.
          </p>
          <Link href="/admin/profil-desa" className="mt-6 inline-flex text-sm font-bold text-white sm:text-base">
            Cek Data Sekarang
          </Link>
        </div>
        <div className="pointer-events-none absolute -bottom-5 -right-3 text-[6rem] font-black text-white/10">
          ()
        </div>
      </section>

      <section className="rounded-[1.25rem] border border-[#decfae] bg-white p-5 shadow-[0_20px_34px_-28px_rgba(117,91,14,0.24)] sm:rounded-[1.6rem] sm:p-6">
        <h3 className="font-heading text-[1.4rem] font-bold text-[#8a6c00] sm:text-[1.75rem]">Status Layanan</h3>
        <div className="mt-5 space-y-5">
          {statusItems.map((item) => (
            <div key={item.label}>
              <div className="mb-2 flex items-center justify-between gap-3 text-sm sm:text-[1rem]">
                <span className="font-medium text-[#776c58]">{item.label}</span>
                <span className="font-bold text-[#8a6c00]">{item.value}</span>
              </div>
              <div className="h-3 rounded-full bg-[#ececec]">
                <div className="h-3 rounded-full" style={{ width: item.width, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export function AdminOverview({
  currentAdmin,
  data,
  status,
  message,
}: AdminOverviewProps) {
  const documentationTotal = data.documentationPosts.length + data.documentationVideos.length;
  const sidebarItems = [
    { key: "dashboard", href: "/admin", label: "Dashboard Overview", icon: <DashboardIcon /> },
    { key: "berita", href: "/admin/berita", label: "Kelola Berita", icon: <NewsIcon /> },
    {
      key: "dokumentasi",
      href: "/admin/dokumentasi",
      label: "Kelola Dokumentasi",
      icon: <GalleryIcon />,
    },
    { key: "pengaturan", href: "/admin/profil-desa", label: "Pengaturan", icon: <SettingsIcon /> },
  ] as const;

  return (
    <main className="min-h-screen bg-[#fcfbf8] text-[#1f1b13]">
      <AdminSidebar active="dashboard" items={sidebarItems} />

      <div className="lg:ml-[18rem]">
        <header className="sticky top-0 z-30 border-b border-[#decfae] bg-[#fcfbf8]/95 backdrop-blur">
          <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between lg:px-9">
            <h2 className="font-heading text-[1.55rem] font-bold text-[#8a6c00] sm:text-[1.9rem]">
              Admin Dashboard
            </h2>
            <div className="flex items-center gap-3">
              <div className="hidden min-w-[18rem] items-center gap-3 rounded-full bg-[#f5f2eb] px-4 py-3 text-[#8d8778] lg:flex">
                <span className="text-[1rem]">Cari data...</span>
              </div>
              <div className="rounded-full border border-[#decfae] bg-white px-4 py-2 text-sm font-semibold text-[#6e6454]">
                {currentAdmin.displayName}
              </div>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-5 sm:py-8 lg:px-9">
          <MessageBanner status={status} message={message} />

          <div className="mt-4">
            <AdminMobileMenu active="dashboard" />
          </div>

          <section className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#8a8373]">Dashboard &gt; Overview</p>
              <h1 className="mt-2 font-heading text-[1.9rem] font-bold leading-tight text-[#8a6c00] sm:text-[2.35rem]">
                Ringkasan Admin Padukuhan Kayen
              </h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-[#6f695c] sm:text-base sm:leading-8">
                Pantau statistik utama, aktivitas konten terbaru, dan status layanan publik dalam satu tampilan yang ringkas.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
              <Link
                href="/admin/berita"
                className="inline-flex min-h-[3.1rem] items-center justify-center rounded-[1rem] bg-[#8a6c00] px-5 text-sm font-bold text-white"
              >
                Buat Berita Baru
              </Link>
              <Link
                href="/admin/dokumentasi"
                className="inline-flex min-h-[3.1rem] items-center justify-center rounded-[1rem] border border-[#bcae84] bg-white px-5 text-sm font-bold text-[#6a5715]"
              >
                Tambah Dokumentasi
              </Link>
            </div>
          </section>

          <section className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-3">
            <DashboardStatCard
              label="Tautan Navigasi"
              value={String(data.navigation.length)}
            />
            <DashboardStatCard label="Berita Baru" value={String(data.news.length)} />
            <DashboardStatCard label="Galeri Update" value={String(documentationTotal)} />
          </section>

          <section className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
            <ActivityTable data={data} />
            <SideInfo data={data} />
          </section>
        </div>
      </div>
    </main>
  );
}
