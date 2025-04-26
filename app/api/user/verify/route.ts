import { NextResponse } from "next/server";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { User } from "@/types/intrerface";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { authorized: false, error: "Token is required" },
        { status: 400 }
      );
    }

    try {
      // Verify token and get decoded data
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as User;

      // Check if user still exists in database
      const userExists = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          email: true,
          name: true,
          phone: true,
          role: true,
          created_at: true,
          updated_at: true,
        },
      });

      if (!userExists) {
        return NextResponse.json(
          { authorized: false, error: "User no longer exists" },
          { status: 401 }
        );
      }

      // Return current user data from DB (not from token)
      return NextResponse.json(
        {
          authorized: true,
          user: userExists,
        },
        { status: 200 }
      );
    } catch (error) {
      console.log("Token verification error:", error);

      // Handle specific token error types
      if (error instanceof TokenExpiredError) {
        return NextResponse.json(
          { authorized: false, error: "Token has expired" },
          { status: 401 }
        );
      }

      return NextResponse.json(
        { authorized: false, error: "Invalid token" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { authorized: false, error: "Token verification failed" },
      { status: 500 }
    );
  }
}
