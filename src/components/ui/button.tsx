import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";
export const buttonVariants = cva(
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-[background-color,border-color,box-shadow] active:shadow-inner disabled:pointer-events-none disabled:opacity-45 [&>svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover",
        secondary: "border border-border bg-white text-foreground hover:bg-surface",
        ghost: "text-primary hover:bg-surface",
      },
    },
    defaultVariants: { variant: "default" },
  },
);
export function Button({
  className,
  variant,
  asChild = false,
  type = "button",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      data-slot="button"
      type={asChild ? undefined : type}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    />
  );
}
