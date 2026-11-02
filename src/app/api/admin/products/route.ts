import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

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

    const [productsRaw, categories] = await Promise.all([
      prisma.product.findMany({
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),

      prisma.category.findMany({
        select: { id: true, name: true, isActive: true },
        orderBy: { name: "asc" },
      }),
    ]);

    const products = productsRaw.map((p: any) => ({
      _id: p.id,
      id: p.id,
      name: p.name,
      slug: p.slug,
      description: p.description,
      shortDescription: p.shortDescription,
      price: Number(p.price),
      compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
      images: p.images,
      variants: p.variants,
      isFeatured: p.isFeatured,
      isActive: p.isActive,
      category: p.category ? { _id: p.category.id, id: p.category.id, name: p.category.name } : null,
      createdAt: p.createdAt,
      updatedAt: p.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      products,
      categories: categories.map((c: any) => ({ _id: c.id, id: c.id, name: c.name, isActive: c.isActive })),
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

    const body = await request.json();

    const name = String(body.name ?? "").trim();
    const description = String(body.description ?? "").trim();
    const shortDescription = String(body.shortDescription ?? "").trim();
    const categoryId = String(body.category ?? "").trim();
    const price = Number(body.price);

    const compareAtPrice =
      body.compareAtPrice === "" || body.compareAtPrice == null
        ? null
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

    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid selling price." },
        { status: 400 }
      );
    }

    if (
      compareAtPrice !== null &&
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

    const categoryExists = await prisma.category.findFirst({
      where: {
        id: categoryId,
        isActive: true,
      },
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

    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix}`;
      suffix++;
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        categoryId: categoryId,
        price,
        compareAtPrice,
        images,
        variants,
        isFeatured: Boolean(body.isFeatured),
        isActive: body.isActive !== false,
      },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product: {
          _id: product.id,
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          shortDescription: product.shortDescription,
          price: Number(product.price),
          compareAtPrice: product.compareAtPrice ? Number(product.compareAtPrice) : null,
          images: product.images,
          variants: product.variants,
          isFeatured: product.isFeatured,
          isActive: product.isActive,
          category: product.category ? { _id: product.category.id, id: product.category.id, name: product.category.name } : null,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
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
