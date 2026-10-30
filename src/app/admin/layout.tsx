
"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Login page should not display the admin sidebar.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <AdminSidebar />

      <main className="min-h-screen min-w-0 lg:ml-72">
        {children}
      </main>
    </div>
  );
}
