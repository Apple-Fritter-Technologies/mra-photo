"use client";

import ImageHeader from "@/components/image-header";
import PageTitle from "@/components/page-title";
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Product } from "@/types/intrerface";
import { getProducts } from "@/lib/actions/product-action";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/product-card";

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
            <ProductCard key={pkg.id} pkg={pkg} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InvestmentPage;
