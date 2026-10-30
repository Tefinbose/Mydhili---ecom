import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(request: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30d"; // '7d' | '30d' | '90d' | 'all'

    // Determine cutoff date based on period
    const now = new Date();
    let startDate: Date | null = new Date();

    if (period === "7d") {
      startDate.setDate(now.getDate() - 7);
    } else if (period === "30d") {
      startDate.setDate(now.getDate() - 30);
    } else if (period === "90d") {
      startDate.setDate(now.getDate() - 90);
    } else {
      startDate = null; // all time
    }

    const orderFilter: Record<string, unknown> = {};
    if (startDate) {
      orderFilter.createdAt = { $gte: startDate };
    }

    // Fetch all orders matching period
    const [orders, recentOrdersRaw] = await Promise.all([
      Order.find(orderFilter).sort({ createdAt: -1 }).lean(),
      Order.find().sort({ createdAt: -1 }).limit(6).lean(),
    ]);

    // Also fetch all products and categories for catalog insights
    const [totalProductsCount, totalCategories] = await Promise.all([
      Product.countDocuments({ isActive: true }),
      Category.find().lean(),
    ]);

    // Compute KPIs
    let totalRevenue = 0;
    let totalUnitsSold = 0;
    let deliveredOrdersCount = 0;
    let cancelledOrdersCount = 0;
    let paidOrdersCount = 0;
    let codCount = 0;
    let onlineCount = 0;
    let todayRevenue = 0;

    const todayStr = now.toISOString().split("T")[0];

    const statusCounts: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };

    const productSalesMap = new Map<
      string,
      {
        name: string;
        slug: string;
        image: string;
        quantity: number;
        revenue: number;
      }
    >();

    const customerSet = new Set<string>();

    // Daily revenue map for trend chart
    const dailyRevenueMap = new Map<
      string,
      { date: string; label: string; revenue: number; orders: number; units: number }
    >();

    // Initialize daily revenue map for the range (if 7d or 30d)
    const daysToGenerate = period === "7d" ? 7 : period === "30d" ? 30 : 14;
    if (startDate) {
      for (let i = daysToGenerate - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(now.getDate() - i);
        const key = d.toISOString().split("T")[0];
        const label = d.toLocaleDateString("en-IN", {
          month: "short",
          day: "numeric",
        });
        dailyRevenueMap.set(key, { date: key, label, revenue: 0, orders: 0, units: 0 });
      }
    }

    for (const order of orders) {
      const orderTotal = Number(order.total) || 0;
      const isCancelled = order.orderStatus === "cancelled";

      if (!isCancelled) {
        totalRevenue += orderTotal;
      }

      if (order.createdAt) {
        const orderDateStr = new Date(order.createdAt).toISOString().split("T")[0];
        if (orderDateStr === todayStr && !isCancelled) {
          todayRevenue += orderTotal;
        }
      }

      if (order.orderStatus === "delivered") {
        deliveredOrdersCount++;
      } else if (isCancelled) {
        cancelledOrdersCount++;
      }

      if (order.paymentStatus === "paid") {
        paidOrdersCount++;
      }

      if (order.paymentMethod === "online") {
        onlineCount++;
      } else {
        codCount++;
      }

      if (order.customer?.email) {
        customerSet.add(order.customer.email.toLowerCase());
      }

      const statusKey = order.orderStatus || "pending";
      statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;

      // Group by day
      let orderUnits = 0;
      if (Array.isArray(order.items)) {
        for (const item of order.items) {
          const qty = Number(item.quantity) || 1;
          orderUnits += qty;
          const itemRev = (Number(item.price) || 0) * qty;

          if (!isCancelled) {
            totalUnitsSold += qty;
          }

          const key = String(item.productId || item.name);
          const current = productSalesMap.get(key) || {
            name: item.name || "Product",
            slug: item.slug || "",
            image: item.image || "",
            quantity: 0,
            revenue: 0,
          };

          if (!isCancelled) {
            current.quantity += qty;
            current.revenue += itemRev;
          }

          productSalesMap.set(key, current);
        }
      }

      if (order.createdAt) {
        const dateKey = new Date(order.createdAt).toISOString().split("T")[0];
        const existingDay = dailyRevenueMap.get(dateKey);
        if (existingDay) {
          if (!isCancelled) {
            existingDay.revenue += orderTotal;
            existingDay.units += orderUnits;
          }
          existingDay.orders += 1;
        } else if (!startDate) {
          // If all time, accumulate dynamically
          const label = new Date(order.createdAt).toLocaleDateString("en-IN", {
            month: "short",
            day: "numeric",
          });
          dailyRevenueMap.set(dateKey, {
            date: dateKey,
            label,
            revenue: isCancelled ? 0 : orderTotal,
            orders: 1,
            units: orderUnits,
          });
        }
      }
    }

    const totalOrdersCount = orders.length;
    const effectiveOrdersCount = totalOrdersCount - cancelledOrdersCount;
    const averageOrderValue =
      effectiveOrdersCount > 0 ? Math.round(totalRevenue / effectiveOrdersCount) : 0;
    const fulfillmentRate =
      totalOrdersCount > 0
        ? Math.round((deliveredOrdersCount / totalOrdersCount) * 100)
        : 100;

    // Sort Top Products by revenue
    const topProducts = Array.from(productSalesMap.values())
      .filter((p) => p.revenue > 0 || p.quantity > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Format daily trend data
    const dailyTrend = Array.from(dailyRevenueMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // Map Category sales
    const categoryMap = new Map(
      totalCategories.map((c) => [String(c._id), c.name])
    );

    // Category distribution estimate from catalog products
    const products = await Product.find({ isActive: true })
      .select("category price")
      .lean();

    const categoryDistributionMap = new Map<string, { name: string; count: number }>();
    for (const p of products) {
      const catId = String(p.category);
      const catName = categoryMap.get(catId) || "Other Collections";
      const existing = categoryDistributionMap.get(catName) || {
        name: catName,
        count: 0,
      };
      existing.count += 1;
      categoryDistributionMap.set(catName, existing);
    }

    const categoryDistribution = Array.from(categoryDistributionMap.values()).map(
      (c) => ({
        name: c.name,
        count: c.count,
        percentage:
          totalProductsCount > 0
            ? Math.round((c.count / totalProductsCount) * 100)
            : 0,
      })
    );

    // Clean recent orders
    const recentOrders = recentOrdersRaw.map((o) => ({
      _id: String(o._id),
      orderNumber: o.orderNumber || String(o._id).slice(-8).toUpperCase(),
      customerName: o.customer?.name || "Guest Customer",
      customerEmail: o.customer?.email || "",
      total: Number(o.total) || 0,
      orderStatus: o.orderStatus || "pending",
      paymentMethod: o.paymentMethod || "cod",
      itemCount: Array.isArray(o.items) ? o.items.length : 1,
      createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      analytics: {
        period,
        kpis: {
          totalRevenue,
          todayRevenue,
          totalOrdersCount,
          averageOrderValue,
          totalUnitsSold,
          fulfillmentRate,
          uniqueCustomersCount: customerSet.size,
          activeCatalogProducts: totalProductsCount,
        },
        dailyTrend,
        orderStatuses: {
          counts: statusCounts,
          total: totalOrdersCount,
        },
        paymentBreakdown: {
          cod: codCount,
          online: onlineCount,
          paid: paidOrdersCount,
        },
        topProducts,
        categoryDistribution,
        recentOrders,
      },
    });
  } catch (error) {
    console.error("Analytics fetch error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load boutique analytics.",
      },
      { status: 500 }
    );
  }
}
