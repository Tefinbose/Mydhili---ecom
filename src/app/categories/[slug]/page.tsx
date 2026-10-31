import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import ShopProducts from "@/components/shop/ShopProducts";

import Image from "next/image";

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

const categoryBackgrounds: Record<string, string> = {
  sarees:
    "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85",
  kurtis:
    "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1920&q=85",
  "ethnic-wear":
    "https://images.unsplash.com/photo-1583391733956-6c78276477e4?auto=format&fit=crop&w=1920&q=85",
  dresses:
    "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1920&q=85",
  blouses:
    "https://images.unsplash.com/photo-1610030469668-93282980b190?auto=format&fit=crop&w=1920&q=85",
  accessories:
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1920&q=85",
  lehengas:
    "https://images.unsplash.com/photo-1583391733975-021b3d5b0359?auto=format&fit=crop&w=1920&q=85",
  "salwar-suits":
    "https://images.unsplash.com/photo-1583391733956-6c78276477e4?auto=format&fit=crop&w=1920&q=85",
  jeans:
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1920&q=85",
};

const fallbackBackground =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=85";

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
  const normalizedSlug = slug.toLowerCase();
  const defaultBg = categoryBackgrounds[normalizedSlug] || fallbackBackground;

  try {
    await connectToDatabase();
    const category = await Category.findOne({ slug: normalizedSlug, isActive: true }).lean();

    if (category && typeof category === "object") {
      const cat = category as { name?: string; description?: string; image?: string };
      const hasValidImage = Boolean(
        cat.image &&
        cat.image.trim().length > 0 &&
        (cat.image.startsWith("http://") ||
          cat.image.startsWith("https://") ||
          cat.image.startsWith("/")) &&
        !cat.image.startsWith("/uploads/")
      );

      return {
        name: cat.name || formatTitle(slug),
        description: cat.description || fallbackDescription(slug),
        image: hasValidImage ? cat.image! : defaultBg,
      };
    }
  } catch (error) {
    console.error("Failed to fetch category info:", error);
  }

  return {
    name: formatTitle(slug),
    description: fallbackDescription(slug),
    image: defaultBg,
  };
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
  const name = formatTitle(slug);
  const description = fallbackDescription(slug);

  return {
    title: `${name} Collection | Mydhili Boutique`,
    description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  await connection();
  const { slug } = await params;
  const [category, categories] = await Promise.all([getCategoryInfo(slug), getAllCategories()]);
  const activeSlug = slug.toLowerCase();

  return (
    <div className={`${bricolage.variable} min-h-screen bg-[#FAF7F2] font-[family-name:var(--font-category-page)] text-[#380712]`}>
      {/* Category Hero Banner with Visible Background Image */}
      <section className="relative min-h-[380px] overflow-hidden bg-[#24040B] px-5 py-14 text-center text-white sm:min-h-[440px] sm:py-20 flex items-center justify-center">
        {/* Category Specific Background Image Container */}
        <div className="absolute inset-0 z-0">
          <Image
            src={category.image}
            alt={`${category.name} Collection`}
            fill
            priority
            unoptimized
            sizes="100vw"
            className="object-cover object-center transform scale-105 motion-safe:transition-transform motion-safe:duration-1000"
          />
          {/* Balanced Luxury Overlays - Dark enough for readable text, clear enough to see the image vividly */}
          <div className="absolute inset-0 bg-[#24040B]/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#24040B] via-[#24040B]/35 to-[#24040B]/25" />
          <div className="absolute inset-0 bg-radial-vignette opacity-50" />
        </div>

        {/* Ambient Gold Glows */}
        <div className="pointer-events-none absolute -left-20 -top-20 z-[1] h-72 w-72 rounded-full bg-[#D4AF69]/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 z-[1] h-72 w-72 rounded-full bg-[#D4AF69]/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-[#D4AF69]/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-px bg-gradient-to-r from-transparent via-[#D4AF69]/70 to-transparent" />

        <div className="relative z-10 mx-auto max-w-3xl">
          <nav aria-label="Breadcrumbs" className="mb-5 flex items-center justify-center gap-2 text-xs text-[#E6C47A] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <ChevronRight size={12} className="text-[#D4AF69]" />
            <Link href="/shop" className="transition hover:text-white">Collections</Link>
            <ChevronRight size={12} className="text-[#D4AF69]" />
            <span className="font-semibold text-white tracking-wide">{category.name}</span>
          </nav>

          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] sm:text-xs">
              Mydhili Signature Collection
            </span>
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>

          <h1 className="font-serif text-[clamp(2.4rem,6vw,4.2rem)] font-bold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
            {category.name}
            <span className="text-[#E6C47A]">.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm font-normal leading-relaxed text-stone-100 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)] sm:text-base">
            {category.description}
          </p>

          {categories.length > 1 && (
            <nav aria-label="Browse categories" className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
              {categories.map((c) => {
                const active = c.slug.toLowerCase() === activeSlug;
                return (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-md transition-all duration-300 ${
                      active
                        ? "border-[#D4AF69] bg-[#D4AF69] text-[#380712] shadow-md font-semibold scale-105"
                        : "border-white/30 bg-black/40 text-white hover:border-[#D4AF69] hover:bg-[#D4AF69]/25 hover:text-[#E6C47A]"
                    }`}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </nav>
          )}

          <div className="mt-7">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 border-b border-[#D4AF69] pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E6C47A] drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] transition hover:border-white hover:text-white"
            >
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
              <span>Browse all collections</span>
            </Link>
          </div>
        </div>
      </section>

      <main className="py-2">
        <ShopProducts initialCategory={slug} />
      </main>
    </div>
  );
}