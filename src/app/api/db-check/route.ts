import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { connectToDatabase } from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import Order from "@/models/Order";

export async function GET() {
  const result: {
    success: boolean;
    mysql: { connected: boolean; counts?: any; error?: string };
    mongodb: { connected: boolean; counts?: any; error?: string };
  } = {
    success: false,
    mysql: { connected: false },
    mongodb: { connected: false },
  };

  // 1. Check MySQL (Prisma)
  try {
    await prisma.$queryRawUnsafe("SELECT 1;");
    const [categoriesCount, productsCount, ordersCount] = await Promise.all([
      prisma.category.count(),
      prisma.product.count(),
      prisma.order.count(),
    ]);

    result.mysql = {
      connected: true,
      counts: {
        categories: categoriesCount,
        products: productsCount,
        orders: ordersCount,
      },
    };
  } catch (error) {
    result.mysql = {
      connected: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }

  // 2. Check MongoDB
  if (process.env.MONGODB_URI) {
    try {
      await connectToDatabase();
      const [catCount, prodCount, ordCount] = await Promise.all([
        Category.countDocuments(),
        Product.countDocuments(),
        Order.countDocuments(),
      ]);

      result.mongodb = {
        connected: true,
        counts: {
          categories: catCount,
          products: prodCount,
          orders: ordCount,
        },
      };
    } catch (error) {
      result.mongodb = {
        connected: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  } else {
    result.mongodb = {
      connected: false,
      error: "MONGODB_URI not configured",
    };
  }

  result.success = result.mysql.connected || result.mongodb.connected;

  return NextResponse.json(result, { status: result.success ? 200 : 500 });
}

