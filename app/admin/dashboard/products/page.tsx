"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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
    } catch (error) {
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

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        // Replace with actual API call
        const response = await fetch(`/api/products/${productId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          toast.error("Failed to delete product");
        } else {
          toast.success("Product deleted successfully");
          fetchProducts(); // Refresh the products list
        }
      } catch (error) {
        toast.error("An error occurred while deleting the product");
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex justify-between items-center sticky top-2 z-10 backdrop-blur-xl bg-background/50 rounded-lg border border-white/10 p-4">
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
              price: "",
              image: "",
              category: "",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative overflow-hidden rounded-lg border shadow-md transition-all hover:shadow-lg bg-white"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-5">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold truncate">
                    {product.title}
                  </h3>
                  <span className="text-lg font-bold text-secondary">
                    ${product.price}
                  </span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                  {product.description}
                </p>

                <div className="flex items-center">
                  <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary rounded-full">
                    {product.category}
                  </span>
                </div>
              </div>

              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleEditProduct(product)}
                >
                  <Pencil size={16} />
                </Button>

                <Button
                  size="icon"
                  variant="destructive"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
