import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminSession } from "@/lib/auth";
import Newsletter from "@/models/Newsletter";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const status = searchParams.get("status")?.trim().toLowerCase() || "all";

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.email = { $regex: search, $options: "i" };
    }

    if (status === "active" || status === "unsubscribed") {
      filter.status = status;
    }

    const [subscribers, totalCount, activeCount, unsubscribedCount] = await Promise.all([
      Newsletter.find(filter).sort({ createdAt: -1 }).lean(),
      Newsletter.countDocuments({}),
      Newsletter.countDocuments({ status: "active" }),
      Newsletter.countDocuments({ status: "unsubscribed" }),
    ]);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthCount = await Newsletter.countDocuments({
      createdAt: { $gte: startOfMonth },
    });

    return NextResponse.json({
      success: true,
      subscribers: subscribers.map((sub: any) => ({
        id: String(sub._id),
        email: sub.email,
        status: sub.status,
        source: sub.source,
        createdAt: sub.createdAt,
      })),
      stats: {
        total: totalCount,
        active: activeCount,
        unsubscribed: unsubscribedCount,
        thisMonth: thisMonthCount,
      },
    });
  } catch (error) {
    console.error("Admin GET newsletter error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to fetch newsletter subscribers." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Subscriber ID is required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deleted = await Newsletter.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, message: "Subscriber not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Subscriber removed successfully.",
    });
  } catch (error) {
    console.error("Admin DELETE newsletter error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to delete subscriber." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || (status !== "active" && status !== "unsubscribed")) {
      return NextResponse.json(
        { success: false, message: "Valid ID and status ('active' | 'unsubscribed') are required." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const updated = await Newsletter.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Subscriber not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Subscriber marked as ${status}.`,
      subscriber: updated,
    });
  } catch (error) {
    console.error("Admin PATCH newsletter error:", error);
    return NextResponse.json(
      { success: false, message: "Unable to update subscriber." },
      { status: 500 }
    );
  }
}
