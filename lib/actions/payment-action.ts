"use server";

import axios from "axios";
import { ApiUrl } from "../utils";
import { cookies } from "next/headers";
import { PaymentData } from "@/types/intrerface";

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

// Create a payment
export const createPayment = async (paymentData: PaymentData) => {
  try {
    const authAxios = await createAuthenticatedRequest();
    const res = await authAxios.post(`${ApiUrl}/api/payment`, paymentData);

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Payment processing failed",
        details: error.response?.data?.details || {},
      };
    }
    return { error: "Payment processing failed" };
  }
};
