"use client";

import { useState, useEffect } from "react";
import { removeSessionToken } from "./server-service";
import { toast } from "sonner";

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);

    // Set initial value
    setMatches(media.matches);

    // Create listener function
    const listener = () => setMatches(media.matches);

    // Add listener
    media.addEventListener("change", listener);

    // Remove listener on cleanup
    return () => media.removeEventListener("change", listener);
  }, [query]);

  return matches;
}

export const userLogout = async () => {
  localStorage.removeItem("token");

  const res = await removeSessionToken();
  if (!res) {
    toast.error("Failed to logout");
    return;
  }

  toast.success("Logged out successfully");
  window.location.href = "/";
};
