
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Product from "@/models/Product";
import Category from "@/models/Category";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function authorizeAdmin() {
  const session = await getAdminSession();
  return Boolean(session);
}

// GET: Fetch products and categories
export async function GET() {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json(
        { success: false, message: "Admin authentication required." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const [products, categories] = await Promise.all([
      Product.find({})
        .populate("category", "name")
        .sort({ createdAt: -1 })
        .lean(),

      Category.find({})
        .select("name isActive")
        .sort({ name: 1 })
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      products,
      categories,
    });
  } catch (error) {
    console.error("Fetch products error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch products." },
      { status: 500 }
    );
  }
}

// POST: Create product
export async function POST(request: NextRequest) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json(
        { success: false, message: "Admin authentication required." },
        { status: 401 }
      );
    }

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

    // Ignore completely empty variant rows.
    const submittedVariants = Array.isArray(body.variants)
      ? body.variants
      : [];

    const variants = submittedVariants
      .filter((variant: Record<string, unknown>) =>
        [variant.sku, variant.size, variant.color].some(
          (value) => String(value ?? "").trim() !== ""
        )
      )
      .map((variant: Record<string, unknown>) => {
        const rawSku = String(variant.sku ?? "").trim();
        const size = String(variant.size ?? "").trim();
        const color = String(variant.color ?? "").trim();
        const sku =
          rawSku ||
          `${createSlug(name || "VAR")
            .toUpperCase()
            .slice(0, 8)}-${size.toUpperCase().replace(/\s+/g, "")}-${color
            .toUpperCase()
            .replace(/\s+/g, "")}`;

        return {
          sku,
          size,
          color,
          stock: Number(variant.stock ?? 0),
        };
      });

    if (!name || !description || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Product name, description, and category are required.",
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
        { success: false, message: "Please enter a valid selling price." },
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

    const invalidVariant = variants.some(
      (variant: {
        sku: string;
        size: string;
        color: string;
        stock: number;
      }) =>
        !variant.size ||
        !variant.color ||
        !Number.isInteger(variant.stock) ||
        variant.stock < 0
    );

    if (invalidVariant) {
      return NextResponse.json(
        {
          success: false,
          message: "Each variant needs a size, colour, and valid non-negative stock quantity.",
        },
        { status: 400 }
      );
    }

    const categoryExists = await Category.findOne({
      _id: categoryId,
      isActive: true,
    });

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, message: "Selected active category was not found." },
        { status: 404 }
      );
    }

    const baseSlug = createSlug(name);

    if (!baseSlug) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid product name." },
        { status: 400 }
      );
    }

    let slug = baseSlug;
    let suffix = 1;

    while (await Product.findOne({ slug })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
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
