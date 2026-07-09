import type { Metadata } from "next";
import { requireAdminUser } from "@/lib/admin-auth";
import { getAdminDashboardData } from "@/lib/admin-data";
import { AdminManagePage } from "../_components/admin-manage-page";

export const metadata: Metadata = {
  title: "Kelola Dokumentasi | Admin Panel",
  description: "Halaman admin untuk melihat ringkasan dokumentasi foto dan video.",
};

export const dynamic = "force-dynamic";

type AdminDocumentationRouteProps = {
  searchParams: Promise<{
    status?: string | string[];
    message?: string | string[];
  }>;
};

function getFirstQueryValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDocumentationRoute({
  searchParams,
}: AdminDocumentationRouteProps) {
  const currentAdmin = await requireAdminUser();
  const data = await getAdminDashboardData();
  const resolvedSearchParams = await searchParams;

  return (
    <AdminManagePage
      currentAdmin={currentAdmin}
      data={data}
      type="dokumentasi"
      items={[...data.documentationPosts, ...data.documentationVideos]}
      status={getFirstQueryValue(resolvedSearchParams.status)}
      message={getFirstQueryValue(resolvedSearchParams.message)}
    />
  );
}
