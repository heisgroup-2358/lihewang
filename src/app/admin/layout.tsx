import type { Metadata } from "next";
import { AdminSidebar, AdminHeader } from "@/components/admin/admin-layout";

export const metadata: Metadata = {
  title: "管理後台 | 禮盒王",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 bg-secondary/20 p-8">{children}</main>
      </div>
    </div>
  );
}
