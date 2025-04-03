"use client";

import React from "react";
import { motion } from "motion/react";

interface PageTitleProps {
  title: string;
  subtitle: string;
  subtitle2?: string;
}

const PageTitle = ({ title, subtitle, subtitle2 }: PageTitleProps) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        when: "beforeChildren",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const titleVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-6 my-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={containerVariants}
    >
      <motion.p
        variants={itemVariants}
        className="tracking-wider uppercase text-gray-600 font-medium"
      >
        {subtitle}
      </motion.p>

      <motion.h1
        className="font-title md:text-6xl text-4xl text-center"
        variants={titleVariants}
      >
        {title}
      </motion.h1>

      {subtitle2 && (
        <motion.p className="mt-4 text-gray-700" variants={itemVariants}>
          {subtitle2}
        </motion.p>
      )}
    </motion.div>
  );
};

export default PageTitle;
