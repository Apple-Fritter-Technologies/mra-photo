"use client";

import { ImageHeaderProps } from "@/type/intrerface";
import Image from "next/image";
import React from "react";
import { motion } from "motion/react";

const ImageHeader = ({ img, title }: ImageHeaderProps) => {
  // Animation variants with increased speed
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4, // Reduced from 0.8
        when: "beforeChildren",
      },
    },
  };

  const imageVariants = {
    hidden: { scale: 1.1, opacity: 0.8 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6, // Reduced from 1.2
        ease: "easeOut",
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.4, // Reduced from 0.8
        delay: 0.15, // Reduced from 0.3
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4, // Reduced from 0.8
        delay: 0.3, // Reduced from 0.6
        type: "spring",
        stiffness: 120, // Increased from 100 for snappier motion
        damping: 10, // Added damping for more controlled bounce
      },
    },
  };

  return (
    <motion.div
      className="relative max-h-[500px] w-full overflow-hidden"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={imageVariants} className="w-full h-full">
        <Image
          src={img || "/images/landscape.jpg"}
          alt="header-image"
          width={1200}
          height={1200}
          priority
          className="rounded-lg shadow-lg object-cover object-top w-full max-h-[500px]"
        />
      </motion.div>

      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-black/40 rounded-lg flex items-center justify-center"
        variants={overlayVariants}
      >
        <motion.h1
          className="text-white text-6xl md:text-8xl font-bold font-title"
          variants={titleVariants}
        >
          {title}
        </motion.h1>
      </motion.div>
    </motion.div>
  );
};

export default ImageHeader;
