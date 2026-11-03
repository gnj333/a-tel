import { Skeleton } from "@/components/ui/skeleton";

// Reserve the photo and buying controls before the persisted assortment is ready.
export function ProductCardSkeleton() {
  return (
    <div aria-hidden="true" className="overflow-hidden rounded-2xl border">
      <Skeleton className="h-64 rounded-none" />
      <div className="p-6">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="mt-4 h-7 w-3/4" />
        <Skeleton className="mb-5 mt-2 h-12" />
        <Skeleton className="h-8 w-32" />
        <div className="mt-4 flex flex-wrap gap-3">
          <Skeleton className="h-12 w-[116px]" />
          <Skeleton className="h-12 min-w-32 flex-1" />
        </div>
        <Skeleton className="mt-3 h-8 w-full" />
      </div>
    </div>
  );
}
