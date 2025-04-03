import Image from "next/image";
import { useRef, useState, useEffect, MouseEvent, TouchEvent } from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GalleryModalProps } from "@/type/intrerface";

const GalleryModal: React.FC<GalleryModalProps> = ({
  open,
  onOpenChange,
  images,
  initialImageIndex,
}) => {
  const galleryRef = useRef<HTMLDivElement>(null);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const [modalImageIndex, setModalImageIndex] = useState(initialImageIndex);

  // Reset image index when the modal opens with a new initialImageIndex
  useEffect(() => {
    if (open) {
      setModalImageIndex(initialImageIndex);
    }
  }, [open, initialImageIndex]);

  // Gallery drag functionality
  const [isGalleryDragging, setIsGalleryDragging] = useState(false);
  const [galleryDragStartX, setGalleryDragStartX] = useState(0);
  const [galleryDragThreshold] = useState(40); // Slightly more sensitive threshold for gallery
  const [galleryDragDelta, setGalleryDragDelta] = useState(0);

  // Navigate through modal images
  const navigateModal = (direction: "prev" | "next") => {
    if (direction === "prev") {
      setModalImageIndex((prevIndex) =>
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
      );
    } else {
      setModalImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }
  };

  // Ensure the selected thumbnail is visible in the scroll area
  useEffect(() => {
    if (open && thumbnailContainerRef.current) {
      const container = thumbnailContainerRef.current;
      const thumbnailWidth = 64; // width + gap (56 + 8)
      const scrollPosition = modalImageIndex * thumbnailWidth;

      // Calculate center position for the selected thumbnail
      const containerWidth = container.clientWidth;
      const centerOffset = containerWidth / 2 - thumbnailWidth / 2;

      container.scrollTo({
        left: scrollPosition - centerOffset,
        behavior: "smooth",
      });
    }
  }, [modalImageIndex, open]);

  const handleGalleryDragStart = (clientX: number) => {
    setIsGalleryDragging(true);
    setGalleryDragStartX(clientX);
    setGalleryDragDelta(0);
  };

  const handleGalleryDragMove = (clientX: number) => {
    if (!isGalleryDragging) return;
    const delta = galleryDragStartX - clientX;
    setGalleryDragDelta(delta);
  };

  const handleGalleryDragEnd = () => {
    if (!isGalleryDragging) return;

    const dragDistance = galleryDragDelta;

    if (Math.abs(dragDistance) > galleryDragThreshold) {
      if (dragDistance > 0) {
        navigateModal("next");
      } else {
        navigateModal("prev");
      }
    }

    setIsGalleryDragging(false);
    setGalleryDragDelta(0);
  };

  // Gallery mouse events
  const handleGalleryMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    handleGalleryDragStart(e.clientX);
  };

  const handleGalleryMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    handleGalleryDragMove(e.clientX);
  };

  const handleGalleryMouseUp = () => {
    handleGalleryDragEnd();
  };

  // Gallery touch events
  const handleGalleryTouchStart = (e: TouchEvent) => {
    handleGalleryDragStart(e.touches[0].clientX);
  };

  const handleGalleryTouchMove = (e: TouchEvent) => {
    handleGalleryDragMove(e.touches[0].clientX);
  };

  const handleGalleryTouchEnd = () => {
    handleGalleryDragEnd();
  };

  // Add drag end event listener to window
  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isGalleryDragging) handleGalleryDragEnd();
    };

    window.addEventListener("mouseup", handleWindowMouseUp);
    window.addEventListener("blur", handleWindowMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleWindowMouseUp);
      window.removeEventListener("blur", handleWindowMouseUp);
    };
  }, [isGalleryDragging]);

  // Calculate visual feedback for gallery dragging
  const getGalleryTransform = (): React.CSSProperties => {
    const dragOffset = isGalleryDragging ? -galleryDragDelta : 0;
    return {
      transform: `translateX(calc(-${
        modalImageIndex * 100
      }% + ${dragOffset}px))`,
      transition: isGalleryDragging ? "none" : "transform 0.3s ease-in-out",
    };
  };

  // Set document body overflow when modal opens/closes
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        navigateModal("next");
      } else if (e.key === "ArrowLeft") {
        navigateModal("prev");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0 border-none rounded-2xl shadow-2xl bg-primary overflow-hidden scale-95">
        <DialogTitle hidden />
        <div className="flex items-center justify-between p-4 border-b border-primary/20">
          <h3 className="text-lg font-medium text-secondary truncate">
            {images[modalImageIndex]?.alt || "Image Gallery"}
          </h3>
        </div>

        {/* Gallery container with drag support */}
        <div
          className="relative min-h-[65vh] w-full flex items-center justify-center gap-2 p-4 bg-primary/80"
          ref={galleryRef}
        >
          {/* backward button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shadow-md hover:shadow-lg transition-all bg-primary text-secondary border border-secondary/30"
            onClick={() => navigateModal("prev")}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div
            className="flex justify-center items-center w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
            onMouseDown={handleGalleryMouseDown}
            onMouseMove={handleGalleryMouseMove}
            onMouseUp={handleGalleryMouseUp}
            onTouchStart={handleGalleryTouchStart}
            onTouchMove={handleGalleryTouchMove}
            onTouchEnd={handleGalleryTouchEnd}
          >
            <div
              className="flex transition-transform h-full"
              style={getGalleryTransform()}
            >
              {images.map((img, i) => (
                <div
                  key={`modal-img-${i}`}
                  className="w-full min-w-full flex items-center justify-center"
                  style={{ flex: "0 0 100%" }}
                >
                  <div className="relative max-h-[65vh] max-w-full flex items-center justify-center">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={800}
                      height={1200}
                      className="rounded-lg shadow-lg"
                      style={{
                        maxHeight: "65vh",
                        maxWidth: "98%",
                        width: "auto",
                        height: "auto",
                        objectFit: "contain",
                      }}
                      draggable={false}
                      priority={
                        i === modalImageIndex ||
                        i === (modalImageIndex + 1) % images.length ||
                        i ===
                          (modalImageIndex === 0
                            ? images.length - 1
                            : modalImageIndex - 1)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* forward button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full shadow-md hover:shadow-lg transition-all bg-primary text-secondary border border-secondary/30"
            onClick={() => navigateModal("next")}
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full text-sm font-medium shadow-sm bg-primary/10 text-secondary border border-secondary/30">
            {modalImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Enhanced thumbnail preview with scrolling indicators */}
        <div className="relative px-12 py-4 overflow-hidden">
          {/* Scroll indicators/controls */}
          {images.length > 6 && (
            <>
              <div className="absolute left-2 top-0 bottom-0 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 bg-primary/50 text-secondary"
                  onClick={() => {
                    if (thumbnailContainerRef.current) {
                      thumbnailContainerRef.current.scrollBy({
                        left: -200,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute right-2 top-0 bottom-0 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8 bg-primary/50 text-secondary"
                  onClick={() => {
                    if (thumbnailContainerRef.current) {
                      thumbnailContainerRef.current.scrollBy({
                        left: 200,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}

          {/* Thumbnail scroller */}
          <div
            ref={thumbnailContainerRef}
            className="flex gap-2 overflow-x-auto p-2 ps-28 items-center justify-center"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {images.map((img, i) => (
              <button
                key={`thumb-${i}`}
                className={cn(
                  "relative rounded-md overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-secondary w-14 h-20 flex-shrink-0",
                  modalImageIndex === i
                    ? "ring-2 ring-secondary scale-105 shadow-md"
                    : "opacity-70 hover:opacity-100"
                )}
                onClick={() => setModalImageIndex(i)}
              >
                <Image
                  src={img.src}
                  alt={`Thumbnail ${i + 1}`}
                  fill
                  sizes="56px"
                  className="object-cover"
                  draggable={false}
                />
                {modalImageIndex === i && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-secondary" />
                )}
              </button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GalleryModal;
