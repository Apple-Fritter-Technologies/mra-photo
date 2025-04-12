"use server";

import axios from "axios";
import { getSessionToken } from "../server-service";
import { ApiUrl } from "../utils";

export const getDashboardStats = async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.get(`${ApiUrl}/api/dashboard`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch dashboard stats",
      };
    }
    return { error: "Failed to fetch dashboard stats" };
  }
};
