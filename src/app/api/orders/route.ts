
import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";

import {connectToDatabase} from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

const OrderRequestSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(2).max(100),
    email: z.union([z.string().trim().email(), z.literal("")]).optional(),
    phone: z.string().trim().min(10).max(20),
  }),

  shippingAddress: z.object({
    address: z.string().trim().min(5).max(300),
    landmark: z.string().trim().max(150).optional().default(""),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(100),
    pincode: z.string().trim().min(4).max(12),
    notes: z.string().trim().max(500).optional().default(""),
  }),

  items: z.array(
    z.object({
      productId: z.string().trim().min(1),
      quantity: z.number().int().min(1).max(50),
      sku: z.string().trim().optional().default(""),
      size: z.string().trim().optional().default(""),
      color: z.string().trim().optional().default(""),
    })
  ).min(1).max(100),

  paymentMethod: z.enum(["cod", "razorpay"]),
});

function generateOrderNumber() {
  return `MYD-${Date.now().toString().slice(-8)}-${randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validation = OrderRequestSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check your checkout details.",
          errors: validation.error.flatten(),
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    await connectToDatabase();

    // Combine duplicate product variants.
    const combinedItems = new Map<
      string,
      {
        productId: string;
        quantity: number;
        sku: string;
        size: string;
        color: string;
      }
    >();

    for (const item of data.items) {
      if (!mongoose.isValidObjectId(item.productId)) {
        return NextResponse.json(
          { success: false, message: "Invalid product ID in cart." },
          { status: 400 }
        );
      }

      const key = [
        item.productId,
        item.sku,
        item.size,
        item.color,
      ].join("|");

      const existing = combinedItems.get(key);

      if (existing) {
        existing.quantity += item.quantity;

        if (existing.quantity > 50) {
          return NextResponse.json(
            { success: false, message: "Maximum quantity exceeded." },
            { status: 400 }
          );
        }
      } else {
        combinedItems.set(key, { ...item });
      }
    }

    // Explicit type for the MongoDB session.
    const session: import("mongoose").ClientSession =
      await mongoose.startSession();

    try {
      let savedOrder: InstanceType<typeof Order> | null = null;

      await session.withTransaction(async () => {
        const orderItems: Array<{
          product: mongoose.Types.ObjectId;
          name: string;
          slug: string;
          sku: string;
          size: string;
          color: string;
          image: string;
          price: number;
          quantity: number;
          lineTotal: number;
        }> = [];

        let subtotal = 0;

        for (const item of combinedItems.values()) {
          const product = await Product.findOne({
            _id: item.productId,
            isActive: true,
          }).session(session);

          if (!product) {
            throw new Error("PRODUCT_NOT_FOUND");
          }

          const variant = product.variants.find((entry) => {
            if (item.sku) {
              return entry.sku === item.sku;
            }

            return (
              (entry.size ?? "") === item.size &&
              (entry.color ?? "") === item.color
            );
          });

          if (!variant) {
            throw new Error("VARIANT_NOT_FOUND");
          }

          if ((variant.stock ?? 0) < item.quantity) {
            throw new Error("INSUFFICIENT_STOCK");
          }

          const price = Number(product.price);

          if (!Number.isFinite(price) || price < 0) {
            throw new Error("INVALID_PRICE");
          }

          const lineTotal = price * item.quantity;
          subtotal += lineTotal;

          orderItems.push({
            product: product._id,
            name: product.name,
            slug: product.slug,
            sku: variant.sku ?? "",
            size: variant.size ?? "",
            color: variant.color ?? "",
            image: product.images?.[0] ?? "",
            price,
            quantity: item.quantity,
            lineTotal,
          });

          // Reduce stock for COD orders within the transaction.
          if (data.paymentMethod === "cod") {
            const stockUpdate = await Product.updateOne(
              {
                _id: product._id,
                isActive: true,
                variants: {
                  $elemMatch: {
                    sku: variant.sku,
                    stock: { $gte: item.quantity },
                  },
                },
              },
              {
                $inc: {
                  "variants.$[selectedVariant].stock": -item.quantity,
                },
              },
              {
                arrayFilters: [
                  {
                    "selectedVariant.sku": variant.sku,
                    "selectedVariant.stock": { $gte: item.quantity },
                  },
                ],
                session,
              }
            );

            if (stockUpdate.modifiedCount !== 1) {
              throw new Error("INSUFFICIENT_STOCK");
            }
          }
        }

        const paymentMethod =
          data.paymentMethod === "cod" ? "COD" : "RAZORPAY";

        const [createdOrder] = await Order.create(
          [
            {
              orderNumber: generateOrderNumber(),
              customer: {
                fullName: data.customer.fullName,
                email: data.customer.email ?? "",
                phone: data.customer.phone,
              },
              shippingAddress: {
                address: data.shippingAddress.address,
                landmark: data.shippingAddress.landmark ?? "",
                city: data.shippingAddress.city,
                state: data.shippingAddress.state,
                pincode: data.shippingAddress.pincode,
                notes: data.shippingAddress.notes ?? "",
              },
              items: orderItems,
              subtotal,
              shippingCharge: 0,
              discount: 0,
              total: subtotal,
              paymentMethod,
              paymentStatus:
                paymentMethod === "COD" ? "COD_PENDING" : "PENDING",
              orderStatus: "PENDING",
            },
          ],
          { session }
        );

        savedOrder = createdOrder;
      });

      if (!savedOrder) {
        return NextResponse.json(
          { success: false, message: "Order could not be created." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          success: true,
          message: "Order created successfully.",
          order: {
            id: savedOrder._id.toString(),
            orderNumber: savedOrder.orderNumber,
            subtotal: savedOrder.subtotal,
            shippingCharge: savedOrder.shippingCharge,
            discount: savedOrder.discount,
            total: savedOrder.total,
            paymentMethod: savedOrder.paymentMethod,
            paymentStatus: savedOrder.paymentStatus,
            orderStatus: savedOrder.orderStatus,
          },
        },
        { status: 201 }
      );
    } finally {
      await session.endSession();
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";

    if (message === "PRODUCT_NOT_FOUND") {
      return NextResponse.json(
        { success: false, message: "A product in your cart is unavailable." },
        { status: 400 }
      );
    }

    if (message === "VARIANT_NOT_FOUND") {
      return NextResponse.json(
        { success: false, message: "A selected size or color is unavailable." },
        { status: 400 }
      );
    }

    if (message === "INSUFFICIENT_STOCK") {
      return NextResponse.json(
        { success: false, message: "Insufficient stock for a selected product." },
        { status: 409 }
      );
    }

    if (message === "INVALID_PRICE") {
      return NextResponse.json(
        { success: false, message: "A product has an invalid price." },
        { status: 500 }
      );
    }

    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to place your order. Please try again.",
      },
      { status: 500 }
    );
  }
}
