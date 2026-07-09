import type { AdminSessionUser } from "@/lib/admin-auth";
import type {
  AdminDashboardData,
  AdminDocumentationPost,
  AdminDocumentationVideo,
  AdminNewsItem,
} from "@/lib/admin-data";
import { AdminManageManager } from "./admin-manage-manager";

type AdminManagePageProps =
  | {
      currentAdmin: AdminSessionUser;
      data: AdminDashboardData;
      status?: string;
      message?: string;
      type: "berita";
      items: AdminNewsItem[];
    }
  | {
      currentAdmin: AdminSessionUser;
      data: AdminDashboardData;
      status?: string;
      message?: string;
      type: "dokumentasi";
      items: Array<AdminDocumentationPost | AdminDocumentationVideo>;
    };

export function AdminManagePage(props: AdminManagePageProps) {
  return <AdminManageManager {...props} />;
}
