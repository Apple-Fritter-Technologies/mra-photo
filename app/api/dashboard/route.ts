import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/server-service";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const totalProducts = await prisma.product.count();
    const totalPortfolios = await prisma.portfolio.count();
    const totalUsers = await prisma.user.count();
    const totalInquiries = await prisma.booking.count();
    const totalCarousels = await prisma.carousel.count();
    const totalOrders = await prisma.order.count();

    return NextResponse.json(
      {
        totalProducts,
        totalPortfolios,
        totalUsers,
        totalInquiries,
        totalCarousels,
        totalOrders,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
