"use server";

import { User } from "@/types/intrerface";
import axios, { AxiosError } from "axios";
import { ApiUrl } from "../utils";
import { cookies } from "next/headers";

export const loginUser = async ({ email, password }: User) => {
  try {
    const res = await axios.post(`${ApiUrl}/api/user`, {
      email,
      password,
    });

    // Store the token in cookies
    const token = res.data.token;

    (await cookies()).set({
      name: "auth_token",
      value: token,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 3, // 3 days in seconds
      path: "/",
    });

    return res.data;
  } catch (error: AxiosError | unknown) {
    console.error("Error logging in:", error);
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error ||
          "Login failed. Please check your credentials.",
      };
    }
    return {
      error: "Login failed. Please check your credentials.",
    };
  }
};

export const verifyUserToken = async (token: string) => {
  try {
    const res = await axios.post(`${ApiUrl}/api/user/verify`, {
      token,
    });
    return res.data;
  } catch (error: AxiosError | unknown) {
    console.error("Error verifying token:", error);
    if (axios.isAxiosError(error)) {
      return {
        authorized: false,
        error: error.response?.data?.error || "Token verification failed",
      };
    }
    return {
      authorized: false,
      error: "Token verification failed",
    };
  }
};
