import type { ReactNode } from "react";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <div data-layout="store" className="flex min-h-dvh flex-col">
      <StoreHeader />
      <div className="store-content min-w-0 flex-1">{children}</div>
      <StoreFooter />
    </div>
  );
}
