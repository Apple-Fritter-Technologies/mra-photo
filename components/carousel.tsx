"use client";

import Image from "next/image";
import React, {
  useState,
  useEffect,
  useRef,
  MouseEvent,
  TouchEvent,
  useCallback,
} from "react";
import { cn } from "@/lib/utils";
import GalleryModal from "./gallery-modal";
import { CarouselImage } from "@/types/intrerface";
import { fetchCarouselImages } from "@/lib/actions/carousel-actions";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const Carousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(images.length); // Start from the middle set
  const [isHovering, setIsHovering] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Drag state for carousel
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragDelta, setDragDelta] = useState(0);
  const [transitionActive, setTransitionActive] = useState(true);

  const itemWidth = 300 + 16; // image width + gap

  // Reduce the scroll speed for smoother appearance
  const scrollSpeed = 0.1; // Reduced from 0.5 for slower scrolling

  // Fetch images from the server
  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetchCarouselImages();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setImages(res);
      }
    } catch (error) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  // Enhanced smooth auto-scroll with RAF for smoother animations
  useEffect(() => {
    let lastTimestamp = 0;
    let animationId: number;

    const animateScroll = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isHovering && !modalOpen && !isDragging) {
        // Continuously move the carousel without using index jumps
        // Use a smaller increment for smoother animation
        setCurrentIndex((prev) => prev + (scrollSpeed * delta) / itemWidth);
      }

      animationId = requestAnimationFrame(animateScroll);
    };

    if (!isHovering && !modalOpen && !isDragging) {
      animationId = requestAnimationFrame(animateScroll);
    }

    return () => {
      cancelAnimationFrame(animationId);
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    };
  }, [isHovering, modalOpen, isDragging, itemWidth, scrollSpeed]);

  // Handle infinite loop effect with improved logic
  useEffect(() => {
    // When reaching near the end of the extended array, jump back to the middle set
    if (currentIndex >= images.length * 2) {
      scrollTimerRef.current = setTimeout(() => {
        setTransitionActive(false);
        setCurrentIndex(currentIndex - images.length);

        // Use RAF for smoother reset
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitionActive(true);
          });
        });
      }, 50);
    }
    // When reaching near the start, jump to the end of middle set
    else if (currentIndex <= 0) {
      scrollTimerRef.current = setTimeout(() => {
        setTransitionActive(false);
        setCurrentIndex(currentIndex + images.length);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTransitionActive(true);
          });
        });
      }, 50);
    }
  }, [currentIndex, images.length]);

  // Smooth scroll to index with continuous loop
  const smoothScroll = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Handle image click to open modal
  const handleImageClick = (index: number) => {
    // Only open modal if we're not dragging
    if (!isDragging) {
      setModalImageIndex(index);
      setModalOpen(true);
    }
  };

  // Calculate carousel items with triple clones for truly infinite effect
  const getCarouselItems = () => {
    // Create three sets of images for proper infinite scrolling
    const extendedImages = [...images, ...images, ...images];

    return extendedImages.map((img, i) => {
      const realIndex = i % images.length;
      return (
        <div
          key={`${img.id}-${i}`}
          className="carousel-item shrink-0 transition-all px-1"
          onClick={() => handleImageClick(realIndex)}
          role="button"
          tabIndex={0}
          aria-label={`View ${img.title}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleImageClick(realIndex);
            }
          }}
        >
          <div className="overflow-hidden rounded-lg group shadow-md h-[500px] w-[300px]">
            <Image
              src={img.image_url}
              alt={img.title || "Carousel image"}
              width={300}
              height={500}
              className="object-cover w-full h-full rounded-lg cursor-pointer group-hover:scale-105 transition-all duration-300"
              priority={i < images.length} // Prioritize loading the full first set
              draggable={false}
            />
          </div>
        </div>
      );
    });
  };

  // Drag handlers for carousel
  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setDragStartX(clientX);
    setDragDelta(0);
    setIsHovering(true); // Stop auto-scroll when dragging
    setTransitionActive(false);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;

    const delta = dragStartX - clientX;
    setDragDelta(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    setTransitionActive(true);
    setIsDragging(false);

    // Calculate how many items to scroll with enhanced physics
    const threshold = itemWidth / 4; // Slightly lower threshold for more responsive feel
    const momentumFactor = 1.2; // Apply slight momentum effect

    if (Math.abs(dragDelta) > threshold) {
      const direction = dragDelta > 0 ? 1 : -1;
      // Calculate multiple items to scroll based on drag speed
      const velocity = Math.min(
        Math.floor((Math.abs(dragDelta) / itemWidth) * momentumFactor),
        3
      );
      smoothScroll(currentIndex + direction * Math.max(1, velocity));
    } else {
      // Snap back to current position with smooth animation
      smoothScroll(currentIndex);
    }

    setDragDelta(0);
  };

  // Mouse event handlers for carousel
  const handleMouseDown = (e: MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    e.preventDefault();
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  // Touch event handlers for carousel
  const handleTouchStart = (e: TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
    // Reset isHovering to false after touch interaction ends
    setTimeout(() => setIsHovering(false), 50);
  };

  // Add drag end event listener to window
  useEffect(() => {
    const handleWindowMouseUp = () => {
      if (isDragging) handleDragEnd();
    };

    // Handle touch cancel events that might occur on mobile
    const handleTouchCancel = () => {
      if (isDragging) {
        handleDragEnd();
        setTimeout(() => setIsHovering(false), 50);
      }
    };

    window.addEventListener("mouseup", handleWindowMouseUp);
    window.addEventListener("blur", handleWindowMouseUp);
    window.addEventListener("touchcancel", handleTouchCancel);

    return () => {
      window.removeEventListener("mouseup", handleWindowMouseUp);
      window.removeEventListener("blur", handleWindowMouseUp);
      window.removeEventListener("touchcancel", handleTouchCancel);
    };
  }, [isDragging]);

  // Calculate current transform position with smooth interpolation
  const getCarouselTransform = () => {
    const baseTransform = -currentIndex * itemWidth;
    const dragOffset = isDragging ? -dragDelta : 0;
    return baseTransform + dragOffset;
  };

  return (
    <>
      {error && (
        <div className="text-red-500 text-center py-4 bg-muted/50 rounded-lg">
          <p>Error fetching images. Please try again.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setError(false);
              fetchImages();
            }}
          >
            Retry
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <div
          className="relative overflow-hidden w-full cursor-grab active:cursor-grabbing rounded-lg"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => !isDragging && setIsHovering(false)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          ref={carouselRef}
          aria-label="Image carousel"
          role="region"
        >
          <div
            className={cn(
              "flex",
              transitionActive && "transition-all duration-500 ease-out" // Increased duration for smoother appearance
            )}
            style={{
              transform: `translateX(${getCarouselTransform()}px)`,
              willChange: "transform",
            }}
          >
            {getCarouselItems()}
          </div>
        </div>
      )}

      <GalleryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        images={images}
        initialImageIndex={modalImageIndex}
      />
    </>
  );
};

export default Carousel;
