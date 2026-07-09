import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAdminAction } from "../actions";

type AdminSidebarProps = {
  active: "dashboard" | "berita" | "dokumentasi" | "pengaturan";
  items: Array<{
    key: "dashboard" | "berita" | "dokumentasi" | "pengaturan";
    href: string;
    label: string;
    icon?: ReactNode;
  }>;
};

export function AdminSidebar({ active, items }: AdminSidebarProps) {
  return (
    <aside className="fixed inset-y-0 left-0 hidden w-[18rem] flex-col border-r border-[#decfae] bg-[#f8f6f1] px-5 py-6 lg:flex">
      <div>
        <h1 className="font-heading text-[1.7rem] font-extrabold text-[#8a6c00]">
          Padukuhan Kayen
        </h1>
        <p className="mt-1 text-sm text-[#8b816f]">Village Admin Panel</p>
      </div>

      <nav className="mt-10 space-y-3">
        {items.map((item) => {
          const isActive = item.key === active;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-[1.15rem] px-4 py-3 text-[1rem] font-semibold transition ${
                isActive
                  ? "bg-[#8a6c00] text-white shadow-[0_14px_24px_-20px_rgba(117,91,14,0.72)]"
                  : "text-[#5f5749] hover:bg-[#f1ece2]"
              }`}
            >
              {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-[#decfae] pt-6">
        <form action={logoutAdminAction}>
          <button
            type="submit"
            className="flex items-center gap-3 text-[1rem] font-semibold text-[#5f5749] transition hover:text-[#8a6c00]"
          >
            <span className="shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <path d="m16 17 5-5-5-5" />
                <path d="M21 12H9" />
              </svg>
            </span>
            <span>Logout</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
