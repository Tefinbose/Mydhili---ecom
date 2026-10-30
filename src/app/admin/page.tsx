
import Link from "next/link";
import { connection } from "next/server";
import {
  Package,
  ShoppingBag,
  Users,
  Settings,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { requireAdmin } from "@/lib/require-admin";

const sections = [
  {
    title: "Products",
    description: "Add and manage your boutique collection.",
    href: "/admin/products",
    icon: Package,
    action: "Manage products",
  },
  {
    title: "Orders",
    description: "View customer orders and update their status.",
    href: "/admin/orders",
    icon: ShoppingBag,
    action: "View orders",
  },
  {
    title: "Customers",
    description: "View and manage your customer information.",
    href: "/admin/customers",
    icon: Users,
    action: "View customers",
  },
  {
    title: "Settings",
    description: "Manage your store administration settings.",
    href: "/admin/settings",
    icon: Settings,
    action: "Open settings",
  },
];

export default async function AdminDashboardPage() {
  await connection();
  const session = await requireAdmin();

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
              Mydhili Collections
            </p>
            <h1 className="mt-2 font-serif text-3xl font-semibold text-[#380712] sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Welcome back, {session.email}.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 bg-[#380712] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5A1020]"
          >
            <Plus size={17} />
            Add new product
          </Link>
        </div>

        <section className="relative mt-9 overflow-hidden bg-[#380712] p-7 text-white sm:p-10">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-[#8B2635]/40 blur-3xl" />

          <div className="relative max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#E6C47A]">
              Store administration
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight sm:text-4xl">
              Manage your boutique,
              <br />
              beautifully.
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
              Manage your products, orders, customers, and store settings
              from one central place.
            </p>
            <Link
              href="/admin/products"
              className="mt-7 inline-flex items-center gap-2 border border-[#D4AF69]/60 px-5 py-3 text-sm font-medium text-[#F5D99C] transition hover:bg-[#D4AF69] hover:text-[#380712]"
            >
              Explore product management
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B35]">
              Administration
            </p>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-[#380712]">
              Manage your store
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sections.map((section) => {
              const Icon = section.icon;

              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group border border-[#EDE4D9] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-[#D4AF69] hover:shadow-md"
                >
                  <div className="flex h-11 w-11 items-center justify-center bg-[#FAF3E8] text-[#8B2635]">
                    <Icon size={21} />
                  </div>

                  <h3 className="mt-5 font-serif text-xl font-semibold text-[#380712]">
                    {section.title}
                  </h3>

                  <p className="mt-2 min-h-12 text-sm leading-6 text-stone-500">
                    {section.description}
                  </p>

                  <span className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-[#8B2635]">
                    {section.action}
                    <ArrowUpRight
                      size={15}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <p className="mt-10 border-t border-[#E9DFD2] pt-5 text-xs text-stone-400">
          Mydhili Collections · Store Administration
        </p>
      </div>
    </div>
  );
}
