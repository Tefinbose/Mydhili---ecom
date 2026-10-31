import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
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

const categoryBackgrounds: Record<string, string> = {
  sarees: "/categories/saree.jpg",
  saree: "/categories/saree.jpg",
  kurtis: "/categories/kurtis.avif",
  kurti: "/categories/kurtis.avif",
  "ethnic-wear": "/categories/ethnicwear.jpg",
  ethnicwear: "/categories/ethnicwear.jpg",
  dresses: "/categories/dresses.jpg",
  dress: "/categories/dresses.jpg",
  blouses: "/categories/blouse.webp",
  blouse: "/categories/blouse.webp",
  accessories: "/categories/accessories.jpg",
  accessory: "/categories/accessories.jpg",
  lehengas: "/categories/lehenga.jpg",
  lehenga: "/categories/lehenga.jpg",
  "salwar-suits": "/categories/salvarsuits.jpg",
  salwarsuits: "/categories/salvarsuits.jpg",
  "salvar-suits": "/categories/salvarsuits.jpg",
  salvarsuit: "/categories/salvarsuits.jpg",
  "salwar-suit": "/categories/salvarsuits.jpg",
  jeans: "/categories/dresses.jpg",
};

const fallbackBackground = "/categories/saree.jpg";

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
      const img = cat.image?.trim() ?? "";
      const hasCustomImage =
        img.length > 0 &&
        (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("/")) &&
        !img.startsWith("/uploads/") &&
        !img.includes("images.unsplash.com");

      return {
        name: cat.name || formatTitle(slug),
        description: cat.description || fallbackDescription(slug),
        image: categoryBackgrounds[normalizedSlug] || (hasCustomImage ? img : defaultBg),
      };
    }
  } catch (error) {
    console.error("Failed to fetch category info:", error);
  }

  return { name: formatTitle(slug), description: fallbackDescription(slug), image: defaultBg };
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
  await connection();
  const { slug } = await params;
  const category = await getCategoryInfo(slug);

  return {
    title: `${category.name} Collection | Mydhili Collections`,
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
      <style>{`
        @keyframes catZoom { from { transform: scale(1); } to { transform: scale(1.08); } }
        @keyframes catUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .cat-zoom { animation: catZoom 12s ease-out forwards; }
        .cat-up { opacity: 0; animation: catUp .8s cubic-bezier(.2,.7,.2,1) forwards; }
        @media (prefers-reduced-motion: reduce) { .cat-zoom, .cat-up { animation: none; } .cat-up { opacity: 1; } }
      `}</style>

      <section className="relative isolate flex min-h-[400px] items-center justify-center overflow-hidden bg-[#24040B] px-5 py-14 text-center text-white sm:min-h-[460px] sm:py-20">
        <div className="absolute inset-0 -z-20">
          <Image
            src={category.image}
            alt=""
            fill
            priority
            unoptimized
            sizes="100vw"
            className="cat-zoom object-cover object-center"
          />
        </div>

        {/* Overlays */}
        <div className="absolute inset-0 -z-10 bg-[#24040B]/45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#24040B] via-[#24040B]/35 to-[#24040B]/30" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(36,4,11,0.55)_100%)]" />
        <div className="pointer-events-none absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full bg-[#D4AF69]/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 -z-10 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/70 to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/70 to-transparent" />

        <div className="relative mx-auto max-w-3xl">
          <nav aria-label="Breadcrumbs" className="cat-up mb-5 flex items-center justify-center gap-2 text-xs text-[#E6C47A]">
            <Link href="/" className="transition hover:text-white">Home</Link>
            <ChevronRight size={12} className="text-[#D4AF69]" />
            <Link href="/shop" className="transition hover:text-white">Collections</Link>
            <ChevronRight size={12} className="text-[#D4AF69]" />
            <span className="font-semibold tracking-wide text-white">{category.name}</span>
          </nav>

          <div className="cat-up mb-4 flex items-center justify-center gap-3" style={{ animationDelay: "0.08s" }}>
            <span className="h-px w-8 bg-[#D4AF69]" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A] sm:text-xs">Mydhili Signature Collection</span>
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>

          <h1
            className="cat-up text-[clamp(2.4rem,6vw,4.4rem)] font-semibold leading-[1.05] tracking-[-0.035em] drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
            style={{ animationDelay: "0.16s" }}
          >
            {category.name}
            <span className="text-[#E6C47A]">.</span>
          </h1>

          <p
            className="cat-up mx-auto mt-4 max-w-xl text-sm font-light leading-7 text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)] sm:text-base"
            style={{ animationDelay: "0.24s" }}
          >
            {category.description}
          </p>

          {categories.length > 1 && (
            <nav
              aria-label="Browse categories"
              className="cat-up mt-8 flex flex-wrap items-center justify-center gap-2.5"
              style={{ animationDelay: "0.32s" }}
            >
              {categories.map((c) => {
                const active = c.slug.toLowerCase() === activeSlug;
                return (
                  <Link
                    key={c.slug}
                    href={`/categories/${c.slug}`}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-md transition-all duration-300 ${
                      active
                        ? "border-[#D4AF69] bg-[#D4AF69] font-semibold text-[#380712] shadow-md"
                        : "border-white/30 bg-black/40 text-white hover:border-[#D4AF69] hover:bg-[#D4AF69]/25 hover:text-[#E6C47A]"
                    }`}
                  >
                    {c.name}
                  </Link>
                );
              })}
            </nav>
          )}

          <Link
            href="/shop"
            className="cat-up group mt-7 inline-flex items-center gap-2 border-b border-[#D4AF69] pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#E6C47A] transition hover:border-white hover:text-white"
            style={{ animationDelay: "0.4s" }}
          >
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