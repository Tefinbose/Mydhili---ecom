
import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { setAdminSession } from "@/lib/auth";



function safeCompare(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  return (
    aBuffer.length === bBuffer.length &&
    timingSafeEqual(aBuffer, bBuffer)
  );
}

export async function POST(request: NextRequest) {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (
      !adminEmail ||
      !adminPassword ||
      !sessionSecret ||
      sessionSecret.length < 32
    ) {
      console.error("Admin authentication environment variables are missing.");

      return NextResponse.json(
        { success: false, message: "Admin login is not configured." },
        { status: 500 }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";

    if (!contentType.includes("application/json")) {
      return NextResponse.json(
        { success: false, message: "Invalid request." },
        { status: 415 }
      );
    }

    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("email" in body) ||
      !("password" in body) ||
      typeof body.email !== "string" ||
      typeof body.password !== "string" ||
      body.email.length > 254 ||
      body.password.length > 1024
    ) {
      return NextResponse.json(
        { success: false, message: "Please enter valid credentials." },
        { status: 400 }
      );
    }

    const emailMatches = safeCompare(
      body.email.trim().toLowerCase(),
      adminEmail.trim().toLowerCase()
    );

    const passwordMatches = safeCompare(body.password, adminPassword);

    if (!emailMatches || !passwordMatches) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password." },
        { status: 401 }
      );
    }

    await setAdminSession(adminEmail);

    return NextResponse.json({
      success: true,
      message: "Login successful.",
    });
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to log in." },
      { status: 500 }
    );
  }
}
