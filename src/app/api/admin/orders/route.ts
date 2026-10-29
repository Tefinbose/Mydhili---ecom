
import { NextRequest, NextResponse } from "next/server";

import {connectToDatabase} from "@/lib/mongodb";
import { getAdminSession } from "@/lib/mongodb";
import Order from "@/models/Order";

export const runtime = "nodejs";

const allowedStatuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export async function GET(request: NextRequest) {
  try {
    // Require an authenticated admin.
    const adminSession = await getAdminSession();

    if (!adminSession) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const requestedPage = Number(searchParams.get("page") ?? "1");
    const requestedLimit = Number(searchParams.get("limit") ?? "10");
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim() ?? "";

    const page =
      Number.isFinite(requestedPage) && requestedPage > 0
        ? Math.floor(requestedPage)
        : 1;

    const limit =
      Number.isFinite(requestedLimit) && requestedLimit > 0
        ? Math.min(Math.floor(requestedLimit), 50)
        : 10;

    const filter: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          { success: false, message: "Invalid order status." },
          { status: 400 }
        );
      }

      filter.orderStatus = status;
    }

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const searchRegex = new RegExp(escapedSearch, "i");

      filter.$or = [
        { orderNumber: searchRegex },
        { "customer.fullName": searchRegex },
        { "customer.email": searchRegex },
        { "customer.phone": searchRegex },
      ];
    }

    const [orders, total, summary] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),

      Order.countDocuments(filter),

      Order.aggregate([
        {
          $group: {
            _id: null,
            totalOrders: { $sum: 1 },
            totalRevenue: {
              $sum: {
                $cond: [
                  { $eq: ["$paymentStatus", "PAID"] },
                  "$total",
                  0,
                ],
              },
            },
            pendingOrders: {
              $sum: {
                $cond: [
                  { $eq: ["$orderStatus", "PENDING"] },
                  1,
                  0,
                ],
              },
            },
            codOrders: {
              $sum: {
                $cond: [
                  { $eq: ["$paymentMethod", "COD"] },
                  1,
                  0,
                ],
              },
            },
          },
        },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      orders: orders.map((order) => ({
        ...order,
        _id: String(order._id),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      summary: summary[0] ?? {
        totalOrders: 0,
        totalRevenue: 0,
        pendingOrders: 0,
        codOrders: 0,
      },
    });
  } catch (error) {
    console.error("Admin orders API error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load orders." },
      { status: 500 }
    );
  }
}
