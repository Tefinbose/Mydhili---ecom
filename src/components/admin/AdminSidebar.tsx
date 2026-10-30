
"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Store,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    setLoggingOut(true);
    setError("");

    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to log out.");
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to log out."
      );
      setLoggingOut(false);
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Open navigation"
        className="fixed left-5 top-5 z-40 flex h-11 w-11 items-center justify-center border border-[#E9DFD2] bg-white text-[#380712] shadow-sm lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#E9DFD2] bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-24 items-center justify-between border-b border-[#EEE7DE] px-7">
          <Link
            href="/admin"
            onClick={closeMobileMenu}
            className="block"
          >
            <p className="font-serif text-2xl font-semibold tracking-wide text-[#380712]">
              Mydhili
            </p>
            <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.3em] text-[#9A6B35]">
              Boutique Administration
            </p>
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close navigation"
            className="text-neutral-500 hover:text-[#380712] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 py-7">
          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400">
            Main Menu
          </p>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 text-sm transition ${
                    active
                      ? "bg-[#380712] text-white"
                      : "text-neutral-600 hover:bg-[#FAF7F2] hover:text-[#380712]"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-[#EEE7DE] p-5">
          <Link
            href="/"
            className="mb-4 flex items-center gap-3 px-4 py-3 text-sm text-neutral-600 transition hover:bg-[#FAF7F2] hover:text-[#380712]"
          >
            <Store className="h-4 w-4" />
            View Website
          </Link>

          {error && (
            <p role="alert" className="mb-3 px-3 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 border border-[#E9DFD2] px-4 py-3 text-sm text-[#380712] transition hover:border-[#380712] hover:bg-[#FAF7F2] disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Signing out..." : "Logout"}
          </button>

          <p className="mt-5 text-center text-[10px] tracking-wide text-neutral-400">
            MYDHILI COLLECTIONS
          </p>
        </div>
      </aside>
    </>
  );
}
