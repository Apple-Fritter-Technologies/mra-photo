import Carousel from "@/components/carousel";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
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
        <div className="flex flex-col items-center gap-6 my-12">
          <p>MICHIGAN FAMILY PHOTOGRAPHER</p>
          <h1 className="font-title md:text-6xl text-4xl">
            Documenting Life's Precious Moments
          </h1>
          <p className="mt-4">MATERNITY, FAMILY, SENIOR, MILESTONE, & MORE</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8 md:my-16">
          <Image
            src="/images/home-1.jpg"
            alt="home-1"
            width={800}
            height={600}
            priority
            className="rounded-lg shadow-lg object-cover w-full md:w-1/2 max-h-[500px]"
          />
          <div className="flex flex-col gap-8 items-center w-full md:w-1/2 max-w-lg mx-auto">
            <h2 className="font-title md:text-6xl text-4xl">
              Being Behind The Camera
            </h2>
            <p className="text-lg md:text-xl">
              As the parent, we are always the one behind the camera capturing
              our children's precious moments. Not often are we able to get in
              the picture with them.. I believe it is utmost important that the
              mom and dad are documented with the kids so that our children and
              grandchildren will have countless photos and memories to look back
              on and remember us by.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse gap-8 my-16">
          <Image
            src="/images/home-2.jpg"
            alt="home-1"
            width={800}
            height={600}
            priority
            className="rounded-lg shadow-lg object-cover w-full md:w-1/2 max-h-[500px]"
          />{" "}
          <div className="flex flex-col gap-8 items-center w-full md:w-1/2 max-w-lg mx-auto">
            <h2 className="font-title md:text-6xl text-4xl">My Passion</h2>
            <p className="text-lg md:text-xl">
              As a mama myself, my passion is to stop time in the way I know
              how.. To photograph just how tiny baby toes are, the toothless
              smiles, the ever changing personalities our littles developing
              into who they are. The years go by too quickly. Take some time to
              be in the moment with your family and forget about the never
              ending dishes or the kids' schedules. Be present, have fun, cuddle
              close, and I promise, the photos you will get from doing these
              things will be well worth it and cherished forever.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
