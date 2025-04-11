"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Trash } from "lucide-react";
import { Product } from "@/types/intrerface";
import {
  addProduct,
  deleteProduct,
  updateProduct,
} from "@/lib/actions/product-action";
import Image from "next/image";

interface ProductModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  productData: Product;
  refreshProducts: () => Promise<void>;
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
}

const ProductModal = ({
  open,
  setOpen,
  productData,
  refreshProducts,
  isEditing,
  setIsEditing,
}: ProductModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product>({
    id: "",
    title: "",
    description: "",
    price: 0,
    image_url: "",
    duration: "",
    photos: "",
    cta: "",
  });

  useEffect(() => {
    if (isEditing) {
      setProduct(productData);
    } else {
      setProduct({
        id: "",
        title: "",
        description: "",
        price: 0,
        image_url: "",
        duration: "",
        photos: "",
        cta: "",
      });
    }
  }, [isEditing, productData]);

  const handleClose = () => {
    setOpen(false);
    setIsEditing(false);
    setProduct({
      id: "",
      title: "",
      description: "",
      price: 0,
      image_url: "",
      duration: "",
      photos: "",
      cta: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !product.title ||
      !product.price ||
      !product.image_url ||
      !product.duration ||
      !product.photos
    ) {
      toast.error("Missing information", {
        description: "Please provide all required fields",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      if (isEditing) {
        // Handle editing
        await handleEdit({
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          duration: product.duration,
          photos: product.photos,
          cta: product.cta,
        });
      } else {
        // Handle adding new product
        await handleAddProduct({
          id: "",
          title: product.title,
          description: product.description,
          price: product.price,
          image_url: product.image_url,
          duration: product.duration,
          photos: product.photos,
          cta: product.cta,
        });
      }
    } catch (error) {
      console.error("Failed to add product:", error);
      toast.error("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProduct = async (product: Product) => {
    setIsSubmitting(true);
    try {
      const res = await addProduct(product);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Product added successfully");
        handleClose();

        await refreshProducts();
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = async (product: Product) => {
    if (!product.id) {
      toast.error("Product ID is required", {
        description: "Please try again!",
      });
      return;
    }

    // Check if required fields are filled
    if (
      !product.title ||
      !product.price ||
      !product.image_url ||
      !product.duration ||
      !product.photos
    ) {
      toast.error("Missing information", {
        description: "Please provide all required fields",
      });
      return;
    }

    // Check if product with same data
    if (
      product.title === productData.title &&
      product.price === productData.price &&
      product.image_url === productData.image_url &&
      product.duration === productData.duration &&
      product.photos === productData.photos &&
      product.description === productData.description &&
      product.cta === productData.cta
    ) {
      toast.error("No changes made", {
        description: "Please make some changes before submitting.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await updateProduct(product);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Product updated successfully");
        handleClose();

        await refreshProducts();
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsSubmitting(true);
    try {
      const res = await deleteProduct(id);

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Product deleted successfully");
        handleClose();
        await refreshProducts();
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90%] overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Make changes to the product details below."
              : "Fill out the details below to add a new product."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {product.image_url && (
                <div className="mt-2 relative h-40 overflow-hidden rounded-md border border-gray-200">
                  <Image
                    src={product.image_url}
                    alt="Preview"
                    height={240}
                    width={240}
                    className="object-contain rounded mx-auto w-fit h-full max-h-64"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="title">Product Name</Label>
                <Input
                  id="title"
                  placeholder="Enter product name"
                  value={product.title}
                  onChange={(e) =>
                    setProduct({ ...product, title: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  placeholder="Enter image URL"
                  value={product.image_url}
                  onChange={(e) =>
                    setProduct({ ...product, image_url: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    placeholder="0.00"
                    type="number"
                    value={product.price}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    placeholder="e.g. 1 hour"
                    value={product.duration}
                    onChange={(e) =>
                      setProduct({ ...product, duration: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photos">Number of Photos</Label>
                <Input
                  id="photos"
                  placeholder="e.g. 20 photos"
                  value={product.photos}
                  onChange={(e) =>
                    setProduct({ ...product, photos: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter product description"
                  rows={4}
                  value={product.description}
                  onChange={(e) =>
                    setProduct({ ...product, description: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta">Call to Action Text</Label>
                <Input
                  id="cta"
                  placeholder="e.g. Book Now"
                  value={product.cta}
                  onChange={(e) =>
                    setProduct({ ...product, cta: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <div className="mr-auto">
              {isEditing && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => handleDelete(product.id)}
                  disabled={isSubmitting}
                  className="hover:bg-red-500 hover:text-white"
                >
                  {isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash className="mr-2 h-4 w-4" />
                  )}
                  Delete Product
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setIsEditing(false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Adding..."}
                  </>
                ) : isEditing ? (
                  "Update Product"
                ) : (
                  "Add Product"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
