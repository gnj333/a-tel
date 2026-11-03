import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
export const metadata: Metadata = {
  title: { default: "Акватель · Вода с доставкой в Тюмени", template: "%s · Акватель" },
  description:
    "Магазин «Акватель»: природная вода с доставкой по Тюмени для дома и офиса, кулеры, помпы и аксессуары.",
  robots: { index: false, follow: false },
};
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body className={`${inter.variable} antialiased`}>
        <a className="skip-link" href="#main">
          К содержимому
        </a>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
