import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowLeft, ChevronRight } from "lucide-react";
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

type CategoryLink = { name: string; slug: string };

function formatTitle(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function fallbackDescription(slug: string) {
  return `Explore our handcrafted collection of ${formatTitle(slug).toLowerCase()} designed for grace, comfort, and timeless beauty.`;
}

async function getCategoryInfo(slug: string) {
  try {
    await connectToDatabase();
    const category = await Category.findOne({ slug: slug.toLowerCase(), isActive: true }).lean();

    if (category && typeof category === "object") {
      return {
        name: (category as { name?: string }).name || formatTitle(slug),
        description: (category as { description?: string }).description || fallbackDescription(slug),
      };
    }
  } catch (error) {
    console.error("Failed to fetch category info:", error);
  }

  return { name: formatTitle(slug), description: fallbackDescription(slug) };
}

async function getAllCategories(): Promise<CategoryLink[]> {
  try {
    await connectToDatabase();
    const list = await Category.find({ isActive: true }).select("name slug").lean();
    return (list as unknown as CategoryLink[]).map((c) => ({ name: c.name, slug: c.slug }));
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return [];
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
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
  const [category, categories] = await Promise.all([getCategoryInfo(slug), getAllCategories()]);
  const activeSlug = slug.toLowerCase();

  return (
    <div className={`${bricolage.variable} min-h-screen bg-[#FAF7F2] font-[family-name:var(--font-category-page)] text-[#380712]`}>
      <section className="relative overflow-hidden bg-[#380712] px-5 py-12 text-center text-white sm:py-16">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#8B2635]/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />

        <div className="relative mx-auto max-w-3xl">
          <nav aria-label="Breadcrumbs" className="mb-5 flex items-center justify-center gap-2 text-xs text-[#E6C47A]/80">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <ChevronRight size={12} className="text-[#D4AF69]" />
            <Link href="/shop" className="transition hover:text-white">Collections</Link>
            <ChevronRight size={12} className="text-[#D4AF69]" />
            <span className="font-semibold text-white">{category.name}</span>
          </nav>

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] sm:text-xs">Mydhili Signature Collection</span>
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>

          <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            {category.name}
            <span className="text-[#E6C47A]">.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-7 text-white/75 sm:text-base">{category.description}</p>

          {categories.length > 1 && (
            <nav aria-label="Browse categories" className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
              {categories.map((c) => {
                const active = c.slug.toLowerCase() === activeSlug;
                return (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full border px-4 py-2 text-xs font-medium transition-all duration-300 ${active ? "border-[#D4AF69] bg-[#D4AF69] text-[#380712]" : "border-[#D4AF69]/40 bg-white/5 text-white/90 backdrop-blur-sm hover:border-[#D4AF69] hover:text-[#E6C47A]"}`}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </nav>
          )}

          <Link href="/shop" className="group mt-6 inline-flex items-center gap-2 border-b border-[#D4AF69]/60 pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E6C47A] transition hover:border-white hover:text-white">
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
            Browse all collections
          </Link>
        </div>
      </section>

      <main className="py-2">
        <ShopProducts initialCategory={slug} />
      </main>
    </div>
  );
}