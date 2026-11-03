"use client";

import NextImage, { type ImageProps } from "next/image";
import { withBasePath } from "@/lib/paths";

export default function Image({ src, alt, ...props }: ImageProps) {
  return <NextImage {...props} alt={alt} src={typeof src === "string" ? withBasePath(src) : src} />;
}
