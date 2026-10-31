
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const paymentStatuses = ["pending", "paid", "failed"] as const;

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

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Fetch orders error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to fetch orders." },
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
    const orderId = String(body.orderId || "").trim();

    if (!orderId || !/^[a-f\d]{24}$/i.test(orderId)) {
      return NextResponse.json(
        { success: false, message: "A valid order ID is required." },
        { status: 400 }
      );
    }

    const updates: Record<string, string> = {};

    if (body.orderStatus !== undefined) {
      if (
        !orderStatuses.includes(
          body.orderStatus as (typeof orderStatuses)[number]
        )
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid order status." },
          { status: 400 }
        );
      }

      updates.orderStatus = body.orderStatus;
    }

    if (body.paymentStatus !== undefined) {
      if (
        !paymentStatuses.includes(
          body.paymentStatus as (typeof paymentStatuses)[number]
        )
      ) {
        return NextResponse.json(
          { success: false, message: "Invalid payment status." },
          { status: 400 }
        );
      }

      updates.paymentStatus = body.paymentStatus;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No valid updates provided." },
        { status: 400 }
      );
    }

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to update order." },
      { status: 500 }
    );
  }
}
