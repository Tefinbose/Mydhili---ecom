
"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Keep the login page free from the admin sidebar.
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] lg:flex">
      <AdminSidebar />

      <main className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}
