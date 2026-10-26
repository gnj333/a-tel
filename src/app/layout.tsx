import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";
const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter", display: "swap" });
export const metadata: Metadata = { title: { default: "Акватель · Вода с доставкой в Тюмени", template: "%s · Акватель" }, description: "Демонстрационный прототип магазина «Акватель»: природная вода для дома и офиса, оборудование и сохранённые наборы.", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ru"><body className={`${inter.variable} antialiased`}><a className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-4" href="#main">К содержимому</a>{children}<Toaster /></body></html>; }
