
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Product from "@/models/Product";
import Category from "@/models/Category";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function authorizeAdmin() {
  const session = await getAdminSession();
  return Boolean(session);
}

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function validateVariants(input: unknown, productName = "") {
  if (!Array.isArray(input)) {
    return { valid: false, variants: [], message: "Invalid variants." };
  }

  const variants = [];

  for (const item of input) {
    const rawSku = String(item?.sku || "").trim();
    const size = String(item?.size || "").trim();
    const color = String(item?.color || "").trim();

    // Ignore completely empty variant rows.
    if (!rawSku && !size && !color && (item?.stock === "" || item?.stock == null)) {
      continue;
    }

    if (!size || !color) {
      return {
        valid: false,
        variants: [],
        message: "Every variant must have a size and color.",
      };
    }

    const sku =
      rawSku ||
      `${createSlug(productName || "VAR")
        .toUpperCase()
        .slice(0, 8)}-${size.toUpperCase().replace(/\s+/g, "")}-${color
        .toUpperCase()
        .replace(/\s+/g, "")}`;

    const stock = Number(item?.stock ?? 0);

    if (!Number.isInteger(stock) || stock < 0) {
      return {
        valid: false,
        variants: [],
        message: "Variant stock must be a non-negative whole number.",
      };
    }

    variants.push({ sku, size, color, stock });
  }

  return { valid: true, variants, message: "" };
}

// GET: Fetch one product
export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findById(id)
      .populate("category", "name")
      .lean();

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Get product error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch product." },
      { status: 500 }
    );
  }
}

// PUT: Update one product
export async function PUT(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const shortDescription = String(body.shortDescription || "").trim();
    const categoryId = String(body.category || "");
    const price = Number(body.price);
    const compareAtPrice =
      body.compareAtPrice === "" || body.compareAtPrice == null
        ? undefined
        : Number(body.compareAtPrice);

    if (!name || !description || !categoryId) {
      return NextResponse.json(
        {
          success: false,
          message: "Name, description and category are required.",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { success: false, message: "Enter a valid product price." },
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
          message:
            "Compare-at price must be greater than or equal to the selling price.",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid category." },
        { status: 400 }
      );
    }

    const variantResult = validateVariants(body.variants || [], name);

    if (!variantResult.valid) {
      return NextResponse.json(
        { success: false, message: variantResult.message },
        { status: 400 }
      );
    }

    const images = Array.isArray(body.images)
      ? body.images
          .map((image: unknown) => String(image).trim())
          .filter(Boolean)
      : [];

    await connectToDatabase();

    const existingProduct = await Product.findById(id);

    if (!existingProduct) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Selected category was not found." },
        { status: 400 }
      );
    }

    // Only regenerate slug if product name has changed
    let slug = existingProduct.slug;
    if (existingProduct.name !== name) {
      const baseSlug = createSlug(name);
      slug = baseSlug;
      let suffix = 1;

      while (await Product.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${suffix}`;
        suffix++;
      }
    }

    existingProduct.name = name;
    existingProduct.slug = slug;
    existingProduct.description = description;
    existingProduct.shortDescription = shortDescription;
    existingProduct.category = new mongoose.Types.ObjectId(categoryId);
    existingProduct.price = price;
    existingProduct.compareAtPrice = compareAtPrice;
    existingProduct.images = images;
    existingProduct.variants = variantResult.variants;
    existingProduct.isFeatured = Boolean(body.isFeatured);
    existingProduct.isActive = Boolean(body.isActive);

    await existingProduct.save();

    const updatedProduct = await Product.findById(id)
      .populate("category", "name")
      .lean();

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update product." },
      { status: 500 }
    );
  }
}

// DELETE: Delete one product
export async function DELETE(
  _request: NextRequest,
  { params }: RouteContext
) {
  try {
    if (!(await authorizeAdmin())) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to delete product." },
      { status: 500 }
    );
  }
}
