import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access." },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim().toLowerCase() || "";
    const status = searchParams.get("status")?.trim().toLowerCase() || "all";

    const where: {
      email?: { contains: string };
      status?: string;
    } = {};

    if (search) {
      where.email = { contains: search };
    }

    if (status === "active" || status === "unsubscribed") {
      where.status = status;
    }

    const [subscribers, totalCount, activeCount, unsubscribedCount] = await Promise.all([
      prisma.newsletter.findMany({
        where,
        orderBy: { createdAt: "desc" },
      }),
      prisma.newsletter.count(),
      prisma.newsletter.count({ where: { status: "active" } }),
      prisma.newsletter.count({ where: { status: "unsubscribed" } }),
    ]);

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const thisMonthCount = await prisma.newsletter.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    return NextResponse.json({
      success: true,
      subscribers: subscribers.map((sub) => ({
        id: sub.id,
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

    const deleted = await prisma.newsletter.delete({
      where: { id },
    });

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

    const updated = await prisma.newsletter.update({
      where: { id },
      data: { status },
    });

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
