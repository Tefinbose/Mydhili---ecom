import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json({
      success: true,
      message: "MongoDB connected successfully",
    });
  } catch (error) {
    console.error(`MongoDB connection failed ${error}`);

    return NextResponse.json(
      {
        success: false,
        message: "Could not connect to MongoDB",
      },
      { status: 500 },
    );
  }
}
