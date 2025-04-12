import { Product } from "@/types/intrerface";
import axios, { AxiosError } from "axios";
import { getSessionToken } from "../server-service";

export const getProducts = async () => {
  try {
    const res = await axios.get(`/api/products`);
    return res.data;
  } catch (error: AxiosError | unknown) {
    console.error("Error fetching products:", error);
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch products",
      };
    }
    return { error: "Failed to fetch products" };
  }
};

export const addProduct = async (product: Product) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.post(`/api/products`, product, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: AxiosError | unknown) {
    console.error("Error adding product:", error);
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
    const res = await axios.put(`/api/products?id=${product.id}`, product, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: AxiosError | unknown) {
    console.error("Error updating product:", error);
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
    const res = await axios.delete(`/api/products?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: AxiosError | unknown) {
    console.error("Error deleting product:", error);
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete product",
      };
    }
    return { error: "Failed to delete product" };
  }
};
