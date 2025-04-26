import { NextResponse } from "next/server";
import crypto from "crypto";
import { emailHtml, sendEmail } from "@/lib/email";
import prisma from "@/lib/prisma";
import { ApiUrl } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user with the provided email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, still return success even if user doesn't exist
      return NextResponse.json(
        {
          success: true,
          message:
            "If an account with that email exists, a password reset link has been sent",
        },
        { status: 200 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Create reset URL
    const resetUrl = `${ApiUrl}/reset-password?token=${resetToken}`;

    // Send email with reset link
    await sendEmail({
      to: user.email,
      subject: "Password Reset Request",
      html: emailHtml({
        name: user.name || undefined,
        resetUrl,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
