export interface ImageItem {
  src: string;
  alt?: string;
}

export interface GalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ImageItem[];
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
  price: string;
  image: string;
  category: string;
}
