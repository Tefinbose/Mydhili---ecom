import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Newsletter from "@/models/Newsletter";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const rawEmail = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!rawEmail || !EMAIL_REGEX.test(rawEmail)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const existing = await Newsletter.findOne({ email: rawEmail });

    if (existing) {
      if (existing.status === "active") {
        return NextResponse.json({
          success: true,
          message: "You are already subscribed to our newsletter! Thank you.",
        });
      }

      // Re-activate if was unsubscribed
      existing.status = "active";
      await existing.save();

      return NextResponse.json({
        success: true,
        message: "Welcome back! Your newsletter subscription has been reactivated.",
      });
    }

    await Newsletter.create({
      email: rawEmail,
      status: "active",
      source: typeof body?.source === "string" ? body.source.slice(0, 50) : "website_footer",
    });

    return NextResponse.json({
      success: true,
      message: "Thank you for subscribing to Mydhili Collections! Welcome to our inner circle.",
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to process subscription right now. Please try again later." },
      { status: 500 }
    );
  }
}
