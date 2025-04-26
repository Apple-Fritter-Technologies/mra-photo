"use server";

import { User } from "@/types/intrerface";
import axios from "axios";
import { ApiUrl } from "../utils";
import { cookies } from "next/headers";

// Get the auth token from cookies
export const getAuthToken = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("auth_token");
  return token?.value;
};

// Add auth header to requests
const createAuthenticatedRequest = async () => {
  const token = await getAuthToken();
  return axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Logout user
export const logoutUser = async () => {
  try {
    // Remove the auth token cookie
    (await cookies()).delete("auth_token");
    return { success: true };
  } catch (error) {
    return {
      error: "Failed to logout",
    };
  }
};

export const loginUser = async ({ email, password }: User) => {
  try {
    const res = await axios.post(`${ApiUrl}/api/user/login`, {
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
  } catch (error: unknown) {
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
  } catch (error: unknown) {
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

// Create a new user
export const createUser = async (user: User) => {
  try {
    const res = await axios.post(`${ApiUrl}/api/user`, user);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error ||
          "User creation failed. Please check your details.",
      };
    }
    return {
      error: "User creation failed. Please check your details.",
    };
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const authAxios = await createAuthenticatedRequest();
    const res = await authAxios.get(`${ApiUrl}/api/user`);
    return res.data;
  } catch (error: unknown) {
    console.log("Error fetching users:", error);

    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch users",
      };
    }
    return {
      error: "Failed to fetch users",
    };
  }
};

// Update user
export const updateUser = async (id: string, userData: Partial<User>) => {
  try {
    const authAxios = await createAuthenticatedRequest();
    const res = await authAxios.patch(`${ApiUrl}/api/user/${id}`, userData);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update user",
      };
    }
    return {
      error: "Failed to update user",
    };
  }
};

// Delete user
export const deleteUser = async (id: string) => {
  try {
    const authAxios = await createAuthenticatedRequest();
    const res = await authAxios.delete(`${ApiUrl}/api/user?id=${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete user",
      };
    }
    return {
      error: "Failed to delete user",
    };
  }
};

// Update current user's password
export const updatePassword = async (
  currentPassword: string,
  newPassword: string
) => {
  try {
    const authAxios = await createAuthenticatedRequest();
    const res = await authAxios.post(`${ApiUrl}/api/user/password`, {
      currentPassword,
      newPassword,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update password",
      };
    }
    return {
      error: "Failed to update password",
    };
  }
};

// Request password reset
export const forgotPassword = async (email: string) => {
  try {
    const res = await axios.post(`${ApiUrl}/api/user/forgot-password`, {
      email,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error ||
          "Failed to process password reset request. Please try again.",
      };
    }
    return {
      error: "Failed to process password reset request. Please try again.",
    };
  }
};

// Verify reset token
export const verifyResetToken = async (token: string) => {
  try {
    const res = await axios.post(`${ApiUrl}/api/user/verify-reset-token`, {
      token,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        valid: false,
        error: error.response?.data?.error || "Invalid or expired token",
      };
    }
    return {
      valid: false,
      error: "Invalid or expired token",
    };
  }
};

// Reset password with token
export const resetPassword = async (token: string, password: string) => {
  try {
    const res = await axios.post(`${ApiUrl}/api/user/reset-password`, {
      token,
      password,
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to reset password",
      };
    }
    return {
      error: "Failed to reset password",
    };
  }
};
