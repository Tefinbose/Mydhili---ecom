import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import "@/models/Category"; // Ensure Category model is registered for populate

export async function GET() {
  try {
    const rawProducts = await prisma.product.findMany({
      where: { isActive: true },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (rawProducts && rawProducts.length > 0) {
      const products = rawProducts.map((p) => ({
        ...p,
        _id: p.id,
        id: p.id,
        price: Number(p.price),
        compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
        category: p.category
          ? {
              ...p.category,
              _id: p.category.id,
            }
          : null,
      }));

      return NextResponse.json(
        {
          success: true,
          count: products.length,
          products,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        }
      );
    }
  } catch (error) {
    console.warn("Prisma products fetch failed, attempting MongoDB fallback:", error);
  }

  // Fallback to MongoDB if available
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const mongoProducts = await Product.find({ isActive: true })
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .lean();

      if (mongoProducts && mongoProducts.length > 0) {
        const products = mongoProducts.map((p: any) => ({
          ...p,
          _id: String(p._id),
          id: String(p._id),
          price: Number(p.price),
          compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
          category:
            typeof p.category === "object" && p.category
              ? {
                  ...p.category,
                  _id: String(p.category._id || p.category.id),
                  id: String(p.category._id || p.category.id),
                }
              : p.category,
        }));

        return NextResponse.json(
          {
            success: true,
            count: products.length,
            products,
          },
          {
            status: 200,
            headers: {
              "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
            },
          }
        );
      }
    } catch (mongoError) {
      console.warn("MongoDB products fallback failed:", mongoError);
    }
  }

  return NextResponse.json(
    {
      success: true,
      count: 0,
      products: [],
    },
    { status: 200 }
  );
}

