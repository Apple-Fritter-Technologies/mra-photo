"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import GalleryModal from "./gallery-modal";
import { motion } from "motion/react";

interface IntroductionCardProps {
  title: string;
  description: string;
  imageUrl: string;
  direction: "left" | "right";
}

const IntroductionCard = ({
  title,
  description,
  direction,
  imageUrl,
}: IntroductionCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Handle image click to open modal
  const handleImageClick = () => {
    setModalImageIndex(0); // Always 0 since we have only one image
    setModalOpen(true);
  };

  const images = [{ id: "99", url: imageUrl, title: title }];

  // Animation variants
  const imageAnimationVariant = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -50 : 50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
      },
    },
  };

  const textAnimationVariant = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? 50 : -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn(
        "flex flex-col gap-8 mb-16 md:my-16",
        direction === "left" ? "md:flex-row" : "md:flex-row-reverse"
      )}
    >
      <motion.div
        className="w-full md:w-1/2 mb-4 break-inside-avoid"
        variants={imageAnimationVariant}
      >
        <motion.div
          className="relative group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          onClick={handleImageClick}
          role="button"
          tabIndex={0}
          aria-label={`View ${title}`}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleImageClick();
            }
          }}
          whileHover={{
            scale: 1.03,
            transition: { duration: 0.3 },
          }}
        >
          <Image
            src={imageUrl}
            alt={title}
            width={800}
            height={600}
            priority
            className="rounded-lg shadow-lg object-cover w-full max-h-[500px]"
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="flex flex-col gap-8 items-center w-full md:w-1/2 max-w-lg mx-auto"
        variants={textAnimationVariant}
      >
        <motion.h2
          className="font-title md:text-6xl text-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-lg md:text-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {description}
        </motion.p>
      </motion.div>

      <GalleryModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        images={images}
        initialImageIndex={modalImageIndex}
      />
    </motion.div>
  );
};

export default IntroductionCard;
