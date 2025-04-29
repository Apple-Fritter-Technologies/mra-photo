export interface GalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: CarouselImage[] | PortfolioImage[];
  initialImageIndex: number;
}

export interface ImageHeaderProps {
  img: string;
  title: string;
}

export interface User {
  id?: string;
  email: string;
  password?: string;
  name?: string | null;
  phone?: string | null;
  role?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface PortfolioImage {
  id: string;
  image_url: string;
  title: string;
}

export interface CarouselImage {
  id: string;
  image_url: string;
  title?: string;
  displayOrder?: number;
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

export interface OrderProduct {
  id: string;
  title: string;
  price: number;
}
export interface PaymentData {
  sourceId: string;
  amount: number;
  product: OrderProduct;
  order: Order;
  customerId: string;
  locationId?: string;
  orderId?: string;
  referenceId?: string;
  note?: string;
  appFee?: number;
  paymentMethod?: string;
  buyerEmailAddress: string;
  givenName?: string;
  phoneNumber?: string;
  currency?: string;
  user_id: string;
  status?: string;
}

export interface Customer {
  id?: string;
  emailAddress: string;
  givenName?: string;
  phoneNumber?: string;
}

export interface Order {
  id: string;
  user_id: string;
  user_email: string;
  user_name?: string;
  user_phone?: string;
  product_id: string;
  product_title: string;
  product_price: number;
  date: Date;
  time: string;
  order_status: string;
  currency: string;
  note?: string;
  paid_amount: number;
  payment_id?: string;
  payment_method: string;
  payment_status?: string;
  created_at?: Date;
  updated_at?: Date;
}
