"use client";

import { useState } from "react";
import Image from "@/components/shared/image";
import { ChevronLeft, ChevronRight, Package, ZoomIn } from "lucide-react";
import type { ProductImage } from "@/domain/models";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState<string[]>([]);
  const index = Math.min(selected, Math.max(0, images.length - 1));
  const image = images[index];
  const hasPhoto = image && !failed.includes(image.src);
  const change = (step: number) => setSelected((index + step + images.length) % images.length);

  const photo = (enlarged = false) =>
    hasPhoto ? (
      <Image
        src={image.src}
        alt={image.alt || name}
        fill
        sizes={enlarged ? "(max-width: 767px) 90vw, 800px" : "(max-width: 767px) 90vw, 550px"}
        loading="eager"
        className={cn("object-contain", enlarged ? "p-4" : "p-8 sm:p-12")}
        onError={() =>
          setFailed((previous) =>
            previous.includes(image.src) ? previous : [...previous, image.src],
          )
        }
      />
    ) : (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-muted-foreground">
        <Package size={56} strokeWidth={1.25} aria-hidden="true" />
        <p className="text-sm">Фотография пока недоступна</p>
      </div>
    );

  return (
    <section aria-label={`Фотографии: ${name}`} className="min-w-0">
      <Dialog>
        <div className="relative aspect-square overflow-hidden rounded-2xl border bg-white">
          {hasPhoto ? (
            <DialogTrigger asChild>
              <button
                type="button"
                className="relative block size-full cursor-zoom-in"
                aria-label={`Увеличить фото: ${name}`}
              >
                {photo()}
                <span className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-2 text-xs">
                  <ZoomIn size={16} aria-hidden="true" />
                  Увеличить
                </span>
              </button>
            </DialogTrigger>
          ) : (
            photo()
          )}
        </div>
        <DialogContent className="max-w-4xl gap-3 p-4 sm:p-6">
          <DialogTitle className="pr-12 text-lg font-semibold">{name}</DialogTitle>
          <DialogDescription className="sr-only">
            Увеличенная фотография товара. Закройте окно клавишей Escape.
          </DialogDescription>
          <div className="relative h-[55dvh] sm:h-[65dvh]">{photo(true)}</div>
          {images.length > 1 && (
            <div className="flex items-center justify-center gap-5">
              <Button variant="secondary" aria-label="Предыдущее фото" onClick={() => change(-1)}>
                <ChevronLeft size={18} />
              </Button>
              <span aria-live="polite" className="text-sm tabular-nums">
                {index + 1} / {images.length}
              </span>
              <Button variant="secondary" aria-label="Следующее фото" onClick={() => change(1)}>
                <ChevronRight size={18} />
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {images.length > 1 && (
        <div aria-label="Выбор фотографии" className="mt-3 flex flex-wrap gap-3">
          {images.map((image, imageIndex) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Фото ${imageIndex + 1}: ${image.alt || name}`}
              aria-pressed={index === imageIndex}
              onClick={() => setSelected(imageIndex)}
              className={cn(
                "relative size-20 overflow-hidden rounded-xl border bg-white",
                index === imageIndex && "border-primary ring-1 ring-primary",
              )}
            >
              <Image src={image.src} alt="" fill sizes="80px" className="object-contain p-2" />
            </button>
          ))}
        </div>
      )}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {images.length > 1 ? `${index + 1} из ${images.length} · Фото товара` : "Фото товара"}
      </p>
    </section>
  );
}
