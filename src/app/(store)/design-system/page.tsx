import type { Metadata } from "next";
import { DesignSystem } from "@/features/design-system/showcase";
export const metadata: Metadata = { title: "Дизайн-система" };
export default function DesignSystemPage() { return <DesignSystem />; }
