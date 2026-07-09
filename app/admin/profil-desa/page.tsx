import type { Metadata } from "next";
import { requireAdminUser } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/admin-data";
import { AdminProfilePage } from "../_components/admin-profile-page";

export const metadata: Metadata = {
  title: "Kelola Profil Desa | Admin Panel",
  description: "Halaman admin untuk mengelola statistik profil, aparatur desa, dan batas wilayah.",
};

export const dynamic = "force-dynamic";

type AdminProfileRouteProps = {
  searchParams: Promise<{
    status?: string | string[];
    message?: string | string[];
  }>;
};

function getFirstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminProfileRoute({
  searchParams,
}: AdminProfileRouteProps) {
  const currentAdmin = await requireAdminUser();
  const data = await getAdminDashboardData();
  const resolvedSearchParams = await searchParams;

  return (
    <AdminProfilePage
      currentAdmin={currentAdmin}
      data={data}
      status={getFirstQueryValue(resolvedSearchParams.status)}
      message={getFirstQueryValue(resolvedSearchParams.message)}
    />
  );
}
