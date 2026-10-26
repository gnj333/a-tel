import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input data-slot="input" className={cn("h-12 w-full rounded-xl border border-input bg-background px-4 text-base placeholder:text-muted-foreground aria-invalid:border-destructive disabled:opacity-50", className)} {...props} />;
}
