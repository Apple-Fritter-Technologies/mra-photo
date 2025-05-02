import prisma from "@/lib/prisma";
import { verifyAuth } from "@/lib/server-service";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  params: {
    id: string;
  };
}

interface UserUpdateData {
  email?: string;
  name?: string;
  phone?: string;
  role?: "admin" | "user";
}

// PATCH - Update a specific user
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    // Verify authentication
    const auth = await verifyAuth(req);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error }, { status: 401 });
    }

    // Fix: Access id directly without awaiting params
    const id = (await params).id;

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
    const { email, name, phone, role } = body;

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

    const updateData: UserUpdateData = {};

    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (role && auth.user?.role === "admin") updateData.role = role;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    // Return user without password
    const userWithoutPassword = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: updatedUser.phone,
      role: updatedUser.role,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    };

    return NextResponse.json(userWithoutPassword, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
