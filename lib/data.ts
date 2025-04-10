import { ImageItem } from "@/types/intrerface";
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

export const sessionData = [
  {
    id: "lifestyle",
    title: "Lifestyle",
    price: "$450",
    description: "Maternity, Family, Couples, Milestone",
    duration: "60 MIN",
    photos: "40+ PHOTOS",
    image: "/images/home-1.jpg",
    cta: "Book Now",
  },
  {
    id: "senior",
    title: "Senior",
    price: "$500",
    description: "Graduation Photo",
    duration: "60 MIN",
    photos: "55+ PHOTOS",
    image: "/images/home-2.jpg",
    cta: "Book Now",
  },
  {
    id: "newborn",
    title: "Newborn/Fresh 48",
    price: "$600",
    description: "2 Outfits",
    duration: "2 HOUR",
    photos: "70+ PHOTOS",
    image: "/images/child.jpg",
    cta: "Book Now",
  },
];

export const portfolioImages: ImageItem[] = [
  { src: "/images/home-1.jpg", alt: "Portfolio image 1" },
  { src: "/images/home-2.jpg", alt: "Portfolio image 2" },
  { src: "/images/landscape.jpg", alt: "Portfolio image 3" },
  { src: "/images/carousel.jpg", alt: "Portfolio image 4" },
  { src: "/images/carousel2.jpg", alt: "Portfolio image 5" },
  { src: "/images/child.jpg", alt: "Portfolio image 6" },
  { src: "/images/inquire-header.jpg", alt: "Portfolio image 7" },
  { src: "/images/logo.png", alt: "Portfolio image 8" },
  { src: "/images/home-1.jpg", alt: "Portfolio image 9" },
  { src: "/images/home-2.jpg", alt: "Portfolio image 10" },
  { src: "/images/landscape.jpg", alt: "Portfolio image 11" },
  { src: "/images/carousel.jpg", alt: "Portfolio image 12" },
  { src: "/images/carousel2.jpg", alt: "Portfolio image 13" },
  { src: "/images/child.jpg", alt: "Portfolio image 14" },
  { src: "/images/inquire-header.jpg", alt: "Portfolio image 15" },
  { src: "/images/logo.png", alt: "Portfolio image 16" },
];
