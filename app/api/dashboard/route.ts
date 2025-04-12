import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/server-service";

import { NextRequest, NextResponse } from "next/server";

// get the total number of portfolios and the total number of users and the total number of bookings and upcoming bookings
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
    const totalBookings = await prisma.booking.count();

    return NextResponse.json(
      {
        totalProducts,
        totalPortfolios,
        totalUsers,
        totalBookings,
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
