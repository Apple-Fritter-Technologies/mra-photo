import Carousel from "@/components/carousel";
import IntroductionCard from "@/components/introduction-card";
import PageTitle from "@/components/page-title";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 flex flex-col gap-4">
      <Carousel />

      <Link href="/inquire">
        <button className="bg-secondary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-primary hover:text-black transition duration-300 ease-in-out w-fit mx-auto text-xl border border-transparent hover:border-secondary flex items-center group gap-2 mt-2">
          Inquire Now
          <ChevronRight
            className="group-hover:translate-x-1 transition-transform duration-300 ease-in-out"
            size={20}
          />
        </button>
      </Link>

      <div className="flex flex-col items-center">
        <PageTitle
          title="Documenting Life's Precious Moments"
          subtitle="MICHIGAN FAMILY PHOTOGRAPHER"
          subtitle2="MATERNITY, FAMILY, SENIOR, MILESTONE, & MORE"
        />

        <IntroductionCard
          title="Being Behind The Camera"
          description="As the parent, we are always the one behind the camera capturing our children's precious moments. Not often are we able to get in the picture with them.. I believe it is utmost important that the mom and dad are documented with the kids so that our children and grandchildren will have countless photos and memories to look back on and remember us by."
          imageUrl="/images/home/home-1.jpg"
          direction="left"
        />

        <IntroductionCard
          title="My Passion"
          description="As a mama myself, my passion is to stop time in the way I know how.. To photograph just how tiny baby toes are, the toothless smiles, and the ever changing personalities our littles have developing into who they really are. The years go by too quickly. Take some time to be in the moment with your family and forget about the never ending dishes or the kids' schedules. Be present, have fun, cuddle close, and I promise, the photos you will get from doing these things will be well worth it and cherished forever."
          imageUrl="/images/home/home-2.jpg"
          direction="right"
        />
      </div>
    </div>
  );
}
