"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { Loader2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { fetchPortfolioImages } from "@/lib/actions/portfolio-action";
import PortfolioModal from "../../components/portfolio-modal";
import { PortfolioImage } from "@/types/intrerface";

// Interfaces for portfolio data

const PortfolioPage = () => {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState<PortfolioImage | null>(null);

  const getPortfolioImages = async () => {
    setLoading(true);
    try {
      const res = await fetchPortfolioImages();

      if (res.error) {
        setError(true);
        toast.error(res.error);
      } else {
        setImages(res);
      }
    } catch (error) {
      setError(true);
      toast.error("Failed to fetch portfolio images");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPortfolioImages();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-xl bg-background/50 rounded-lg border border-white/10 p-4">
        <h1 className="text-2xl font-bold">Portfolio Management</h1>

        <PortfolioModal
          open={open}
          setOpen={setOpen}
          imageData={currentImage || { id: "", url: "", title: "" }}
          getPortfolioImages={getPortfolioImages}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>

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

      {!loading && !error && images.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium">No portfolio images yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Add images to showcase your work
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 py-8">
          {images.map((image) => (
            <div
              key={image.id}
              className="group relative overflow-hidden rounded-lg border shadow-sm transition-all mb-6 break-inside-avoid"
            >
              <div className="relative">
                <Image
                  src={image.url}
                  alt={image.title}
                  width={600}
                  height={600}
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <div className="p-3">
                <p className="font-medium truncate">{image.title}</p>
              </div>

              <Button
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  setIsEditing(true);
                  setCurrentImage(image);
                  setOpen(true);
                }}
              >
                <Pencil size={16} />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
