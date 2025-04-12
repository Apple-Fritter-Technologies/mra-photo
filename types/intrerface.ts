export interface GalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: PortfolioImage[];
  initialImageIndex: number;
}

export interface ImageHeaderProps {
  img: string;
  title: string;
}

export interface User {
  email: string;
  password: string;
}

export interface PortfolioImage {
  id: string;
  url: string;
  title: string;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  duration: string;
  photos: string;
  cta?: string;
}

export interface Booking {
  id: string;
  name: string;
  email: string;
  date: Date;
  time: string;
  status: string;
  product_id: string;
  session_name?: string;
  heard_from?: string;
  message?: string;
  created_at?: string;
}
