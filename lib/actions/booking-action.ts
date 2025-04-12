"use server";

import axios from "axios";
import { getSessionToken } from "../server-service";
import { ApiUrl } from "../utils";

export const fetchBookings = async () => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.get(`${ApiUrl}/api/booking`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    console.error("Error fetching bookings:", error);
    if (axios.isAxiosError(error)) {
      return {
        error: error.response?.data?.error || "Failed to fetch bookings",
      };
    }
    return { error: "Failed to fetch bookings" };
  }
};

export const createBooking = async (booking: any) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    // Map form fields to API expected fields
    const apiBooking = {
      name: booking.fullName,
      email: booking.email,
      date: booking.date || new Date(),
      time: booking.preferredTime || "Any time",
      session_name: booking.sessionType,
      heard_from: booking.referralSource,
      message: booking.additionalInfo || "",
      // If otherReferral is provided and referralSource is 'other', add it to message
      ...(booking.otherReferral &&
        booking.referralSource === "other" && {
          message: `${booking.additionalInfo || ""}\n\nReferral Source: ${
            booking.otherReferral
          }`,
        }),
    };

    const res = await axios.post(`${ApiUrl}/api/booking`, apiBooking, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Error adding booking:", error.response?.data?.error);
      return {
        error: error.response?.data?.error || "Failed to add booking",
      };
    }
    return { error: "Failed to add booking" };
  }
};

export const updateBooking = async (booking: any) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.put(
      `${ApiUrl}/api/booking?id=${booking.id}`,
      booking,
      {
        headers: { Authorization: `Bearer ${sessionToken}` },
      }
    );

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Error updating booking:", error.response?.data?.error);
      return {
        error: error.response?.data?.error || "Failed to update booking",
      };
    }
    return { error: "Failed to update booking" };
  }
};

export const deleteBooking = async (id: string) => {
  const sessionToken = await getSessionToken();
  if (!sessionToken) {
    return { error: "No token found. Please login again." };
  }

  try {
    const res = await axios.delete(`${ApiUrl}/api/booking?id=${id}`, {
      headers: { Authorization: `Bearer ${sessionToken}` },
    });

    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Error deleting booking:", error.response?.data?.error);
      return {
        error: error.response?.data?.error || "Failed to delete booking",
      };
    }
    return { error: "Failed to delete booking" };
  }
};
