import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
      // Don't return the full user data for security reasons
      return NextResponse.json(
        {
          authorized: true,
          user: {
            userId: (decoded as any).userId,
            email: (decoded as any).email,
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
    console.error("Token verification error:", error);
    return NextResponse.json(
      { authorized: false, error: "Token verification failed" },
      { status: 500 }
    );
  }
}
