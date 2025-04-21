import {
  Box,
  Calendar,
  CalendarIcon,
  CameraIcon,
  GalleryHorizontalEnd,
  Home,
  Image,
  PackageIcon,
} from "lucide-react";

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
    href: "/admin/dashboard/carousel",
    icon: GalleryHorizontalEnd,
    label: "Carousel",
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

export const dashboardQuickAction = [
  {
    icon: CameraIcon,
    label: "Add New Photoshoot",
    href: "/admin/dashboard/portfolio",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: CalendarIcon,
    label: "Manage Bookings",
    href: "/admin/dashboard/bookings",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: PackageIcon,
    label: "Manage Products",
    href: "/admin/dashboard/products",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: GalleryHorizontalEnd,
    label: "Manage Carousel",
    href: "/admin/dashboard/carousel",
    color: "bg-purple-500/10 text-purple-500",
  },
];
