import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const rawCategories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });

    const categories = rawCategories.map((c) => ({
      ...c,
      _id: c.id,
      id: c.id,
    }));

    return NextResponse.json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    console.error("failed to fetch categories:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}