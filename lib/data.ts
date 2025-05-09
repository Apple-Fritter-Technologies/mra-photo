import {
  Box,
  Boxes,
  Calendar,
  CalendarIcon,
  CameraIcon,
  GalleryHorizontalEnd,
  Home,
  Image,
  PackageIcon,
  User,
} from "lucide-react";

export const navItems = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Meet Maria",
    href: "/meet-maria",
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
  {
    name: "Login",
    href: "/login",
  },
];

export const allHomeNavigation = [
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
  {
    name: "Login",
    href: "/login",
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
    href: "/admin/dashboard/inquiry",
    icon: Calendar,
    label: "Inquiry",
  },
  {
    href: "/admin/dashboard/orders",
    icon: Boxes,
    label: "Orders",
  },
  {
    href: "/admin/dashboard/users",
    icon: User,
    label: "Users",
  },
];

export const BookingStatusOptions = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

export const OrderStatusOptions = [
  "pending",
  "processing",
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
  {
    icon: User,
    label: "Manage Users",
    href: "/admin/dashboard/users",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: CalendarIcon,
    label: "Manage inquiries",
    href: "/admin/dashboard/inquiry",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: CalendarIcon,
    label: "Manage Orders",
    href: "/admin/dashboard/orders",
    color: "bg-purple-500/10 text-purple-500",
  },
];
