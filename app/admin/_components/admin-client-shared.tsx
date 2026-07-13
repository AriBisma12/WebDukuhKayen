"use client";

import { useEffect, useState, useTransition, type FormEvent } from "react";
import { usePathname, useRouter, useSearchParams } from "@/lib/react-router";
import type { AdminDashboardData, AdminSessionUser } from "@/lib/admin-types";
import {
  deleteAdminRecord,
  getAdminDashboardData,
  getCurrentAdminUser,
  saveAdminRecord,
  signOutAdmin,
} from "@/lib/admin-client";

export function buildAdminRedirectUrl(
  path: string,
  status: "success" | "error",
  message: string,
) {
  const params = new URLSearchParams({ status, message });
  return `${path}?${params.toString()}`;
}

type AdminLoaderState = {
  currentAdmin: AdminSessionUser | null;
  data: AdminDashboardData | null;
  error: string | null;
  loading: boolean;
};

export function useAdminPageData() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<AdminLoaderState>({
    currentAdmin: null,
    data: null,
    error: null,
    loading: true,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadAdminPage() {
      try {
        const currentAdmin = await getCurrentAdminUser();
        if (!currentAdmin) {
          router.replace("/admin/login/");
          return;
        }

        const data = await getAdminDashboardData();
        if (!isMounted) {
          return;
        }

        setState({
          currentAdmin,
          data,
          error: null,
          loading: false,
        });
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setState({
          currentAdmin: null,
          data: null,
          error: error instanceof Error ? error.message : "Gagal memuat panel admin.",
          loading: false,
        });
      }
    }

    setState((previousState) => ({
      ...previousState,
      loading: true,
      error: null,
    }));
    void loadAdminPage();

    return () => {
      isMounted = false;
    };
  }, [pathname, router, searchParams]);

  return state;
}

export function useAdminMutationHandlers() {
  const router = useRouter();
  const [, startTransition] = useTransition();

  function handleSaveSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const redirectTarget = (formData.get("redirect_to") as string) || "/admin/";

    startTransition(async () => {
      try {
        const message = await saveAdminRecord(formData);
        router.replace(buildAdminRedirectUrl(redirectTarget, "success", message));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Gagal menyimpan data.";
        router.replace(buildAdminRedirectUrl(redirectTarget, "error", message));
      }
    });
  }

  function handleDeleteSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const redirectTarget = (formData.get("redirect_to") as string) || "/admin/";

    startTransition(async () => {
      try {
        const message = await deleteAdminRecord(formData);
        router.replace(buildAdminRedirectUrl(redirectTarget, "success", message));
      } catch (error) {
        const message = error instanceof Error ? error.message : "Gagal menghapus data.";
        router.replace(buildAdminRedirectUrl(redirectTarget, "error", message));
      }
    });
  }

  async function logout() {
    try {
      await signOutAdmin();
      router.replace(buildAdminRedirectUrl("/admin/login/", "success", "Anda sudah logout."));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal logout.";
      router.replace(buildAdminRedirectUrl("/admin/login/", "error", message));
    }
  }

  return {
    handleSaveSubmit,
    handleDeleteSubmit,
    logout,
  };
}

export function AdminLoadingScreen() {
  return (
    <main className="min-h-screen bg-[#fcfbf8] px-4 py-10 text-[#3d2f18] md:px-8">
      <div className="mx-auto max-w-[760px] rounded-[2rem] border border-[#decfae] bg-white p-8 shadow-[0_22px_45px_-34px_rgba(95,70,17,0.32)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8b6c08]">
          Admin Panel
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-[#4d3906]">
          Memuat data admin
        </h1>
        <p className="mt-4 leading-8 text-[#6c5830]">
          Menyiapkan sesi login dan mengambil data terbaru dari Supabase.
        </p>
      </div>
    </main>
  );
}

export function AdminErrorScreen({ message }: { message: string }) {
  return (
    <main className="min-h-screen bg-[#fcfbf8] px-4 py-10 text-[#3d2f18] md:px-8">
      <div className="mx-auto max-w-[760px] rounded-[2rem] border border-[#efd0cb] bg-white p-8 shadow-[0_22px_45px_-34px_rgba(95,70,17,0.32)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b14d43]">
          Admin Panel
        </p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-[#6f2f28]">
          Gagal memuat panel admin
        </h1>
        <p className="mt-4 leading-8 text-[#784740]">{message}</p>
      </div>
    </main>
  );
}
