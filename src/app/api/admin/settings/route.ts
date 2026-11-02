import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    let settings = await prisma.storeSettings.findFirst();

    if (!settings) {
      settings = await prisma.storeSettings.create({
        data: {
          id: "default",
          storeName: "Mydhili Collections",
          supportEmail: "contact@mydhiliboutique.com",
          supportPhone: "+91 98765 43210",
          currency: "INR",
          shippingFee: 0,
          freeShippingThreshold: 999,
          codEnabled: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      settings: {
        storeName: settings.storeName,
        email: settings.supportEmail || "",
        phone: settings.supportPhone || "",
        shippingCharge: Number(settings.shippingFee),
        shippingFee: Number(settings.shippingFee),
        freeShippingThreshold: Number(settings.freeShippingThreshold),
        codEnabled: settings.codEnabled,
        currency: settings.currency,
      },
    });
  } catch (error) {
    console.error("GET store settings error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to load store settings." },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Unauthorized access." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const data: {
      storeName?: string;
      supportEmail?: string;
      supportPhone?: string;
      shippingFee?: number;
      freeShippingThreshold?: number;
      codEnabled?: boolean;
    } = {};

    if (body.storeName !== undefined) {
      const name = String(body.storeName).trim();
      if (!name) {
        return NextResponse.json(
          { success: false, message: "Store name is required." },
          { status: 400 }
        );
      }
      data.storeName = name;
    }

    if (body.email !== undefined) {
      const email = String(body.email).trim();
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { success: false, message: "Please enter a valid email address." },
          { status: 400 }
        );
      }
      data.supportEmail = email;
    }

    if (body.phone !== undefined) {
      data.supportPhone = String(body.phone).trim();
    }

    if (body.shippingCharge !== undefined || body.shippingFee !== undefined) {
      const val = Number(body.shippingCharge ?? body.shippingFee);
      if (!Number.isFinite(val) || val < 0) {
        return NextResponse.json(
          { success: false, message: "Shipping fee must be a valid non-negative number." },
          { status: 400 }
        );
      }
      data.shippingFee = val;
    }

    if (body.freeShippingThreshold !== undefined) {
      const val = Number(body.freeShippingThreshold);
      if (!Number.isFinite(val) || val < 0) {
        return NextResponse.json(
          { success: false, message: "Free shipping threshold must be a valid non-negative number." },
          { status: 400 }
        );
      }
      data.freeShippingThreshold = val;
    }

    if (body.codEnabled !== undefined) {
      data.codEnabled = Boolean(body.codEnabled);
    }

    const updated = await prisma.storeSettings.upsert({
      where: { id: "default" },
      update: data,
      create: {
        id: "default",
        storeName: data.storeName || "Mydhili Collections",
        supportEmail: data.supportEmail,
        supportPhone: data.supportPhone,
        shippingFee: data.shippingFee || 0,
        freeShippingThreshold: data.freeShippingThreshold || 0,
        codEnabled: data.codEnabled ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Store settings updated successfully.",
      settings: {
        storeName: updated.storeName,
        email: updated.supportEmail || "",
        phone: updated.supportPhone || "",
        shippingCharge: Number(updated.shippingFee),
        shippingFee: Number(updated.shippingFee),
        freeShippingThreshold: Number(updated.freeShippingThreshold),
        codEnabled: updated.codEnabled,
        currency: updated.currency,
      },
    });
  } catch (error) {
    console.error("UPDATE store settings error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update store settings." },
      { status: 500 }
    );
  }
}
