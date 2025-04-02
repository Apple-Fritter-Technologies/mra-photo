export interface ImageItem {
  src: string;
  alt: string;
}

export interface GalleryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  images: ImageItem[];
  initialImageIndex: number;
}
