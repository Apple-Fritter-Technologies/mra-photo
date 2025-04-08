import ImageHeader from "@/components/image-header";
import PageTitle from "@/components/page-title";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { sessionData } from "@/lib/data";

const InvestmentPage = () => {
  const img = "/images/landscape.jpg";

  return (
    <div className="container mx-auto px-4 flex flex-col gap-8 pb-16">
      <ImageHeader img={img} title="Investment" />

      <div className="flex flex-col items-center">
        <PageTitle
          title="Photography Packages"
          subtitle="Choose the perfect session for your special moments"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sessionData.map((pkg) => (
          <Link
            href={`/inquire?package=${pkg.id}`}
            key={pkg.id}
            className="group rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src={pkg.image}
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

              <p className="text-gray-600">{pkg.description}</p>

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
    </div>
  );
};

export default InvestmentPage;
