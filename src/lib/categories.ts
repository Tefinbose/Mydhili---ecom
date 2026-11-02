import { prisma } from "@/lib/prisma";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import {
  DEFAULT_CATEGORIES,
  StoreCategory,
  normalizeCategorySlug,
} from "./constants/categories";

export { DEFAULT_CATEGORIES, normalizeCategorySlug };
export type { StoreCategory };

/**
 * Robust category fetcher that tries:
 * 1. Prisma (MySQL)
 * 2. MongoDB (if MONGODB_URI is available)
 * 3. Canonical boutique DEFAULT_CATEGORIES fallback
 *
 * This ensures production never serves a broken/empty state if a database connection fluctuates.
 */
export async function fetchStoreCategories(): Promise<StoreCategory[]> {
  // 1. Try Prisma (MySQL)
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
  } catch (prismaError) {
    console.warn("Prisma categories fetch failed, attempting fallback:", prismaError);
  }

  // 2. Try MongoDB fallback if configured
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const mongoCategories = await Category.find({ isActive: true })
        .sort({ name: 1 })
        .lean();

      if (mongoCategories && mongoCategories.length > 0) {
        return mongoCategories.map((c) => ({
          id: String(c._id),
          _id: String(c._id),
          name: c.name,
          slug: c.slug,
          description: c.description || "",
          image: c.image || "",
          isActive: c.isActive !== false,
        }));
      }
    } catch (mongoError) {
      console.warn("MongoDB categories fetch fallback failed:", mongoError);
    }
  }

  // 3. Guaranteed fallback: DEFAULT_CATEGORIES
  return DEFAULT_CATEGORIES;
}

export async function findCategoryBySlug(slug: string): Promise<StoreCategory | null> {
  const normalized = normalizeCategorySlug(slug);

  // 1. Try Prisma
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
  } catch (prismaError) {
    console.warn("Prisma category lookup failed:", prismaError);
  }

  // 2. Try MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const mongoCat = await Category.findOne({
        slug: {
          $in: [
            normalized,
            slug.toLowerCase(),
            normalized.replace(/s$/, ""),
            `${normalized}s`,
          ],
        },
        isActive: true,
      }).lean();

      if (mongoCat) {
        return {
          id: String(mongoCat._id),
          _id: String(mongoCat._id),
          name: mongoCat.name,
          slug: mongoCat.slug,
          description: mongoCat.description || "",
          image: mongoCat.image || "",
          isActive: mongoCat.isActive !== false,
        };
      }
    } catch (mongoError) {
      console.warn("MongoDB category lookup failed:", mongoError);
    }
  }

  // 3. Check DEFAULT_CATEGORIES
  const matched = DEFAULT_CATEGORIES.find(
    (c) =>
      c.slug === normalized ||
      c.slug === slug.toLowerCase() ||
      c.slug === normalized.replace(/s$/, "") ||
      `${c.slug}s` === normalized
  );

  return matched || null;
}
