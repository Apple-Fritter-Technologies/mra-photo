"use client";

import GalleryModal from "@/components/gallery-modal";
import ImageHeader from "@/components/image-header";
import Image from "next/image";
import React, { useState } from "react";
import { portfolioImages } from "@/lib/data";
import PageTitle from "@/components/page-title";
import { motion } from "motion/react";

const PortfolioPage = () => {
  const img = "/images/landscape.jpg";

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Handle image click to open modal
  const handleImageClick = (index: number) => {
    setModalImageIndex(index);
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <ImageHeader img={img} title="Portfolio" />

      <PageTitle title="Maria Rose" subtitle="PHOTOGRAPHER" />

      <p className="text-center text-gray-600 dark:text-gray-300 max-w-2xl mx-auto -mt-6">
        Capturing life&apos;s precious moments through the lens of creativity
        and passion. Explore my diverse portfolio showcasing a blend of
        portraits, landscapes, and artistic photography.
      </p>

      <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 py-12">
        {portfolioImages.map((image, index) => (
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
              aria-label={`View ${image.alt}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleImageClick(index);
                }
              }}
            >
              <Image
                src={image.src}
                alt={image.alt || ""}
                width={600}
                height={600}
                priority={index < 4}
                className="w-full object-cover hover:scale-105 transition-transform duration-500 cursor-pointer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transform group-hover:translate-y-0 translate-y-4 transition-all duration-300">
                <span className="text-lg font-medium tracking-wide">
                  {image.alt}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
