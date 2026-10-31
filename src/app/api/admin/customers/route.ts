
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {

    await connectToDatabase();

    const customers = await Order.aggregate([
      {
        $match: {
          "customer.email": { $exists: true, $ne: "" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $toLower: { $trim: { input: "$customer.email" } },
          },
          name: { $first: "$customer.name" },
          email: { $first: "$customer.email" },
          phone: { $first: "$customer.phone" },
          totalOrders: { $sum: 1 },
          totalSpent: {
            $sum: {
              $cond: [
                { $ne: ["$orderStatus", "cancelled"] },
                { $ifNull: ["$total", 0] },
                0,
              ],
            },
          },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
      {
        $sort: { lastOrderDate: -1 },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: 1,
          email: 1,
          phone: 1,
          totalOrders: 1,
          totalSpent: 1,
          lastOrderDate: 1,
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      customers: JSON.parse(JSON.stringify(customers)),
    });
  } catch (error) {
    console.error("CUSTOMERS API ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load customers" },
      { status: 500 }
    );
  }
}
