import { ImageHeaderProps } from "@/type/intrerface";
import Image from "next/image";
import React from "react";

const ImageHeader = ({ img, title }: ImageHeaderProps) => {
  return (
    <div className="relative max-h-[500px] w-full overflow-hidden">
      <Image
        src={img || "/images/landscape.jpg"}
        alt="header-image"
        width={1200}
        height={1200}
        priority
        className="rounded-lg shadow-lg object-cover object-top w-full max-h-[500px]"
      />

      <div className="absolute top-0 left-0 w-full h-full bg-black/40 rounded-lg flex items-center justify-center">
        <h1 className="text-white text-6xl md:text-8xl font-bold font-title">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default ImageHeader;
