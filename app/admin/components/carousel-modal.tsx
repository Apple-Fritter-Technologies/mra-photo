"use client";

import {
  addCarouselImage,
  deleteCarouselImage,
  updateCarouselImage,
} from "@/lib/actions/carousel-actions";
import { CarouselImage } from "@/types/intrerface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface CarouselModalProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  imageData: CarouselImage;
  getCarouselImages: () => Promise<void>;
  isEditing: boolean;
  setIsEditing: Dispatch<SetStateAction<boolean>>;
}

const CarouselModal = ({
  open,
  setOpen,
  imageData,
  getCarouselImages,
  isEditing,
  setIsEditing,
}: CarouselModalProps) => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(imageData.image_url);
  const [imageTitle, setImageTitle] = useState(imageData.title);

  useEffect(() => {
    if (isEditing) {
      setImageUrl(imageData.image_url);
      setImageTitle(imageData.title);
    } else {
      setImageUrl("");
      setImageTitle("");
    }
  }, [isEditing, imageData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!imageUrl) {
        toast.error("Image URL is required");
        return;
      }

      if (isEditing) {
        // Update existing image
        const res = await updateCarouselImage(imageData.id, {
          id: imageData.id,
          image_url: imageUrl,
          title: imageTitle,
        });
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Carousel image updated successfully");
          setOpen(false);
          await getCarouselImages();
        }
      } else {
        // Add new image
        const res = await addCarouselImage({
          id: "",
          image_url: imageUrl,
          title: imageTitle,
        });
        if (res.error) {
          toast.error(res.error);
        } else {
          toast.success("Carousel image added successfully");
          setOpen(false);
          await getCarouselImages();
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    // Confirm deletion
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await deleteCarouselImage(imageData.id);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Carousel image deleted successfully");
        setOpen(false);
        await getCarouselImages();
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setImageUrl("");
    setImageTitle("");
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            handleClose();
          }
          setOpen(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-md max-h-[90%] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Carousel Image" : "Add Carousel Image"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL *</Label>
              <Input
                id="image_url"
                name="image_url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Optional title"
                value={imageTitle || ""}
                onChange={(e) => setImageTitle(e.target.value)}
              />
            </div>

            {imageUrl && (
              <div className="mt-4 border rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                  width={600}
                  height={400}
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://placehold.co/600x400?text=Invalid+Image+URL";
                  }}
                />
              </div>
            )}

            <div className="flex justify-between items-center pt-4">
              {isEditing && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={loading}
                >
                  <Trash size={16} className="mr-2" />
                  Delete
                </Button>
              )}

              <div className="flex gap-2 ml-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {isEditing ? "Updating..." : "Adding..."}
                    </>
                  ) : isEditing ? (
                    "Update"
                  ) : (
                    "Add"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CarouselModal;
