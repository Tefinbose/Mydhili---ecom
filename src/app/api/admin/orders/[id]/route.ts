import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(
  _request: NextRequest,
  { params }: RouteContext
) {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Invalid order ID." },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    const cust = (order.customer as any) || {};

    return NextResponse.json({
      success: true,
      order: {
        _id: order.id,
        id: order.id,
        orderNumber: order.orderNumber,
        customer: {
          name: cust.name || "",
          email: cust.email || "",
          phone: cust.phone || "",
        },
        shippingAddress: cust.shippingAddress || null,
        items: order.items,
        subtotal: Number(order.subtotal),
        shippingFee: Number(order.shippingFee),
        total: Number(order.total),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        trackingNumber: order.trackingNumber,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      },
    });
  } catch (error) {
    console.error("Order details error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch order details." },
      { status: 500 }
    );
  }
}
