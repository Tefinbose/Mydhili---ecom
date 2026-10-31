
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Category from "@/models/Category";

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {

    await connectToDatabase();

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("Get categories error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch categories." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();

    const name = String(body.name || "").trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim();

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Category name is required." },
        { status: 400 }
      );
    }

    const slug = createSlug(name);

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid category name." },
        { status: 400 }
      );
    }

    const existingCategory = await Category.findOne({
      slug,
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "This category already exists." },
        { status: 409 }
      );
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      isActive: body.isActive !== false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category created successfully.",
        category,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create category error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to create category." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const categoryId = String(body.id || "").trim();

    if (!categoryId) {
      return NextResponse.json(
        { success: false, message: "Category ID is required." },
        { status: 400 }
      );
    }

    if (!/^[a-f\d]{24}$/i.test(categoryId)) {
      return NextResponse.json(
        { success: false, message: "Invalid category ID." },
        { status: 400 }
      );
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found." },
        { status: 404 }
      );
    }

    if (body.name !== undefined) {
      const name = String(body.name).trim();

      if (!name) {
        return NextResponse.json(
          { success: false, message: "Category name is required." },
          { status: 400 }
        );
      }

      const slug = createSlug(name);

      const duplicate = await Category.findOne({
        slug,
        _id: { $ne: categoryId },
      });

      if (duplicate) {
        return NextResponse.json(
          { success: false, message: "Another category uses this name." },
          { status: 409 }
        );
      }

      category.name = name;
      category.slug = slug;
    }

    if (body.description !== undefined) {
      category.description = String(body.description).trim();
    }

    if (body.image !== undefined) {
      category.image = String(body.image).trim();
    }

    if (body.isActive !== undefined) {
      category.isActive = Boolean(body.isActive);
    }

    await category.save();

    return NextResponse.json({
      success: true,
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Update category error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update category." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  return PATCH(request);
}
