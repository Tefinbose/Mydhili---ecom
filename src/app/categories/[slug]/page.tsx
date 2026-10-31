import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Bricolage_Grotesque } from "next/font/google";
import { ChevronRight, Sparkles } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import ShopProducts from "@/components/shop/ShopProducts";

export const instant = false;

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-category-page",
  display: "swap",
});

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

function formatTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getCategoryInfo(slug: string) {
  try {
    await connectToDatabase();
    const category = await Category.findOne({
      slug: slug.toLowerCase(),
      isActive: true,
    }).lean();

    if (category && typeof category === "object") {
      return {
        name: (category as { name?: string }).name || formatTitle(slug),
        description:
          (category as { description?: string }).description ||
          `Explore our handcrafted collection of ${formatTitle(slug).toLowerCase()} designed for grace, comfort, and timeless beauty.`,
      };
    }
  } catch (error) {
    console.error("Failed to fetch category info:", error);
  }

  return {
    name: formatTitle(slug),
    description: `Explore our handcrafted collection of ${formatTitle(slug).toLowerCase()} designed for grace, comfort, and timeless beauty.`,
  };
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryInfo(slug);

  return {
    title: `${category.name} Collection | Mydhili Boutique`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  await connection();
  const { slug } = await params;
  const category = await getCategoryInfo(slug);

  return (
    <div
      className={`${bricolage.variable} min-h-screen bg-[#FAF7F2] font-[family-name:var(--font-category-page)] text-[#380712]`}
    >
      {/* Category Hero Banner */}
      <section className="relative overflow-hidden bg-[#380712] px-5 py-12 text-center text-white sm:py-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#8B2635]/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />

        <div className="relative mx-auto max-w-3xl">
          {/* Breadcrumbs */}
          <nav
            aria-label="Breadcrumbs"
            className="mb-4 flex items-center justify-center gap-2 text-xs text-[#E6C47A]/80"
          >
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>
            <ChevronRight size={12} className="text-[#D4AF69]" />
            <Link href="/shop" className="transition hover:text-white">
              Collections
            </Link>
            <ChevronRight size={12} className="text-[#D4AF69]" />
            <span className="font-semibold text-white">{category.name}</span>
          </nav>

          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="h-px w-6 bg-[#D4AF69]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#E6C47A] sm:text-xs">
              Mydhili Signature Collection
            </span>
            <span className="h-px w-6 bg-[#D4AF69]" />
          </div>

          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-serif font-bold tracking-tight text-white">
            {category.name}
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm font-light leading-relaxed text-stone-300 sm:text-base">
            {category.description}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF69]/50 bg-white/5 px-4 py-2 text-xs font-medium text-white backdrop-blur-sm transition hover:bg-[#D4AF69] hover:text-[#380712]"
            >
              <Sparkles size={13} className="text-[#E6C47A]" />
              <span>Browse All Collections</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Catalog with Pre-selected Category */}
      <main className="py-2">
        <ShopProducts initialCategory={slug} />
      </main>
    </div>
  );
}
