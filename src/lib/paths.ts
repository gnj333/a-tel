const staticExport = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

export function withBasePath(path: string) {
  return path.startsWith("/") && !path.startsWith("//")
    ? `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`
    : path;
}

// Browser-created records cannot have HTML generated at build time.
// Static hosting serves one detail page with the record key in its query string.
export function productHref(slug: string) {
  return staticExport ? `/catalog/view/?slug=${encodeURIComponent(slug)}` : `/catalog/${slug}`;
}

export function adminProductHref(id: string) {
  return staticExport
    ? `/admin/products/view/?id=${encodeURIComponent(id)}`
    : `/admin/products/${id}`;
}

export function adminOrderHref(id: string) {
  return staticExport ? `/admin/orders/view/?id=${encodeURIComponent(id)}` : `/admin/orders/${id}`;
}
