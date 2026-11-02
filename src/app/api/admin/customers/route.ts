import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const customerMap = new Map<string, {
      id: string;
      name: string;
      email: string;
      phone: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderDate: Date;
    }>();

    for (const order of orders) {
      const cust = (order.customer as any) || {};
      const email = String(cust.email || "").trim().toLowerCase();
      if (!email) continue;

      const existing = customerMap.get(email);
      const orderTotal = order.orderStatus !== "cancelled" ? Number(order.total) : 0;

      if (!existing) {
        customerMap.set(email, {
          id: email,
          name: cust.name || "",
          email: cust.email || email,
          phone: cust.phone || "",
          totalOrders: 1,
          totalSpent: orderTotal,
          lastOrderDate: order.createdAt,
        });
      } else {
        existing.totalOrders += 1;
        existing.totalSpent += orderTotal;
        if (order.createdAt > existing.lastOrderDate) {
          existing.lastOrderDate = order.createdAt;
        }
      }
    }

    const customers = Array.from(customerMap.values()).sort(
      (a, b) => new Date(b.lastOrderDate).getTime() - new Date(a.lastOrderDate).getTime()
    );

    return NextResponse.json({
      success: true,
      customers,
    });
  } catch (error) {
    console.error("CUSTOMERS API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load customers" },
      { status: 500 }
    );
  }
}
