"use client";

import ImageHeader from "@/components/image-header";
import PageTitle from "@/components/page-title";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Loader2 } from "lucide-react";
import { Product } from "@/types/intrerface";
import { getProducts } from "@/lib/actions/product-action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const InvestmentPage = () => {
  const img = "/images/landscape.jpg";

  const [sessions, setSessions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSessions = async () => {
    setLoading(true);
    try {
      const res = await getProducts();

      if (res.error) {
        setError(true);
        toast.error("Error fetching sessions");
      } else {
        setSessions(res);
      }
    } catch (error: unknown) {
      console.error("Error fetching sessions:", error);
      setError(true);
      toast.error("An unexpected error occurred while fetching sessions.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <div className="container mx-auto px-4 flex flex-col gap-8 pb-16">
      <ImageHeader img={img} title="Investment" />

      <div className="flex flex-col items-center">
        <PageTitle
          title="Photography Packages"
          subtitle="Choose the perfect session for your special moments"
        />
      </div>

      {error && (
        <div className="text-red-500 text-center py-4 bg-muted/50 rounded-lg">
          <p>Error fetching products. Please try again.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              fetchSessions();
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

      {!loading && !error && sessions.length === 0 ? (
        <div className="text-center py-12 bg-muted/50 rounded-lg">
          <h3 className="text-lg font-medium">No products yet</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sessions.map((pkg) => (
            <Link
              href={`/inquire?package=${pkg.id}`}
              key={pkg.id}
              className="group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={pkg.image_url}
                  alt={pkg.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-white text-xl font-semibold px-4 py-2 rounded-lg bg-black/40 backdrop-blur-sm">
                    {pkg.title}
                  </span>
                </div>
              </div>

              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold">{pkg.title}</h3>
                  <span className="text-xl font-bold text-secondary">
                    {pkg.price}
                  </span>
                </div>

                <p className="text-gray-600 break-all">{pkg.description}</p>

                <div className="flex justify-between font-medium text-gray-500">
                  <span className="flex items-center gap-1">
                    {/* <span className="h-2 w-2 rounded-full bg-secondary"></span> */}
                    {pkg.photos}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-secondary"></span>
                    {pkg.duration}
                  </span>
                </div>

                <div className="mt-2 w-full bg-secondary text-white font-bold py-3 text-center rounded-md group-hover:bg-primary group-hover:text-black transition-all duration-300 ease-in-out text-xl border border-transparent group-hover:border-secondary flex items-center justify-center gap-2 relative overflow-hidden">
                  <span className="relative z-10 inline-flex items-center gap-2 transform transition-transform duration-300 group-hover:translate-x-0">
                    {pkg.cta}
                    <ChevronRight
                      className="transform transition-transform duration-300 group-hover:translate-x-1"
                      size={20}
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestmentPage;
