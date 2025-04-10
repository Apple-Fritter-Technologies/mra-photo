import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/server-service";

import { NextRequest, NextResponse } from "next/server";

// GET - Get all bookings or filter by various parameters
export async function GET(req: NextRequest) {
  try {
    // Verify authentication for viewing bookings
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Get bookings with filters
    const bookings = await prisma.booking.findMany({
      include: { product: true },
      orderBy: { created_at: "desc" },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

// POST - Create a new booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      date,
      time,
      product_id,
      session_name,
      heard_from,
      message,
    } = body;

    // Validate required fields
    if (!name || !email || !date || !time) {
      return NextResponse.json(
        { error: "Name, email, date and time are required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // If product_id is provided, check if product exists
    if (product_id) {
      const product = await prisma.product.findUnique({
        where: { id: product_id },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Selected product does not exist" },
          { status: 404 }
        );
      }
    }

    // Parse date string to Date object
    const bookingDate = new Date(date);

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        name,
        email,
        date: bookingDate,
        time,
        product_id,
        session_name,
        heard_from,
        message,
      },
      include: { product: true },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing booking
export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Authentication required for updating bookings
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const body = await req.json();
    const {
      name,
      email,
      date,
      time,
      product_id,
      session_name,
      heard_from,
      message,
    } = body;

    // If product_id is updated, check if product exists
    if (product_id && product_id !== existingBooking.product_id) {
      const product = await prisma.product.findUnique({
        where: { id: product_id },
      });

      if (!product) {
        return NextResponse.json(
          { error: "Selected product does not exist" },
          { status: 404 }
        );
      }
    }

    // If email is provided, validate format
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: "Invalid email format" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (date !== undefined) updateData.date = new Date(date);
    if (time !== undefined) updateData.time = time;
    if (product_id !== undefined) updateData.product_id = product_id;
    if (session_name !== undefined) updateData.session_name = session_name;
    if (heard_from !== undefined) updateData.heard_from = heard_from;
    if (message !== undefined) updateData.message = message;

    // Update booking
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
      include: { product: true },
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a booking
export async function DELETE(req: NextRequest) {
  try {
    // Authentication required for deleting bookings
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    // Check if booking exists
    const existingBooking = await prisma.booking.findUnique({
      where: { id },
    });

    if (!existingBooking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Delete booking
    await prisma.booking.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Booking deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
