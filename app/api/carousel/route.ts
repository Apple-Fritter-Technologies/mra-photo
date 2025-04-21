import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/server-service";

import { NextRequest, NextResponse } from "next/server";

// GET - Get all carousel items
export async function GET() {
  try {
    const carouselItems = await prisma.carousel.findMany({
      orderBy: { displayOrder: "asc" },
    });
    return NextResponse.json(carouselItems, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch carousel items" },
      { status: 500 }
    );
  }
}

// POST - Create a new carousel item (requires authentication)
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const { image_url, title } = body;

    // Validate required field
    if (!image_url) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    // Get count of existing items to set the order for the new item
    const count = await prisma.carousel.count();

    // Create carousel item
    const carouselItem = await prisma.carousel.create({
      data: {
        image_url,
        title: title || "Carousel", // Use provided title or default
        displayOrder: count, // Place at the end by default
      },
    });

    return NextResponse.json(carouselItem, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create carousel item" },
      { status: 500 }
    );
  }
}

// PUT - Update a carousel item (requires authentication)
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
        { error: "Carousel item ID is required" },
        { status: 400 }
      );
    }

    // Check if carousel item exists
    const existingCarouselItem = await prisma.carousel.findUnique({
      where: { id },
    });

    if (!existingCarouselItem) {
      return NextResponse.json(
        { error: "Carousel item not found" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { image_url, title } = body;

    // Update carousel item
    const updatedCarouselItem = await prisma.carousel.update({
      where: { id },
      data: {
        image_url,
        title: title || "Carousel",
      },
    });

    return NextResponse.json(updatedCarouselItem, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update carousel item" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a carousel item (requires authentication)
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
        { error: "Carousel item ID is required" },
        { status: 400 }
      );
    }

    // Check if carousel item exists
    const existingCarouselItem = await prisma.carousel.findUnique({
      where: { id },
    });

    if (!existingCarouselItem) {
      return NextResponse.json(
        { error: "Carousel item not found" },
        { status: 404 }
      );
    }

    // Delete carousel item
    await prisma.carousel.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Carousel item deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete carousel item" },
      { status: 500 }
    );
  }
}

// PATCH - Reorder carousel items (requires authentication)
export async function PATCH(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const { orderedIds } = body;

    // Validate required fields
    if (!orderedIds || !Array.isArray(orderedIds) || orderedIds.length === 0) {
      return NextResponse.json(
        { error: "Valid orderedIds array is required" },
        { status: 400 }
      );
    }

    // Verify all IDs exist in the database
    const existingItems = await prisma.carousel.findMany({
      where: {
        id: {
          in: orderedIds,
        },
      },
    });

    if (existingItems.length !== orderedIds.length) {
      return NextResponse.json(
        { error: "One or more carousel items do not exist" },
        { status: 400 }
      );
    }

    // Update the order of each item using a transaction
    await prisma.$transaction(
      orderedIds.map((id, index) =>
        prisma.carousel.update({
          where: { id },
          data: { displayOrder: index },
        })
      )
    );

    // Fetch the updated carousel items
    const updatedItems = await prisma.carousel.findMany({
      orderBy: { displayOrder: "asc" },
    });

    return NextResponse.json(
      {
        message: "Carousel items reordered successfully",
        items: updatedItems,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error reordering carousel items:", error);
    return NextResponse.json(
      { error: "Failed to reorder carousel items" },
      { status: 500 }
    );
  }
}
