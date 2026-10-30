import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";

const checkoutSchema = z.object({
  customer: z.object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(150),
    phone: z.string().trim().min(7).max(20),
  }),
  shippingAddress: z.object({
    address: z.string().trim().min(5).max(300),
    city: z.string().trim().min(2).max(100),
    state: z.string().trim().min(2).max(100),
    pincode: z.string().trim().regex(/^[0-9]{6}$/),
    landmark: z.string().trim().max(150).optional().default(""),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().refine((value) =>
          mongoose.Types.ObjectId.isValid(value)
        ),
        quantity: z.number().int().min(1).max(20),
        size: z.string().optional(),
        color: z.string().optional(),
      })
    )
    .min(1)
    .max(30),
  paymentMethod: z.enum(["cod", "online"]),
});

type ReservedStock = {
  productId: mongoose.Types.ObjectId;
  size: string;
  color: string;
  quantity: number;
};

function makeOrderNumber() {
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `MDH-${Date.now()}-${randomPart}`;
}

export async function POST(request: NextRequest) {
  const reservedStock: ReservedStock[] = [];

  try {
    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          message: "Please check your checkout details.",
          errors: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const {
      customer,
      shippingAddress,
      items,
      paymentMethod,
    } = parsed.data;

    if (paymentMethod === "online") {
      return NextResponse.json(
        {
          message:
            "Online payment is not available yet. Please select Cash on Delivery.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const orderItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await Product.findOne({
        _id: item.productId,
        isActive: true,
      }).lean();

      if (!product) {
        throw new Error("One of the products in your bag is unavailable.");
      }

      let selectedVariant:
        | {
            sku?: string;
            size?: string;
            color?: string;
            stock?: number;
          }
        | undefined;

      const variants = product.variants ?? [];

      if (variants.length > 0) {
        selectedVariant = variants.find(
          (variant) =>
            (variant.size ?? "") === (item.size ?? "") &&
            (variant.color ?? "") === (item.color ?? "")
        );

        if (!selectedVariant) {
          throw new Error(
            `${product.name}: the selected size or color is unavailable.`
          );
        }

        if ((selectedVariant.stock ?? 0) < item.quantity) {
          throw new Error(
            `${product.name}: insufficient stock for the selected variant.`
          );
        }
      } else if (item.size || item.color) {
        throw new Error(
          `${product.name}: the selected variant is no longer available.`
        );
      }

      const price = Number(product.price);

      if (!Number.isFinite(price) || price < 0) {
        throw new Error(`${product.name}: invalid product price.`);
      }

      subtotal += price * item.quantity;

      orderItems.push({
        productId: new mongoose.Types.ObjectId(item.productId),
        name: product.name,
        slug: product.slug,
        image: product.images?.[0] ?? "",
        price,
        quantity: item.quantity,
        sku: selectedVariant?.sku,
        size: selectedVariant?.size,
        color: selectedVariant?.color,
      });
    }

    // Reserve stock using an atomic update so concurrent checkouts
    // cannot both purchase the last available units.
    for (const item of items) {
      const productId = new mongoose.Types.ObjectId(item.productId);
      const product = await Product.findById(productId)
        .select("variants")
        .lean();

      if (!product || !product.variants?.length) {
        continue;
      }

      const size = item.size ?? "";
      const color = item.color ?? "";

      const stockUpdate = await Product.updateOne(
        {
          _id: productId,
          isActive: true,
          variants: {
            $elemMatch: {
              size,
              color,
              stock: { $gte: item.quantity },
            },
          },
        },
        {
          $inc: {
            "variants.$[variant].stock": -item.quantity,
          },
        },
        {
          arrayFilters: [
            {
              "variant.size": size,
              "variant.color": color,
              "variant.stock": { $gte: item.quantity },
            },
          ],
        }
      );

      if (stockUpdate.modifiedCount !== 1) {
        throw new Error(
          "Stock has changed while you were checking out. Please review your bag and try again."
        );
      }

      reservedStock.push({
        productId,
        size,
        color,
        quantity: item.quantity,
      });
    }

    const shippingCharge = 0;
    const total = subtotal + shippingCharge;

    const order = await Order.create({
      orderNumber: makeOrderNumber(),
      customer,
      shippingAddress,
      items: orderItems,
      subtotal,
      shippingCharge,
      total,
      paymentMethod: "cod",
      paymentStatus: "pending",
      orderStatus: "confirmed",
    });

    return NextResponse.json(
      {
        message: "Your order has been placed successfully.",
        orderNumber: order.orderNumber,
      },
      { status: 201 }
    );
  } catch (error) {
    // Restore any stock already reserved if order creation fails.
    if (reservedStock.length > 0) {
      try {
        await connectToDatabase();

        for (const item of reservedStock) {
          await Product.updateOne(
            { _id: item.productId },
            {
              $inc: {
                "variants.$[variant].stock": item.quantity,
              },
            },
            {
              arrayFilters: [
                {
                  "variant.size": item.size,
                  "variant.color": item.color,
                },
              ],
            }
          );
        }
      } catch (rollbackError) {
        console.error("Stock rollback failed:", rollbackError);
      }
    }

    console.error("Order creation error:", error);

    return NextResponse.json(
      {
        message:
          error instanceof Error
            ? error.message
            : "Unable to place your order. Please try again.",
      },
      { status: 400 }
    );
  }
}