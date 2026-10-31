
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";

type RouteContext = {
  params: Promise<{ email: string }>;
};

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {

    const { email } = await context.params;
    const customerEmail = decodeURIComponent(email).trim().toLowerCase();

    if (!customerEmail || !customerEmail.includes("@")) {
      return NextResponse.json(
        { success: false, message: "Invalid customer email" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const orders = await Order.find({
      "customer.email": {
        $regex: `^${customerEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
        $options: "i",
      },
    })
      .sort({ createdAt: -1 })
      .lean();

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    const latestOrder = orders[0];
    const totalSpent = orders.reduce(
      (sum, order) =>
        order.orderStatus !== "cancelled"
          ? sum + (order.total || 0)
          : sum,
      0
    );

    const customer = {
      name: latestOrder.customer?.name || "Customer",
      email: latestOrder.customer?.email || customerEmail,
      phone: latestOrder.customer?.phone || "",
      totalOrders: orders.length,
      totalSpent,
      lastOrderDate: latestOrder.createdAt,
    };

    return NextResponse.json({
      success: true,
      customer,
      orders: JSON.parse(JSON.stringify(orders)),
    });
  } catch (error) {
    console.error("CUSTOMER DETAILS API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load customer details" },
      { status: 500 }
    );
  }
}
