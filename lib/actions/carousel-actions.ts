"use server";

import axios from "axios";
import { getSessionToken } from "../server-service";
import { ApiUrl } from "../utils";
import { CarouselImage } from "@/types/intrerface";

export const fetchCarouselImages = async () => {
  try {
    const res = await axios.get(`${ApiUrl}/api/carousel`);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch carousel images",
      };
    }
    return { error: "Failed to fetch carousel images" };
  }
};

export const addCarouselImage = async (image: CarouselImage) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.post(`${ApiUrl}/api/carousel`, image, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to add carousel image",
      };
    }
    return { error: "Failed to add carousel image" };
  }
};

export const deleteCarouselImage = async (id: string) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/carousel?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete carousel image",
      };
    }
    return { error: "Failed to delete carousel image" };
  }
};

export const updateCarouselImage = async (id: string, image: CarouselImage) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.put(`${ApiUrl}/api/carousel?id=${id}`, image, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update carousel image",
      };
    }
    return { error: "Failed to update carousel image" };
  }
};

export const reorderCarouselImages = async (orderedIds: string[]) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.patch(
      `${ApiUrl}/api/carousel`,
      { orderedIds },
      { headers: { Authorization: `Bearer ${sessionToken}` } }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error:
          error.response?.data?.error || "Failed to reorder carousel images",
      };
    }
    return { error: "Failed to reorder carousel images" };
  }
};
