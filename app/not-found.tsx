import { Camera, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-4">
      <Camera className="w-24 h-24 mb-8 text-neutral-500 dark:text-neutral-400 animate-pulse" />

      <h1 className="text-4xl font-bold text-neutral-800 dark:text-neutral-100 mb-2">
        Shot Not Found
      </h1>

      <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-8">
        The page you're looking for is out of frame.
      </p>

      <Link href="/">
        <button className="bg-secondary text-white font-bold py-3 px-6 rounded-full shadow-lg hover:bg-primary hover:text-black transition duration-300 ease-in-out w-fit mx-auto text-lg border border-transparent hover:border-secondary flex items-center group gap-2 mt-2">
          <ChevronLeft
            className="group-hover:-translate-x-1 transition-transform duration-300 ease-in-out"
            size={20}
          />
          Return to Gallery
        </button>
      </Link>

      <p className="mt-12 text-neutral-500 dark:text-neutral-400">
        Perhaps try another angle or adjust your focus.
      </p>
    </div>
  );
}
