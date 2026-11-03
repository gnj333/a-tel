import { formatPrice } from "@/lib/commerce";
import { cn } from "@/lib/utils";
export function Price({ amount, className }: { amount: number; className?: string }) {
  return (
    <span className={cn("whitespace-nowrap text-2xl font-semibold tabular-nums", className)}>
      {formatPrice(amount)}
    </span>
  );
}
