import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/server-service";

import { NextRequest, NextResponse } from "next/server";

// GET - Get all portfolios or a specific portfolio by ID
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Get a single portfolio by ID
      const portfolio = await prisma.portfolio.findUnique({
        where: { id },
      });

      if (!portfolio) {
        return NextResponse.json(
          { error: "Portfolio not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(portfolio, { status: 200 });
    } else {
      // Get all portfolios
      const portfolios = await prisma.portfolio.findMany();
      return NextResponse.json(portfolios, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching portfolios:", error);
    return NextResponse.json(
      { error: "Failed to fetch portfolios" },
      { status: 500 }
    );
  }
}

// POST - Create a new portfolio (requires authentication)
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const { url, title } = body;

    // Validate required field
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Check if portfolio with this URL already exists
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { url },
    });

    if (existingPortfolio) {
      return NextResponse.json(
        { error: "A portfolio with this URL already exists" },
        { status: 409 }
      );
    }

    // Create portfolio
    const portfolio = await prisma.portfolio.create({
      data: {
        url,
        title: title || "Portfolio", // Use provided title or default
      },
    });

    return NextResponse.json(portfolio, { status: 201 });
  } catch (error) {
    console.error("Error creating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to create portfolio" },
      { status: 500 }
    );
  }
}

// PUT - Update a portfolio (requires authentication)
export async function PUT(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Portfolio ID is required" },
        { status: 400 }
      );
    }

    // Check if portfolio exists
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { url, title } = body;

    // If URL is being updated, check for uniqueness
    if (url && url !== existingPortfolio.url) {
      const urlExists = await prisma.portfolio.findUnique({
        where: { url },
      });

      if (urlExists) {
        return NextResponse.json(
          { error: "A portfolio with this URL already exists" },
          { status: 409 }
        );
      }
    }

    // Update portfolio
    const updatedPortfolio = await prisma.portfolio.update({
      where: { id },
      data: {
        url,
        title: title || "Portfolio",
      },
    });

    return NextResponse.json(updatedPortfolio, { status: 200 });
  } catch (error) {
    console.error("Error updating portfolio:", error);
    return NextResponse.json(
      { error: "Failed to update portfolio" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a portfolio (requires authentication)
export async function DELETE(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Portfolio ID is required" },
        { status: 400 }
      );
    }

    // Check if portfolio exists
    const existingPortfolio = await prisma.portfolio.findUnique({
      where: { id },
    });

    if (!existingPortfolio) {
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );
    }

    // Delete portfolio
    await prisma.portfolio.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Portfolio deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return NextResponse.json(
      { error: "Failed to delete portfolio" },
      { status: 500 }
    );
  }
}
