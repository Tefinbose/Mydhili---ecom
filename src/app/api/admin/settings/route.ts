
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import StoreSettings from "@/models/StoreSettings";

const defaultSettings = {
  storeName: "Mydhili Boutique",
  tagline: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  logoUrl: "",
  shippingCharge: 0,
  freeShippingThreshold: 0,
  codEnabled: true,
  onlinePaymentEnabled: true,
};

const allowedStringFields = [
  "storeName",
  "tagline",
  "email",
  "phone",
  "whatsapp",
  "address",
  "city",
  "state",
  "pincode",
  "logoUrl",
] as const;

const allowedNumberFields = [
  "shippingCharge",
  "freeShippingThreshold",
] as const;

const allowedBooleanFields = [
  "codEnabled",
  "onlinePaymentEnabled",
] as const;

export async function GET() {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {

    await connectToDatabase();

    let settings = await StoreSettings.findOne();

    if (!settings) {
      settings = await StoreSettings.create(defaultSettings);
    }

    return NextResponse.json({
      success: true,
      settings: settings.toObject(),
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

    const updateData: Record<string, string | number | boolean> = {};

    for (const field of allowedStringFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "string") {
          return NextResponse.json(
            { success: false, message: `${field} must be text.` },
            { status: 400 }
          );
        }

        updateData[field] = body[field].trim();
      }
    }

    for (const field of allowedNumberFields) {
      if (body[field] !== undefined) {
        const value = Number(body[field]);

        if (!Number.isFinite(value) || value < 0) {
          return NextResponse.json(
            {
              success: false,
              message: `${field} must be a valid non-negative number.`,
            },
            { status: 400 }
          );
        }

        updateData[field] = value;
      }
    }

    for (const field of allowedBooleanFields) {
      if (body[field] !== undefined) {
        if (typeof body[field] !== "boolean") {
          return NextResponse.json(
            { success: false, message: `${field} must be true or false.` },
            { status: 400 }
          );
        }

        updateData[field] = body[field];
      }
    }

    if (
      body.email !== undefined &&
      body.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
    ) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (
      updateData.storeName !== undefined &&
      !String(updateData.storeName).trim()
    ) {
      return NextResponse.json(
        { success: false, message: "Store name is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const settings = await StoreSettings.findOneAndUpdate(
      {},
      {
        $set: updateData,
        $setOnInsert: defaultSettings,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Store settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error("UPDATE store settings error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update store settings." },
      { status: 500 }
    );
  }
}
