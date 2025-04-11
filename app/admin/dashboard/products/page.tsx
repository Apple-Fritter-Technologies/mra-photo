"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, Pencil, Plus } from "lucide-react";
import { toast } from "sonner";

import { Product } from "@/types/intrerface";
import ProductModal from "../../components/product-modal";

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  // This would be replaced with your actual product fetch function
  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      const response = await fetch("/api/products");
      const data = await response.json();

      if (!response.ok) {
        setError(true);
        toast.error(data.message || "Failed to fetch products");
      } else {
        setProducts(data);
      }
    } catch (error: any) {
      console.error("Error fetching products:", error);
      setError(true);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddNewProduct = () => {
    setIsEditing(false);
    setCurrentProduct(null);
    setOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex justify-between flex-wrap gap-4 items-center sticky top-2 z-10 backdrop-blur-xl bg-background/50 rounded-lg border border-white/10 p-4">
        <h1 className="text-2xl font-bold">Product Management</h1>
        <Button
          onClick={handleAddNewProduct}
          className="flex items-center gap-2"
        >
          <Plus size={16} />
          Add New Product
        </Button>

        <ProductModal
          open={open}
          setOpen={setOpen}
          productData={
            currentProduct || {
              id: "",
              title: "",
              description: "",
              price: 0,
              image_url: "",
              duration: "",
              photos: "",
              cta: "",
            }
          }
          refreshProducts={fetchProducts}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
        />
      </div>

      {error && (
        <div className="text-red-500 text-center py-4 bg-muted/50 rounded-lg">
          <p>Error fetching products. Please try again.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setError(false);
              fetchProducts();
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

      {!loading && !error && products.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium">No products yet</h3>
          <p className="text-sm text-muted-foreground mt-2">
            Add products to showcase your offerings
          </p>
          <Button onClick={handleAddNewProduct} className="mt-4">
            Add Your First Product
          </Button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-lg w-full h-full max-w-[389px] shadow-md border border-white/10 bg-background/50 transition-all duration-300 ease-in-out overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xl font-semibold px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm">
                    {product.title}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4 h-full">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold truncate">
                    {product.title}
                  </h3>
                  <span className="text-xl font-bold text-secondary whitespace-nowrap">
                    ${product.price}
                  </span>
                </div>

                <p className="text-gray-600 overflow-hidden break-all">
                  {product?.description?.length > 100
                    ? product.description.slice(0, 100) + "..."
                    : product.description}
                </p>

                <div className="flex justify-between font-medium text-gray-500">
                  <span className="flex items-center gap-1">
                    {product.photos}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-secondary"></span>
                    {product.duration}
                  </span>
                </div>

                {/* cta button */}
                <div className="mt-auto w-full bg-secondary text-white font-bold py-3 text-center rounded-md group-hover:bg-primary group-hover:text-black transition-all duration-300 ease-in-out text-xl border border-transparent group-hover:border-secondary flex items-center justify-center gap-2 relative overflow-hidden">
                  <span className="relative z-10 inline-flex items-center gap-2 transform transition-transform duration-300 group-hover:translate-x-0">
                    {product.cta}
                  </span>
                </div>

                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Pencil size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
