"use client";

import GalleryModal from "@/components/gallery-modal";
import ImageHeader from "@/components/image-header";
import Image from "next/image";
import React, { useEffect, useState } from "react";

import PageTitle from "@/components/page-title";
import { motion } from "motion/react";
import { fetchPortfolioImages } from "@/lib/actions/portfolio-action";
import { toast } from "sonner";
import { PortfolioImage } from "@/types/intrerface";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const PortfolioPage = () => {
  const img = "/images/portfolio/portfolio.png";

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const [portfolioImages, setPortfolioImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Handle image click to open modal
  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setModalOpen(true);
  };

  // Fetch portfolio images
  const getPortfolioImages = async () => {
    setLoading(true);

    try {
      const res = await fetchPortfolioImages();

      if (res.error) {
        setError(true);
        toast.error("Failed to load portfolio images.");
      } else {
        setPortfolioImages(res);
      }
    } catch (error: unknown) {
      setError(true);
      toast.error("An unexpected error occurred while fetching images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPortfolioImages();
  }, []);

  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <ImageHeader img={img} title="Portfolio" position="center" />

      <PageTitle title="Maria Rose" subtitle="PHOTOGRAPHER" />

      <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto -mt-6">
        Capturing life&apos;s precious moments through the lens of creativity
        and passion. Explore my diverse portfolio showcasing a blend of
        portraits, landscapes, and artistic photography.
      </p>

      {error && (
        <div className="text-red-500 text-center py-4 bg-muted/50 rounded-lg">
          <p>Error fetching portfolio images. Please try again.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setError(false);
              getPortfolioImages();
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

      {!loading && !error && portfolioImages.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg my-12">
          <h3 className="text-lg font-medium">No portfolio images yet</h3>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 py-12">
          {portfolioImages.map(
            (image, index) =>
              image?.image_url && (
                <motion.div
                  key={index}
                  className="mb-6 break-inside-avoid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.03 }}
                >
                  <div
                    className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handleImageClick(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${image.title}`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleImageClick(index);
                      }
                    }}
                  >
                    <Image
                      src={image.image_url}
                      alt={image.title || ""}
                      width={600}
                      height={600}
                      priority={index < 4}
                      className="w-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                      <span className="text-lg font-medium tracking-wide">
                        {image.title}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
          )}
        </div>
      )}

      <GalleryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        images={portfolioImages}
        initialImageIndex={modalImageIndex}
      />
    </div>
  );
};

export default PortfolioPage;
