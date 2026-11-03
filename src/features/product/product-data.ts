import type { Product, ProductImage } from "@/domain/models";

export function findPublishedProduct(products: Product[], slug: string) {
  return products.find((product) => product.slug === slug && product.status === "published");
}

// The primary photo stays first; repeated URLs do not create artificial gallery views.
export function productImages(product: Product): ProductImage[] {
  const images = product.image
    ? [{ src: product.image, alt: product.imageAlt }, ...(product.images ?? [])]
    : (product.images ?? []);
  return images.filter(
    (image, index) =>
      image.src.trim() && images.findIndex((item) => item.src === image.src) === index,
  );
}

export function similarProducts(products: Product[], product: Product, limit = 3) {
  return products
    .filter(
      (item) =>
        item.id !== product.id &&
        item.status === "published" &&
        item.categoryId === product.categoryId,
    )
    .slice(0, limit);
}

export function needsBottleExchange(product: Product) {
  return product.categoryId === "water" && product.volumeLiters === 19;
}

export function productTotal(product: Product, quantity: number) {
  return (Math.round(product.price * 100) * quantity) / 100;
}
