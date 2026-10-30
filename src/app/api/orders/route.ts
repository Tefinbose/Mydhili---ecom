
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { requireAdmin } from "@/lib/require-admin";
import {connectToDatabase} from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();

    const [products, categories] = await Promise.all([
      Product.find({})
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .lean(),
      Category.find({ isActive: true })
        .select("name")
        .sort({ name: 1 })
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      products,
      categories,
    });
  } catch (error) {
    console.error("Fetch admin products error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch products." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const shortDescription = String(body.shortDescription ?? "").trim();
    const categoryId = String(body.category ?? "").trim();
    const price = Number(body.price);
    const compareAtPrice =
      body.compareAtPrice === "" || body.compareAtPrice == null
        ? undefined
        : Number(body.compareAtPrice);

    const images = Array.isArray(body.images)
      ? body.images
          .map((image: unknown) => String(image).trim())
          .filter(Boolean)
      : [];

    const variants = Array.isArray(body.variants)
      ? body.variants.map((variant: Record<string, unknown>) => ({
          sku: String(variant.sku ?? "").trim(),
          size: String(variant.size ?? "").trim(),
          color: String(variant.color ?? "").trim(),
          stock: Number(variant.stock ?? 0),
        }))
      : [];

    if (!name || !description || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, description, and category are required.",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Please select a valid category." },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid product price." },
        { status: 400 }
      );
    }

    if (
      compareAtPrice !== undefined &&
      (!Number.isFinite(compareAtPrice) || compareAtPrice < price)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Compare-at price must be greater than or equal to the selling price.",
        },
        { status: 400 }
      );
    }

    if (
      variants.some(
        (variant: { stock: number }) =>
          !Number.isInteger(variant.stock) || variant.stock < 0
      )
    ) {
      return NextResponse.json(
        { success: false, message: "Variant stock must be a non-negative whole number." },
        { status: 400 }
      );
    }

    const categoryExists = await Category.findById(categoryId);

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: "Selected category was not found." },
        { status: 404 }
      );
    }

    const baseSlug = createSlug(name);
    let slug = baseSlug;
    let suffix = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription,
      category: categoryId,
      price,
      compareAtPrice,
      images,
      variants,
      isFeatured: Boolean(body.isFeatured),
      isActive: body.isActive !== false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create product." },
      { status: 500 }
    );
  }
}
