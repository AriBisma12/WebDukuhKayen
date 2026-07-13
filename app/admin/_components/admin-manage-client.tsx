"use client";

import { useSearchParams } from "@/lib/react-router";
import { AdminManagePage } from "./admin-manage-page";
import {
  AdminErrorScreen,
  AdminLoadingScreen,
  useAdminPageData,
} from "./admin-client-shared";

export function AdminManageClient({ type }: { type: "berita" | "dokumentasi" }) {
  const searchParams = useSearchParams();
  const { currentAdmin, data, error, loading } = useAdminPageData();

  if (loading) {
    return <AdminLoadingScreen />;
  }

  if (error || !currentAdmin || !data) {
    return <AdminErrorScreen message={error ?? "Sesi admin tidak tersedia."} />;
  }

  return type === "berita" ? (
    <AdminManagePage
      currentAdmin={currentAdmin}
      data={data}
      type="berita"
      items={data.news}
      status={searchParams.get("status") ?? undefined}
      message={searchParams.get("message") ?? undefined}
    />
  ) : (
    <AdminManagePage
      currentAdmin={currentAdmin}
      data={data}
      type="dokumentasi"
      items={[...data.documentationPosts, ...data.documentationVideos]}
      status={searchParams.get("status") ?? undefined}
      message={searchParams.get("message") ?? undefined}
    />
  );
}
