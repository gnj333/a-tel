import Link from "next/link";
import { cn } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return <Link href="/" aria-label="Акватель — главная" className={cn("inline-flex shrink-0 flex-col py-1", className)}>
    <span className="text-[28px] font-bold leading-none tracking-[-1.5px] text-primary">акватель<span className="text-accent">.</span></span>
    <span className="mt-1.5 text-[10px] font-medium tracking-[0.13em] text-muted-foreground">ВОДА ДЛЯ ВАШЕГО ДНЯ</span>
  </Link>;
}
