import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

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

    const allOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const orders = allOrders.filter((o: any) => {
      const cust = (o.customer as any) || {};
      return String(cust.email || "").trim().toLowerCase() === customerEmail;
    }).map((order: any) => {
      const cust = (order.customer as any) || {};
      return {
        _id: order.id,
        id: order.id,
        orderNumber: order.orderNumber,
        customer: cust,
        shippingAddress: cust.shippingAddress || null,
        items: order.items,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee),
        total: Number(order.total),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        createdAt: order.createdAt,
      };
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { success: false, message: "Customer not found" },
        { status: 404 }
      );
    }

    const latestOrder = orders[0];
    const totalSpent = orders.reduce(
      (sum: number, order: any) =>
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
      orders,
    });
  } catch (error) {
    console.error("CUSTOMER DETAILS API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load customer details" },
      { status: 500 }
    );
  }
}
