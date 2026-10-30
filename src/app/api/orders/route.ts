import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Order from "@/models/Order";
import Product from "@/models/Product";
import StoreSettings from "@/models/StoreSettings";

export async function GET() {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      orders: JSON.parse(JSON.stringify(orders)),
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

    await connectToDatabase();

    // Verify products and build order items
    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const quantity = Math.max(1, Number(item.quantity) || 1);
      let product = null;

      if (item.productId && mongoose.Types.ObjectId.isValid(item.productId)) {
        product = await Product.findById(item.productId).lean();
      }

      const name = product?.name || item.name || "Boutique Attire";
      const slug = product?.slug || item.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const price = Number(product?.price != null ? product.price : item.price) || 0;
      const image = (product?.images && product.images[0]) || item.image || "";

      subtotal += price * quantity;

      orderItems.push({
        productId: product?._id || (mongoose.Types.ObjectId.isValid(item.productId) ? item.productId : new mongoose.Types.ObjectId()),
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
    let shippingCharge = 0;
    try {
      const settings = await StoreSettings.findOne().lean();
      if (settings) {
        if (settings.freeShippingThreshold > 0 && subtotal >= settings.freeShippingThreshold) {
          shippingCharge = 0;
        } else {
          shippingCharge = Number(settings.shippingCharge) || 0;
        }
      }
    } catch (e) {
      console.warn("Could not load StoreSettings for shipping calculation:", e);
    }

    const total = subtotal + shippingCharge;

    // Generate unique order number
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MYD-${dateStr}-${randomSuffix}`;

    const newOrder = await Order.create({
      orderNumber,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
      },
      shippingAddress: {
        address: shippingAddress.address.trim(),
        city: shippingAddress.city.trim(),
        state: shippingAddress.state.trim(),
        pincode: shippingAddress.pincode.trim(),
        landmark: (shippingAddress.landmark || "").trim(),
      },
      items: orderItems,
      subtotal,
      shippingCharge,
      total,
      paymentMethod: paymentMethod === "online" ? "online" : "cod",
      paymentStatus: "pending",
      orderStatus: "pending",
    });

    return NextResponse.json({
      success: true,
      message: "Order placed successfully.",
      orderNumber: newOrder.orderNumber,
      order: JSON.parse(JSON.stringify(newOrder)),
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

    const updates: Record<string, string> = {};

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

      updates.orderStatus = orderStatus;
    }

    if (paymentStatus !== undefined) {
      if (!validPaymentStatuses.includes(paymentStatus)) {
        return NextResponse.json(
          { success: false, message: "Invalid payment status" },
          { status: 400 }
        );
      }

      updates.paymentStatus = paymentStatus;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: "No changes provided" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const order = await Order.findByIdAndUpdate(
      orderId,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean();

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order updated successfully",
      order: JSON.parse(JSON.stringify(order)),
    });
  } catch (error) {
    console.error("UPDATE ORDER ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update order" },
      { status: 500 }
    );
  }
}
