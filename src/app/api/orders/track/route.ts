import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const query = String(body.orderId || body.query || "").trim();
    const emailOrPhone = String(body.emailOrPhone || body.email || "").trim().toLowerCase();

    if (!query && !emailOrPhone) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your Order ID, email address, or phone number.",
        },
        { status: 400 }
      );
    }

    // Try finding by exact orderNumber or id first
    let matchingOrders: any[] = [];

    if (query) {
      const order = await prisma.order.findFirst({
        where: {
          OR: [
            { orderNumber: { equals: query } },
            { id: { equals: query } },
          ],
        },
        orderBy: { createdAt: "desc" },
      });

      if (order) {
        matchingOrders = [order];
      }
    }

    // If not found by query, or if query is an email/phone itself, search raw orders
    if (matchingOrders.length === 0 && (emailOrPhone || query)) {
      const searchTerm = (emailOrPhone || query).toLowerCase().trim();
      const allOrders = await prisma.order.findMany({
        take: 100,
        orderBy: { createdAt: "desc" },
      });

      matchingOrders = allOrders.filter((o) => {
        const cust = (o.customer as any) || {};
        const email = String(cust.email || "").toLowerCase();
        const phone = String(cust.phone || "").replace(/\D/g, "");
        const cleanSearch = searchTerm.replace(/\D/g, "");

        if (email && email === searchTerm) return true;
        if (cleanSearch.length >= 7 && phone && phone.includes(cleanSearch)) return true;
        if (o.orderNumber.toLowerCase() === searchTerm) return true;
        return false;
      });
    }

    if (matchingOrders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No matching order found. Please check your Order ID or contact details and try again.",
        },
        { status: 404 }
      );
    }

    // Format orders for safe customer consumption
    const formattedOrders = matchingOrders.map((order) => {
      const cust = (order.customer as any) || {};
      const shippingAddress =
        cust.shippingAddress || (order as any).shippingAddress || null;

      return {
        id: order.id,
        _id: order.id,
        orderNumber: order.orderNumber,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        orderStatus: order.orderStatus || "pending",
        paymentStatus: order.paymentStatus || "pending",
        paymentMethod: order.paymentMethod || "cod",
        trackingNumber: order.trackingNumber || null,
        subtotal: Number(order.subtotal) || 0,
        shippingFee: Number(order.shippingFee) || 0,
        total: Number(order.total) || 0,
        customer: {
          name: cust.name || "",
          email: cust.email || "",
          phone: cust.phone || "",
        },
        shippingAddress: shippingAddress
          ? {
              address: shippingAddress.address || "",
              city: shippingAddress.city || "",
              state: shippingAddress.state || "",
              pincode: shippingAddress.pincode || "",
              landmark: shippingAddress.landmark || "",
            }
          : null,
        items: Array.isArray(order.items)
          ? order.items.map((item: any) => ({
              productId: item.productId || item.id || "",
              name: item.name || "Boutique Piece",
              slug: item.slug || "",
              price: Number(item.price) || 0,
              quantity: Number(item.quantity) || 1,
              size: item.size || "",
              color: item.color || "",
              image: item.image || "",
              sku: item.sku || "",
            }))
          : [],
        notes: order.notes || "",
      };
    });

    return NextResponse.json({
      success: true,
      count: formattedOrders.length,
      order: formattedOrders[0],
      orders: formattedOrders,
    });
  } catch (error) {
    console.error("Order tracking error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Unable to retrieve order details right now. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId") || searchParams.get("q") || "";
  const emailOrPhone = searchParams.get("email") || searchParams.get("phone") || "";

  // Delegate to POST logic
  return POST(
    new NextRequest(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, emailOrPhone }),
    })
  );
}
