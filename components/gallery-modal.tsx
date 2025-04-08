import Image from "next/image";
import {
  useRef,
  useState,
  useEffect,
  MouseEvent,
  TouchEvent,
  WheelEvent,
} from "react";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { GalleryModalProps } from "@/types/intrerface";

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

  // Handle mobile viewport height adjustments
  useEffect(() => {
    if (open) {
      // Fix for mobile viewport height issues
      const updateViewportHeight = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty("--vh", `${vh}px`);

        // Adjust gallery container height based on available space
        if (galleryRef.current) {
          const windowHeight = window.innerHeight;
          const headerHeight = 56; // Approximate header height
          const thumbnailHeight = 80; // Approximate thumbnail section height
          const padding = 32; // Additional padding

          // Calculate available height for the gallery
          const availableHeight =
            windowHeight - headerHeight - thumbnailHeight - padding;
          const minHeight = Math.max(availableHeight, 300); // At least 300px

          galleryRef.current.style.maxHeight = `${minHeight}px`;
        }
      };

      updateViewportHeight();
      window.addEventListener("resize", updateViewportHeight);

      return () => {
        window.removeEventListener("resize", updateViewportHeight);
      };
    }
  }, [open]);

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

  // Add zoom-related state
  const [zoomLevel, setZoomLevel] = useState<number[]>([]);
  const [isPinching, setIsPinching] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  // Initialize zoom levels when modal opens or images change
  useEffect(() => {
    if (open) {
      setZoomLevel(Array(images.length).fill(1));
      imageRefs.current = Array(images.length).fill(null);
    }
  }, [open, images.length]);

  // Function to handle zoom level changes
  const handleZoom = (index: number, newZoom: number) => {
    // Restrict zoom between 1 and 5
    const clampedZoom = Math.min(Math.max(newZoom, 1), 5);

    setZoomLevel((prevZoom) => {
      const newZoomLevels = [...prevZoom];
      newZoomLevels[index] = clampedZoom;
      return newZoomLevels;
    });
  };

  // Reset zoom when changing images
  useEffect(() => {
    if (zoomLevel[modalImageIndex] && zoomLevel[modalImageIndex] > 1) {
      // Reset zoom for the current image when changing images
      const newZoomLevels = [...zoomLevel];
      newZoomLevels[modalImageIndex] = 1;
      setZoomLevel(newZoomLevels);
    }
  }, [modalImageIndex]);

  // Pinch to zoom functionality
  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      // This is a pinch gesture
      setIsPinching(true);
      const dist = getDistanceBetweenTouches(e.touches);
      setInitialPinchDistance(dist);
      // Prevent gallery drag when pinching
      e.stopPropagation();
      e.preventDefault(); // Add this line to prevent default behavior
    } else if (e.touches.length === 1 && zoomLevel[modalImageIndex] === 1) {
      // Only allow gallery drag when not zoomed in
      handleGalleryTouchStart(e);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isPinching && e.touches.length === 2) {
      const currentDistance = getDistanceBetweenTouches(e.touches);
      const scaleFactor = currentDistance / initialPinchDistance;
      // Use a smaller scale factor for smoother zooming on mobile
      const adjustedScaleFactor = 1 + (scaleFactor - 1) * 0.5;
      const newZoom = zoomLevel[modalImageIndex] * adjustedScaleFactor;

      handleZoom(modalImageIndex, newZoom);
      setInitialPinchDistance(currentDistance);
      e.preventDefault();
      e.stopPropagation();
    } else if (e.touches.length === 1 && zoomLevel[modalImageIndex] === 1) {
      // Only allow gallery drag when not zoomed in
      handleGalleryTouchMove(e);
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (isPinching) {
      setIsPinching(false);
      e.stopPropagation();
    } else if (zoomLevel[modalImageIndex] === 1) {
      handleGalleryTouchEnd();
    }
  };

  // Calculate distance between two touch points
  const getDistanceBetweenTouches = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Mouse wheel zoom
  const handleWheel = (e: WheelEvent) => {
    if (e.deltaY !== 0) {
      // Zoom in/out based on scroll direction
      const zoomDelta = e.deltaY > 0 ? -0.2 : 0.2;
      const newZoom = zoomLevel[modalImageIndex] + zoomDelta;
      handleZoom(modalImageIndex, newZoom);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="lg:min-w-5xl md:min-w-3xl w-full max-h-[90vh] p-0 border-none rounded-lg md:rounded-2xl shadow-2xl bg-primary overflow-hidden scale-95 sm:scale-100">
        <DialogTitle hidden />
        <div className="flex items-center justify-between p-2 sm:p-3 border-b border-primary/20">
          <h3 className="text-base font-medium text-secondary truncate">
            {images[modalImageIndex]?.alt || "Image Gallery"}
          </h3>
        </div>

        {/* Gallery container with drag support - make it adaptable to viewport height */}
        <div
          className="relative flex-1 w-full flex items-center justify-center gap-1 sm:gap-2 p-2 bg-primary/80"
          style={
            open
              ? {
                  height: "auto",
                  minHeight: "40vh",
                  maxHeight: "calc(var(--vh, 1vh) * 65)",
                }
              : {}
          }
          ref={galleryRef}
        >
          {/* backward button */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 shadow-md hover:shadow-lg transition-all bg-primary text-secondary border border-secondary/30"
            onClick={() => navigateModal("prev")}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          <div
            className="flex justify-center items-center w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
            onMouseDown={(e) =>
              zoomLevel[modalImageIndex] === 1 && handleGalleryMouseDown(e)
            }
            onMouseMove={(e) =>
              zoomLevel[modalImageIndex] === 1 && handleGalleryMouseMove(e)
            }
            onMouseUp={() =>
              zoomLevel[modalImageIndex] === 1 && handleGalleryMouseUp()
            }
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
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
                  <div className="relative max-w-full flex items-center justify-center">
                    <Image
                      ref={(el) => {
                        imageRefs.current[i] = el;
                      }}
                      src={img.src}
                      alt={img.alt}
                      width={800}
                      height={1200}
                      className="rounded-lg shadow-lg object-contain w-full h-full max-w-[98%] max-h-[98%] transition-transform duration-300 ease-in-out"
                      style={{
                        transform: `scale(${zoomLevel[i] || 1})`,
                        cursor: zoomLevel[i] > 1 ? "zoom-out" : "zoom-in",
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
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10 shadow-md hover:shadow-lg transition-all bg-primary text-secondary border border-secondary/30"
            onClick={() => navigateModal("next")}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>

          {/* Image counter */}
          <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm bg-primary/10 text-secondary border border-secondary/30">
            {modalImageIndex + 1} / {images.length}
          </div>

          {/* Zoom controls */}
          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 flex gap-1 sm:gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-7 h-7 sm:w-8 sm:h-8 shadow-md hover:shadow-lg transition-all bg-primary text-secondary border border-secondary/30"
              onClick={() =>
                handleZoom(modalImageIndex, zoomLevel[modalImageIndex] - 0.5)
              }
              disabled={zoomLevel[modalImageIndex] <= 1}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full w-7 h-7 sm:w-8 sm:h-8 shadow-md hover:shadow-lg transition-all bg-primary text-secondary border border-secondary/30"
              onClick={() =>
                handleZoom(modalImageIndex, zoomLevel[modalImageIndex] + 0.5)
              }
              disabled={zoomLevel[modalImageIndex] >= 5}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>

            {zoomLevel[modalImageIndex] > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full w-7 h-7 sm:w-8 sm:h-8 shadow-md hover:shadow-lg transition-all bg-primary text-secondary border border-secondary/30"
                onClick={() => handleZoom(modalImageIndex, 1)}
                aria-label="Reset zoom"
              >
                <RotateCw className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Enhanced thumbnail preview with scrolling indicators - more compact for small heights */}
        <div className="relative px-8 py-1 sm:py-2 overflow-hidden">
          {/* Scroll indicators/controls */}
          {images.length > 4 && (
            <>
              <div className="absolute left-1 sm:left-2 top-0 bottom-0 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-6 w-6 sm:h-8 sm:w-8 bg-primary/50 text-secondary"
                  onClick={() => {
                    if (thumbnailContainerRef.current) {
                      thumbnailContainerRef.current.scrollBy({
                        left: -150,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
              <div className="absolute right-1 sm:right-2 top-0 bottom-0 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-6 w-6 sm:h-8 sm:w-8 bg-primary/50 text-secondary"
                  onClick={() => {
                    if (thumbnailContainerRef.current) {
                      thumbnailContainerRef.current.scrollBy({
                        left: 150,
                        behavior: "smooth",
                      });
                    }
                  }}
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </>
          )}

          {/* Thumbnail scroller - more compact for small heights */}
          <div
            ref={thumbnailContainerRef}
            className="flex gap-1 sm:gap-2 overflow-x-auto p-1 ps-8 sm:ps-28 items-center justify-center"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {images.map((img, i) => (
              <button
                key={`thumb-${i}`}
                className={cn(
                  "relative rounded-md overflow-hidden transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-secondary w-8 h-12 sm:w-12 sm:h-16 lg:w-14 lg:h-20 flex-shrink-0",
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
                  sizes="(max-width: 640px) 40px, 56px"
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
