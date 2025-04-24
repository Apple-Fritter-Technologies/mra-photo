import { Product } from "@/types/intrerface";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProductCard = ({ pkg }: { pkg: Product }) => {
  return (
    <Link
      href={`/investment/${pkg.id}`}
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
          <span className="text-xl font-bold text-secondary">${pkg.price}</span>
        </div>

        <div className="flex justify-between font-medium text-gray-500">
          <span className="flex items-center gap-1">{pkg.photos}</span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-secondary"></span>
            {pkg.duration}
          </span>
        </div>

        <div className="mt-2 w-full bg-secondary text-white font-bold py-3 text-center rounded-md group-hover:bg-primary group-hover:text-black transition-all duration-300 ease-in-out text-xl border border-transparent group-hover:border-secondary flex items-center justify-center gap-2 relative overflow-hidden">
          <span className="relative z-10 inline-flex items-center gap-2 transform transition-transform duration-300 group-hover:translate-x-0">
            View Details
            <ChevronRight
              className="transform transition-transform duration-300 group-hover:translate-x-1"
              size={20}
            />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
