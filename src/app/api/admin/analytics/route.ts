import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
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

    const where: { createdAt?: { gte: Date } } = {};
    if (startDate) {
      where.createdAt = { gte: startDate };
    }

    // Fetch all orders matching period
    const [orders, recentOrdersRaw, totalProductsCount, totalCategories] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.category.findMany(),
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
      const cust = (order.customer as any) || {};

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

      if (cust.email) {
        customerSet.add(String(cust.email).toLowerCase());
      }

      const statusKey = order.orderStatus || "pending";
      statusCounts[statusKey] = (statusCounts[statusKey] || 0) + 1;

      // Group by day
      let orderUnits = 0;
      const items = Array.isArray(order.items) ? (order.items as any[]) : [];
      for (const item of items) {
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
    const categoryMap = new Map<string, string>(
      totalCategories.map((c: any) => [String(c.id), String(c.name)])
    );

    // Category distribution from catalog products
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { categoryId: true, price: true },
    });

    const categoryDistributionMap = new Map<string, { name: string; count: number }>();
    for (const p of products as any[]) {
      const catId = typeof p.categoryId === "string" ? p.categoryId : "";
      const catName: string = String(categoryMap.get(catId) || "Other Collections");
      const existing = categoryDistributionMap.get(catName) || {
        name: catName,
        count: 0,
      };
      existing.count += 1;
      categoryDistributionMap.set(catName, existing);
    }

    const categoryDistribution = Array.from(categoryDistributionMap.values()).map(
      (c: { name: string; count: number }) => ({
        name: c.name,
        count: c.count,
        percentage:
          totalProductsCount > 0
            ? Math.round((c.count / totalProductsCount) * 100)
            : 0,
      })
    );

    // Clean recent orders
    const recentOrders = recentOrdersRaw.map((o: any) => {
      const cust = (o.customer as any) || {};
      return {
        _id: String(o.id),
        orderNumber: String(o.orderNumber || String(o.id).slice(-8).toUpperCase()),
        customerName: String(cust.name || "Guest Customer"),
        customerEmail: String(cust.email || ""),
        total: Number(o.total) || 0,
        orderStatus: String(o.orderStatus || "pending"),
        paymentMethod: String(o.paymentMethod || "cod"),
        itemCount: Array.isArray(o.items) ? (o.items as any[]).length : 1,
        createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString(),
      };
    });

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
