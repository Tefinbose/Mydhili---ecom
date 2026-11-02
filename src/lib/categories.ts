import { prisma } from "@/lib/prisma";
import {
  DEFAULT_CATEGORIES,
  StoreCategory,
  normalizeCategorySlug,
} from "./constants/categories";

export { DEFAULT_CATEGORIES, normalizeCategorySlug };
export type { StoreCategory };

/**
 * Fetch categories using pure MySQL (Prisma).
 * If the database table is empty or offline during startup,
 * gracefully falls back to canonical DEFAULT_CATEGORIES so storefront never renders broken.
 */
export async function fetchStoreCategories(): Promise<StoreCategory[]> {
  try {
    const rawCategories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    if (rawCategories && rawCategories.length > 0) {
      return rawCategories.map((c) => ({
        id: c.id,
        _id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || "",
        image: c.image || "",
        isActive: c.isActive,
      }));
    }
  } catch (error) {
    console.error("MySQL category fetch error:", error);
  }

  return DEFAULT_CATEGORIES;
}

export async function findCategoryBySlug(slug: string): Promise<StoreCategory | null> {
  const normalized = normalizeCategorySlug(slug);

  try {
    const category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: normalized },
          { slug: slug.toLowerCase() },
          { slug: normalized.replace(/s$/, "") },
          { slug: `${normalized}s` },
        ],
        isActive: true,
      },
    });

    if (category) {
      return {
        id: category.id,
        _id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image: category.image || "",
        isActive: category.isActive,
      };
    }
  } catch (error) {
    console.error("MySQL category lookup error:", error);
  }

  // Check DEFAULT_CATEGORIES fallback
  const matched = DEFAULT_CATEGORIES.find(
    (c) =>
      c.slug === normalized ||
      c.slug === slug.toLowerCase() ||
      c.slug === normalized.replace(/s$/, "") ||
      `${c.slug}s` === normalized
  );

  return matched || null;
}
