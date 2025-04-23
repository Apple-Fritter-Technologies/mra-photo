"use server";

import axios from "axios";
import { getSessionToken } from "../server-service";
import { ApiUrl } from "../utils";

// Get all orders (admin only)
export const getOrders = async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.get(`${ApiUrl}/api/order`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch orders",
      };
    }
    return { error: "Failed to fetch orders" };
  }
};

// Get single order by ID
export const getOrderById = async (id: string) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.get(`${ApiUrl}/api/order?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch order",
      };
    }
    return { error: "Failed to fetch order" };
  }
};

// Get orders for a specific user
export const getUserOrders = async (userId: string) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.get(`${ApiUrl}/api/order?userId=${userId}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch user orders",
      };
    }
    return { error: "Failed to fetch user orders" };
  }
};

// Create a new order
export const createOrder = async (orderData: {
  product_id: string;
  date: string | Date;
  time: string;
  amount: number;
  currency: string;
  payment_id: string;
  payment_status: string;
}) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.post(`${ApiUrl}/api/order`, orderData, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to create order",
      };
    }
    return { error: "Failed to create order" };
  }
};

// Update an order
export const updateOrder = async (
  id: string,
  orderData: {
    status?: string;
    date?: string | Date;
    time?: string;
    payment_status?: string;
  }
) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.put(`${ApiUrl}/api/order?id=${id}`, orderData, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to update order",
      };
    }
    return { error: "Failed to update order" };
  }
};

// Delete an order (admin only)
export const deleteOrder = async (id: string) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/order?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to delete order",
      };
    }
    return { error: "Failed to delete order" };
  }
};
