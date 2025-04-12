"use server";

import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// Verify JWT authentication middleware
export const verifyAuth = async (req: NextRequest) => {
  const authHeader = req.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, error: "Authentication required" };
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return { authorized: true, user: decoded };
  } catch (error) {
    return { authorized: false, error: "Invalid or expired token" };
  }
};

// get session token from cookie
export const getSessionToken = async () => {
  const token = (await cookies()).get("auth_token");
  return token?.value || null;
};

// remove token from cookie
export const removeSessionToken = async () => {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
    return true;
  } catch (error) {
    return false;
  }
};
