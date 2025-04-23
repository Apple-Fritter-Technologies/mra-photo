"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
  Loader2,
  Calendar,
  Clock,
  Image as ImageIcon,
  ArrowLeft,
  Check,
} from "lucide-react";
import { toast } from "sonner";

import ImageHeader from "@/components/image-header";
import PageTitle from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/intrerface";
import { getProducts } from "@/lib/actions/product-action";

const ProductDetailPage = () => {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProducts();

        if (response.error) {
          setError(true);
          toast.error("Error fetching product details");
          return;
        }

        const foundProduct = response.find((p: Product) => p.id === id);

        if (!foundProduct) {
          setError(true);
          toast.error("Product not found");
          return;
        }

        setProduct(foundProduct);
      } catch (error) {
        setError(true);
        toast.error(
          "An unexpected error occurred while fetching product details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handlePayment = async () => {
    setPaymentLoading(true);

    try {
      // Mock integration with Square payment
      // In a real implementation, this would redirect to Square checkout or open a Square payment form
      toast.success("Redirecting to payment gateway...");

      // Simulating redirect to prevent immediate call
      setTimeout(() => {
        router.push(`/inquire?package=${id}`);
      }, 1500);
    } catch (error) {
      toast.error("Failed to initiate payment");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleGoBack = () => {
    router.push("/investment");
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-secondary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center gap-6 min-h-[60vh]">
        <PageTitle
          title="Product Not Found"
          subtitle="We couldn't find the photography package you're looking for."
        />
        <Button onClick={handleGoBack} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to All Packages
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 flex flex-col gap-8 pb-16">
      <ImageHeader img={product.image_url} title={product.title} />

      <Button
        variant="ghost"
        className="w-fit flex items-center gap-2"
        onClick={handleGoBack}
      >
        <ArrowLeft size={16} />
        Back to All Packages
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-xl">
          <Image
            src={product.image_url}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="space-y-3">
            <h1 className="text-4xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-2">
              <span className="bg-secondary/10 text-secondary px-4 py-2 rounded-full font-bold text-xl">
                ${product.price}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-secondary" />
              <span className="font-medium">{product.duration}</span>
            </div>
            <div className="flex items-center gap-3">
              <ImageIcon className="h-5 w-5 text-secondary" />
              <span className="font-medium">{product.photos}</span>
            </div>
          </div>

          <div className="space-y-3 py-4 border-y border-gray-200">
            <h3 className="text-xl font-semibold">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {product.description ||
                "No description available for this package."}
            </p>
          </div>

          <div className="space-y-3 py-4">
            <h3 className="text-xl font-semibold">What's Included</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <span>
                  Professional photography session ({product.duration})
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <span>
                  {product.photos} professionally edited digital images
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <span>Online gallery for easy viewing and downloading</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                <span>Print release for personal use</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 mt-4">
            <Button
              size="lg"
              className="w-full py-6 text-xl bg-secondary hover:bg-secondary/90 text-white"
              onClick={handlePayment}
              disabled={paymentLoading}
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                `Book Now - $${product.price}`
              )}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full py-6 text-xl"
              onClick={() => router.push(`/inquire?package=${id}`)}
            >
              Inquire About This Package
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-gray-50 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Booking Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 text-secondary mb-4">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2">Book & Pay</h3>
            <p className="text-gray-600">
              Secure your session date with a booking payment.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 text-secondary mb-4">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2">Photo Session</h3>
            <p className="text-gray-600">
              Enjoy your {product.duration} photography experience.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-secondary/10 text-secondary mb-4">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2">Receive Photos</h3>
            <p className="text-gray-600">
              Get your {product.photos} professionally edited photos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
