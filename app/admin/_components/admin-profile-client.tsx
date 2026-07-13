"use client";

import { useSearchParams } from "@/lib/react-router";
import { AdminProfilePage } from "./admin-profile-page";
import {
  AdminErrorScreen,
  AdminLoadingScreen,
  useAdminPageData,
} from "./admin-client-shared";

export function AdminProfileClient() {
  const searchParams = useSearchParams();
  const { currentAdmin, data, error, loading } = useAdminPageData();

  if (loading) {
    return <AdminLoadingScreen />;
  }

  if (error || !currentAdmin || !data) {
    return <AdminErrorScreen message={error ?? "Sesi admin tidak tersedia."} />;
  }

  return (
    <AdminProfilePage
      currentAdmin={currentAdmin}
      data={data}
      status={searchParams.get("status") ?? undefined}
      message={searchParams.get("message") ?? undefined}
    />
  );
}
