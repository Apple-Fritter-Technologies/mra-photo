import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/server-service";

import { NextRequest, NextResponse } from "next/server";

// GET - Get all products or a single product if id is provided
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      // Get single product by ID
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(product, { status: 200 });
    } else {
      // Get all products
      const products = await prisma.product.findMany();
      return NextResponse.json(products, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create a new product (requires authentication)
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const { title, price, description, duration, photos, image_url, cta } =
      body;

    // Validate required fields
    if (!title || !price || !duration || !photos || !image_url) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if product with same title exists
    const existingProduct = await prisma.product.findFirst({
      where: { title },
    });

    if (existingProduct) {
      return NextResponse.json(
        {
          error: "The product already exists. Please choose a different title!",
        },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        title,
        price,
        description,
        duration,
        photos,
        image_url,
        cta: cta || "Book Now",
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

// PUT - Update a product (requires authentication)
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await req.json();

    // Update product
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        title: body.title,
        price: body.price,
        description: body.description,
        duration: body.duration,
        photos: body.photos,
        image_url: body.image_url,
        cta: body.cta || "Book Now",
      },
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a product (requires authentication)
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Check if product has associated bookings
    const bookings = await prisma.booking.findMany({
      where: { product_id: id },
    });

    if (bookings.length > 0) {
      return NextResponse.json(
        { error: "Cannot delete product with existing bookings" },
        { status: 400 }
      );
    }

    // Delete product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
