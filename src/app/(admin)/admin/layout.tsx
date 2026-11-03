import type { ReactNode } from "react";
import type { Metadata } from "next";
import { AdminShell } from "@/features/admin/admin-shell";
export const metadata: Metadata = { title: "Управление магазином" };
export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
