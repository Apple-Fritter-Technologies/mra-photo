import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  addPortfolioImage,
  deletePortfolioImage,
  updatePortfolioImage,
} from "@/lib/actions/portfolio-action";
import { PortfolioImage } from "@/types/intrerface";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

interface PortfolioModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  imageData: PortfolioImage;
  getPortfolioImages: () => Promise<void>;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const PortfolioModal = ({
  open,
  setOpen,
  getPortfolioImages,
  isEditing,
  setIsEditing,
  imageData,
}: PortfolioModalProps) => {
  const [submitting, setSubmitting] = useState(false);
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

    if (!imageUrl) {
      toast.error("Missing information", {
        description: "Please provide image URL",
      });
      return;
    }

    setSubmitting(true);

    try {
      if (isEditing) {
        // Handle editing
        await handleEdit({
          id: imageData.id,
          image_url: imageUrl,
          title: imageTitle,
        });
      } else {
        // Handle adding new image
        await handleAddImage({
          id: "",
          image_url: imageUrl,
          title: imageTitle,
        });
      }
    } catch (error) {
      toast.error("Failed to add portfolio image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddImage = async (image: PortfolioImage) => {
    setSubmitting(true);
    try {
      const res = await addPortfolioImage({
        id: image.id,
        image_url: image.image_url,
        title: image.title || "Portfolio",
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Portfolio image added successfully");
        handleClose();

        await getPortfolioImages();
      }
    } catch (error) {
      toast.error("Failed to add portfolio image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    // confirm if the user wants to delete the image
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this image? This action cannot be undone."
    );
    if (!confirmDelete) return;

    setSubmitting(true);

    try {
      const res = await deletePortfolioImage(id);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Portfolio image deleted successfully");
        handleClose();

        await getPortfolioImages();
      }
    } catch (error) {
      toast.error("Failed to delete portfolio image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (image: PortfolioImage) => {
    if (!image?.id) {
      toast.error("Missing image ID", {
        description: "Please try again!",
      });
      return;
    }

    // if the text is same of empty then show error message
    if (!image.image_url) {
      toast.error("Missing information", {
        description: "Please provide both image URL and title",
      });
      return;
    }

    // Check if the image URL is the same as before
    if (
      image.image_url === imageData.image_url &&
      image.title === imageData.title
    ) {
      toast.error("No changes made", {
        description: "Please make changes to the image URL or title",
      });
      return;
    }

    setSubmitting(true);

    try {
      const res = await updatePortfolioImage(image?.id, image);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Portfolio image updated successfully");
        handleClose();

        await getPortfolioImages();
      }
    } catch (error) {
      toast.error("Failed to update portfolio image");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setImageUrl("");
    setImageTitle("");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
        setOpen(isOpen);
      }}
    >
      <DialogTrigger asChild>
        <Button className="flex gap-2">
          <PlusCircle size={16} />
          Add New Image
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Portfolio Image" : "Add Portfolio Image"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the details of your portfolio image. Click save when you're done."
                : "Add a new image to your portfolio collection. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageTitle" className="text-right">
                Title
              </Label>
              <Input
                id="imageTitle"
                value={imageTitle}
                onChange={(e) => setImageTitle(e.target.value)}
                className="col-span-3"
                placeholder="Autumn Portrait"
              />
            </div>

            {imageUrl && (
              <div className="mt-2 p-2 border rounded">
                <p className="text-sm text-muted-foreground mb-2">Preview:</p>

                <div>
                  <Image
                    src={imageUrl}
                    alt="Preview"
                    height={240}
                    width={240}
                    className="object-contain rounded mx-auto w-auto h-full max-h-64"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-between items-center">
            {isEditing && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => handleDelete(imageData.id)}
                disabled={submitting}
                className="mr-auto hover:bg-red-600 hover:text-white transition-colors"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Saving..."}
                </>
              ) : isEditing ? (
                "Update Image"
              ) : (
                "Save Image"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioModal;
