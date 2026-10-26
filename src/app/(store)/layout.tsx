import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <div data-layout="store" className="flex min-h-dvh flex-col"><StoreHeader /><div className="flex-1">{children}</div><StoreFooter /></div>;
}
