import { NextRequest, NextResponse } from "next/server";
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
    const rawOrders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
    });

    const orders = rawOrders.map((order) => {
      const cust = (order.customer as any) || {};
      return {
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
        shippingCharge: Number(order.shippingFee),
        total: Number(order.total),
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        trackingNumber: order.trackingNumber,
        notes: order.notes,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };
    });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load orders" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON in request body.", message: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { customer, shippingAddress, items, paymentMethod = "cod" } = body || {};

    const customerName = (customer?.name || customer?.fullName || "").trim();
    const customerEmail = (customer?.email || "").trim().toLowerCase();
    const customerPhone = (customer?.phone || "").trim();

    if (!customerName || !customerEmail || !customerPhone) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide your full name, email address, and phone number.",
          message: "Please provide your full name, email address, and phone number.",
        },
        { status: 400 }
      );
    }

    if (
      !shippingAddress?.address?.trim() ||
      !shippingAddress?.city?.trim() ||
      !shippingAddress?.state?.trim() ||
      !shippingAddress?.pincode?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Please complete your delivery address (street address, city, state, and 6-digit PIN code).",
          message: "Please complete your delivery address (street address, city, state, and 6-digit PIN code).",
        },
        { status: 400 }
      );
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Your shopping bag is empty. Please add items to checkout.",
          message: "Your shopping bag is empty. Please add items to checkout.",
        },
        { status: 400 }
      );
    }

    // Verify products and build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      let product = null;

      if (item.productId && typeof item.productId === "string") {
        product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
      }

      const name = product?.name || item.name || "Boutique Attire";
      const slug = product?.slug || item.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const price = Number(product?.price != null ? product.price : item.price) || 0;
      const imagesArr = Array.isArray(product?.images) ? (product.images as string[]) : [];
      const image = imagesArr[0] || item.image || "";

      subtotal += price * quantity;

      orderItems.push({
        productId: product?.id || item.productId || `prod_${Date.now()}`,
        name,
        slug,
        image,
        price,
        quantity,
        sku: item.sku || "",
        size: item.size || "",
        color: item.color || "",
      });
    }

    // Determine shipping charge from StoreSettings
    let shippingFee = 0;
    try {
      const settings = await prisma.storeSettings.findFirst();
      if (settings) {
        const freeThreshold = Number(settings.freeShippingThreshold) || 0;
        if (freeThreshold > 0 && subtotal >= freeThreshold) {
          shippingFee = 0;
        } else {
          shippingFee = Number(settings.shippingFee) || 0;
        }
      }
    } catch (e) {
      console.warn("Could not load StoreSettings for shipping calculation:", e);
    }

    const total = subtotal + shippingFee;

    // Generate unique order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MYD-${dateStr}-${randomSuffix}`;

    const newOrder = await prisma.order.create({
      data: {
        orderNumber,
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          shippingAddress: {
            address: shippingAddress.address.trim(),
            city: shippingAddress.city.trim(),
            state: shippingAddress.state.trim(),
            pincode: shippingAddress.pincode.trim(),
            landmark: (shippingAddress.landmark || "").trim(),
          },
        },
        items: orderItems,
        subtotal,
        shippingFee,
        total,
        paymentMethod: paymentMethod === "online" ? "online" : "cod",
        paymentStatus: "pending",
        orderStatus: "pending",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully.",
      orderNumber: newOrder.orderNumber,
      order: {
        _id: newOrder.id,
        id: newOrder.id,
        orderNumber: newOrder.orderNumber,
        customer: newOrder.customer,
        shippingAddress: (newOrder.customer as any)?.shippingAddress,
        items: newOrder.items,
        subtotal: Number(newOrder.subtotal),
        shippingFee: Number(newOrder.shippingFee),
        total: Number(newOrder.total),
        paymentMethod: newOrder.paymentMethod,
        paymentStatus: newOrder.paymentStatus,
        orderStatus: newOrder.orderStatus,
        createdAt: newOrder.createdAt,
      },
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unable to place your order. Please try again.",
        message: error instanceof Error ? error.message : "Unable to place your order. Please try again.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, orderStatus, paymentStatus } = body;

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: "Order ID is required" },
        { status: 400 }
      );
    }

    const data: { orderStatus?: string; paymentStatus?: string } = {};

    const validOrderStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];

    const validPaymentStatuses = ["pending", "paid", "failed"];

    if (orderStatus !== undefined) {
      if (!validOrderStatuses.includes(orderStatus)) {
        return NextResponse.json(
          { success: false, message: "Invalid order status" },
          { status: 400 }
        );
      }
      data.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { success: false, message: "Invalid payment status" },
          { status: 400 }
        );
      }
      data.paymentStatus = paymentStatus;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { success: false, message: "No changes provided" },
        { status: 400 }
      );
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data,
    });

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: {
        _id: updated.id,
        id: updated.id,
        orderNumber: updated.orderNumber,
        customer: updated.customer,
        shippingAddress: (updated.customer as any)?.shippingAddress,
        items: updated.items,
        subtotal: Number(updated.subtotal),
        shippingFee: Number(updated.shippingFee),
        total: Number(updated.total),
        paymentMethod: updated.paymentMethod,
        paymentStatus: updated.paymentStatus,
        orderStatus: updated.orderStatus,
        createdAt: updated.createdAt,
      },
    });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}
