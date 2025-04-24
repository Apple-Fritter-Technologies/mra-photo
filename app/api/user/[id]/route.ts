import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/server-service";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

interface Params {
  params: {
    id: string;
  };
}

// GET - Get a single user by ID
export async function GET(req: NextRequest, { params }: Params) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const id = (await params).id;

    // Get user by ID (excluding password)
    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH - Update a specific user
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    const id = params.id;

    // Check if the user has admin role or is updating their own record
    if (auth.user?.role !== "admin" && auth.user?.id !== id) {
      return NextResponse.json(
        {
          error:
            "Unauthorized: You can only update your own account or have admin access",
        },
        { status: 403 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { email, password, name, phone, role } = body;

    // Prevent role change unless admin
    if (role && auth.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Only admins can change user roles" },
        { status: 403 }
      );
    }

    // Validate role if provided
    if (role && !["admin", "user"].includes(role)) {
      return NextResponse.json(
        { error: "Invalid role. Role must be 'admin' or 'user'" },
        { status: 400 }
      );
    }

    // Check if email exists for another user if email is being changed
    if (email && email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (email) updateData.email = email;
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (role && auth.user?.role === "admin") updateData.role = role;

    // Hash password if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Return user without password
    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a specific user
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Check if the user has admin role
    if (auth.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const id = params.id;

    // Don't allow deleting the last admin
    const adminCount = await prisma.user.count({
      where: { role: "admin" },
    });

    const userToDelete = await prisma.user.findUnique({
      where: { id },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userToDelete.role === "admin" && adminCount <= 1) {
      return NextResponse.json(
        { error: "Cannot delete the last admin user" },
        { status: 400 }
      );
    }

    // Delete user
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
