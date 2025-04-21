"use server";

import axios from "axios";
import { getSessionToken } from "../server-service";
import { ApiUrl } from "../utils";
import { PortfolioImage } from "@/types/intrerface";

export const fetchPortfolioImages = async () => {
  try {
    const res = await axios.get(`${ApiUrl}/api/portfolio`);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error || "Failed to fetch portfolio images",
      };
    }
    return { error: "Failed to fetch portfolio images" };
  }
};

export const addPortfolioImage = async (image: PortfolioImage) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.post(`${ApiUrl}/api/portfolio`, image, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to add portfolio image",
      };
    }
    return { error: "Failed to add portfolio image" };
  }
};

export const deletePortfolioImage = async (id: string) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/portfolio?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error || "Failed to delete portfolio image",
      };
    }
    return { error: "Failed to delete portfolio image" };
  }
};

export const updatePortfolioImage = async (
  id: string,
  image: PortfolioImage
) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.put(`${ApiUrl}/api/portfolio?id=${id}`, image, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error || "Failed to update portfolio image",
      };
    }
    return { error: "Failed to update portfolio image" };
  }
};
