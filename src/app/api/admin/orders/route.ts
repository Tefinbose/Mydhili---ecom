
import { connection, NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";

const allowedStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function GET(request: NextRequest) {
  // This endpoint depends on the incoming request and its cookies.
  await connection();

  try {
    const adminSession = await getAdminSession();

    if (!adminSession) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const page = Math.max(
      1,
      Number.parseInt(searchParams.get("page") || "1", 10) || 1
    );

    const limit = Math.min(
      100,
      Math.max(
        1,
        Number.parseInt(searchParams.get("limit") || "10", 10) || 10
      )
    );

    const search = (searchParams.get("search") || "").trim();
    const status = (searchParams.get("status") || "").toUpperCase();

    const filter: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid order status" },
          { status: 400 }
        );
      }

      filter.status = status;
    }

    if (search) {
      // Escape regex characters so search text is treated literally.
      const safeSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(safeSearch, "i");

      filter.$or = [
        { orderNumber: searchRegex },
        { "customer.name": searchRegex },
        { "customer.email": searchRegex },
        { "shippingAddress.name": searchRegex },
        { "shippingAddress.email": searchRegex },
      ];
    }

    const skip = (page - 1) * limit;

    const [orders, totalOrders, pendingOrders, paidOrders, codOrders] =
      await Promise.all([
        Order.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Order.countDocuments(filter),

        Order.countDocuments({ status: "PENDING" }),

        Order.find({ paymentStatus: "PAID" })
          .select("totalAmount total")
          .lean(),

        Order.countDocuments({
          paymentMethod: {
            $in: ["COD", "CASH_ON_DELIVERY", "Cash on Delivery"],
          },
        }),
      ]);

    const revenue = paidOrders.reduce((sum, order) => {
      const amount =
        typeof order.totalAmount === "number"
          ? order.totalAmount
          : typeof order.total === "number"
            ? order.total
            : 0;

      return sum + amount;
    }, 0);

    return NextResponse.json({
      success: true,
      orders,
      pagination: {
        page,
        limit,
        totalOrders,
        totalPages: Math.ceil(totalOrders / limit),
      },
      summary: {
        totalOrders: await Order.countDocuments(),
        pendingOrders,
        revenue,
        codOrders,
      },
    });
  } catch (error) {
    console.error("Admin orders API error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
