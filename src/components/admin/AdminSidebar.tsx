
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Store,
  ChevronRight,
  Menu,
  X,
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
    name: "Categories",
    href: "/admin/categories",
    icon: Tags,
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
];

const managementNavigation = [
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

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch("/api/admin/logout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Unable to log out.");
      }

      router.replace("/admin/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
      alert("Unable to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  function closeMobileMenu() {
    setMobileOpen(false);
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={mobileOpen}
        className="fixed left-4 top-4 z-[60] flex h-11 w-11 items-center justify-center rounded-xl border border-[#D4AF69]/30 bg-[#380712] text-white shadow-lg md:hidden"
      >
        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-64 shrink-0 flex-col border-r border-[#D4AF69]/20 bg-[#380712] text-white shadow-xl transition-transform duration-300 md:sticky md:top-0 md:z-30 md:translate-x-0 md:shadow-none ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-7">
          <Link
            href="/admin"
            onClick={closeMobileMenu}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF69] text-[#380712]">
              <Store size={23} />
            </div>

            <div>
              <h1 className="font-serif text-xl font-bold tracking-wide">
                MYDHILI
              </h1>
              <p className="mt-0.5 text-[10px] uppercase tracking-[0.25em] text-[#D4AF69]">
                Boutique Admin
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close sidebar"
            className="rounded-lg p-2 text-white/60 hover:bg-white/10 hover:text-white md:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-7 overflow-y-auto px-4 py-7">
          <div>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Main Menu
            </p>

            <div className="space-y-1.5">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
                      active
                        ? "bg-[#D4AF69] font-semibold text-[#380712] shadow-md"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={19} />
                      {item.name}
                    </span>

                    {active && <ChevronRight size={16} />}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
              Store Management
            </p>

            <div className="space-y-1.5">
              {managementNavigation.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMobileMenu}
                    className={`group flex items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
                      active
                        ? "bg-[#D4AF69] font-semibold text-[#380712] shadow-md"
                        : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <Icon size={19} />
                      {item.name}
                    </span>

                    {active && <ChevronRight size={16} />}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-4 rounded-xl bg-white/5 p-3">
            <p className="text-xs font-medium text-white">
              Mydhili Boutique
            </p>
            <p className="mt-1 text-[11px] text-white/45">
              Store Administration
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/70 transition hover:bg-red-500/15 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut size={19} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>

          <p className="mt-5 text-center text-[10px] text-white/30">
            Mydhili Boutique Admin
          </p>
        </div>
      </aside>
    </>
  );
}
