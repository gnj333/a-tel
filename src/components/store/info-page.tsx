import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";

export function InfoPage({ title, children }: { title: string; children: React.ReactNode }) {
  return <main id="main"><Container className="py-10 sm:py-16"><Breadcrumbs items={[{ label: "Главная", href: "/" }, { label: title }]} /><div className="mt-8 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-widest text-primary">Акватель · Демонстрационная версия</p><h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1><div className="mt-6 space-y-4 text-muted-foreground">{children}</div><Button variant="secondary" asChild className="mt-8"><Link href="/">На главную</Link></Button></div></Container></main>;
}
