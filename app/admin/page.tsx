import type { Metadata } from "next";
import { requireAdminUser } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/admin-data";
import { AdminDashboard } from "./_components/admin-dashboard";

export const metadata: Metadata = {
  title: "Admin Panel | Portal Padukuhan Sejahtera",
  description: "Panel admin untuk login dan mengelola data portal Padukuhan Sejahtera.",
};

export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{
    status?: string | string[];
    message?: string | string[];
  }>;
};

function getFirstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const currentAdmin = await requireAdminUser();
  const dashboardData = await getAdminDashboardData();
  const resolvedSearchParams = await searchParams;

  return (
    <AdminDashboard
      currentAdmin={currentAdmin}
      data={dashboardData}
      status={getFirstQueryValue(resolvedSearchParams.status)}
      message={getFirstQueryValue(resolvedSearchParams.message)}
    />
  );
}
