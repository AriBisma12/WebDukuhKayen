import type { AdminSessionUser } from "@/lib/admin-auth";
import type { AdminDashboardData } from "@/lib/admin-data";
import { AdminProfileManager } from "./admin-profile-manager";

type AdminProfilePageProps = {
  currentAdmin: AdminSessionUser;
  data: AdminDashboardData;
  status?: string;
  message?: string;
};

export function AdminProfilePage(props: AdminProfilePageProps) {
  return <AdminProfileManager {...props} />;
}
