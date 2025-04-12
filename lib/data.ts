import { PortfolioImage } from "@/types/intrerface";
import { Box, Calendar, Home, Image } from "lucide-react";

export const navigation = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Meet Maria",
    href: "/meet-maria",
  },
  {
    name: "Experience",
    href: "/experience",
  },
  {
    name: "Portfolio",
    href: "/portfolio",
  },
  {
    name: "Investment",
    href: "/investment",
  },

  {
    name: "Inquire",
    href: "/inquire",
  },
];

export const adminNavItems = [
  {
    href: "/admin/dashboard",
    icon: Home,
    label: "Dashboard",
  },
  {
    href: "/admin/dashboard/portfolio",
    icon: Image,
    label: "Portfolio",
  },
  {
    href: "/admin/dashboard/products",
    icon: Box,
    label: "Products",
  },
  {
    href: "/admin/dashboard/bookings",
    icon: Calendar,
    label: "Bookings",
  },
];

export const BookingStatusOptions = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export const carouselImages: PortfolioImage[] = [
  { id: "1", url: "/images/carousel.jpg", title: "Portrait photo 1" },
  { id: "12", url: "/images/child.jpg", title: "Portrait photo 3" },
  { id: "13", url: "/images/carousel2.jpg", title: "Portrait photo 2" },
  { id: "14", url: "/images/carousel.jpg", title: "Portrait photo 1" },
  { id: "15", url: "/images/landscape.jpg", title: "Portrait photo 4" },
  { id: "16", url: "/images/child.jpg", title: "Portrait photo 3" },
  { id: "17", url: "/images/carousel2.jpg", title: "Portrait photo 2" },
  { id: "18", url: "/images/landscape.jpg", title: "Portrait photo 4" },
];
