import type { AdminDashboardData, AdminSessionUser } from "@/lib/admin-types";
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
