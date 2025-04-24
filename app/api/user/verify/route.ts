import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User } from "@/types/intrerface";

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
      const decoded = (await jwt.verify(
        token,
        process.env.JWT_SECRET as string
      )) as User;

      // Don't return the full user data for security reasons
      return NextResponse.json(
        {
          authorized: true,
          user: {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            phone: decoded.phone,
            role: decoded.role,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { authorized: false, error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { authorized: false, error: "Token verification failed" },
      { status: 500 }
    );
  }
}
