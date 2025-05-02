import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/server-service";
import { NextRequest, NextResponse } from "next/server";

// GET - Get all orders or a single order if id is provided
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const userId = searchParams.get("userId");

    if (id) {
      // Get single order by ID
      const order = await prisma.order.findUnique({
        where: { id },
        include: { Product: true, User: true },
      });

      if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      // Check if user is authorized to see this order (admin can see all)
      if (auth.user?.role !== "admin" && order.user_id !== auth.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized to view this order" },
          { status: 403 }
        );
      }

      return NextResponse.json(order, { status: 200 });
    } else if (userId) {
      // Get orders for a specific user
      // Only admins or the user themselves can see their orders
      if (auth.user?.role !== "admin" && userId !== auth.user?.id) {
        return NextResponse.json(
          { error: "Unauthorized to view these orders" },
          { status: 403 }
        );
      }

      const orders = await prisma.order.findMany({
        where: { user_id: userId },
        include: { Product: true },
      });

      return NextResponse.json(orders, { status: 200 });
    } else {
      // Get all orders (admin only)
      if (auth.user?.role !== "admin") {
        return NextResponse.json(
          { error: "Unauthorized to view all orders" },
          { status: 403 }
        );
      }

      const orders = await prisma.order.findMany({
        include: { Product: true, User: true },
      });

      return NextResponse.json(orders, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// PUT - Update an order (admin only or owner)
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
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if user is authorized to update this order
    if (
      auth.user?.role !== "admin" &&
      existingOrder.user_id !== auth.user?.id
    ) {
      return NextResponse.json(
        { error: "Unauthorized to update this order" },
        { status: 403 }
      );
    }

    const body = await req.json();

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        order_status: body.order_status,
        date: body.date ? new Date(body.date) : undefined,
        time: body.time,
        payment_status: body.payment_status,
        note: body.note,
        user_name: body.user_name,
        user_phone: body.user_phone,
        payment_method: body.payment_method,
      },
    });

    return NextResponse.json(updatedOrder, { status: 200 });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Delete an order (admin only)
export async function DELETE(req: NextRequest) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Only admins can delete orders
    if (auth.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized to delete orders" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Order ID is required" },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Delete order
    await prisma.order.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Order deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
