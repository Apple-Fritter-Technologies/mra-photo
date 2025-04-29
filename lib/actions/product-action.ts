"use server";

import { Product } from "@/types/intrerface";
import axios from "axios";
import { getSessionToken } from "../server-service";
import { ApiUrl } from "../utils";

export const getProducts = async () => {
  try {
    const res = await axios.get(`${ApiUrl}/api/products`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch products",
      };
    }
    return { error: "Failed to fetch products" };
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await axios.get(`${ApiUrl}/api/products?id=${id}`);
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch product",
      };
    }
    return { error: "Failed to fetch product" };
  }
};

export const addProduct = async (product: Product) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.post(`${ApiUrl}/api/products`, product, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to add product",
      };
    }
    return { error: "Failed to add product" };
  }
};

export const updateProduct = async (product: Product) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.put(
      `${ApiUrl}/api/products?id=${product.id}`,
      product,
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update product",
      };
    }
    return { error: "Failed to update product" };
  }
};

export const deleteProduct = async (id: string) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/products?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete product",
      };
    }
    return { error: "Failed to delete product" };
  }
};
