"use server";

import { User } from "@/types/intrerface";
import axios from "axios";
import { ApiUrl } from "../utils";
import { cookies } from "next/headers";

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

// Get user by ID
export const getUserById = async (id: string) => {
  try {
    const authAxios = await createAuthenticatedRequest();
    const res = await authAxios.get(`${ApiUrl}/api/user/${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch user",
      };
    }
    return {
      error: "Failed to fetch user",
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
    const res = await authAxios.delete(`${ApiUrl}/api/user/${id}`);
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

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const authAxios = await createAuthenticatedRequest();
    const res = await authAxios.get(`${ApiUrl}/api/user/profile`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch user profile",
      };
    }
    return {
      error: "Failed to fetch user profile",
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

// Create a new user (admin only)
export const createUserAsAdmin = async (userData: User) => {
  try {
    const authAxios = await createAuthenticatedRequest();
    const res = await authAxios.post(`${ApiUrl}/api/user`, userData);
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

// Check if user is authenticated
export const checkAuth = async () => {
  try {
    const token = await getAuthToken();
    if (!token) {
      return { authenticated: false };
    }

    const authAxios = await createAuthenticatedRequest();
    const res = await authAxios.get(`${ApiUrl}/api/user/check`);
    return { authenticated: true, user: res.data };
  } catch (error) {
    return { authenticated: false };
  }
};

// Check if user is admin
export const checkIsAdmin = async () => {
  try {
    const authStatus = await checkAuth();
    if (!authStatus.authenticated || !authStatus.user) {
      return { isAdmin: false };
    }

    return { isAdmin: authStatus.user.role === "admin" };
  } catch (error) {
    return { isAdmin: false };
  }
};
