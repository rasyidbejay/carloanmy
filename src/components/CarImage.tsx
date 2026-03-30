"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const DEFAULT_FALLBACK_SRC = "/placeholder/car-placeholder.webp";

type CarImageProps = Omit<ImageProps, "alt" | "src"> & {
  alt: string;
  src?: string | null;
  fallbackSrc?: string;
};

export default function CarImage({
  alt,
  className,
  fallbackSrc = DEFAULT_FALLBACK_SRC,
  src,
  ...props
}: CarImageProps) {
  const [activeSrc, setActiveSrc] = useState(src || fallbackSrc);

  useEffect(() => {
    setActiveSrc(src || fallbackSrc);
  }, [fallbackSrc, src]);

  return (
    <Image
      alt={alt}
      className={cn("object-cover", className)}
      src={activeSrc}
      onError={() => {
        if (activeSrc !== fallbackSrc) {
          setActiveSrc(fallbackSrc);
        }
      }}
      {...props}
    />
  );
}
