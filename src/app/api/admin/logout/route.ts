import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearAdminSession();

    return NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error("Admin logout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to log out.",
      },
      { status: 500 }
    );
  }
}