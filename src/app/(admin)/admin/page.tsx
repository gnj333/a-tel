import Link from "next/link";
import { Container } from "@/components/shared/container";
import { Badge } from "@/components/ui/badge";
export default function AdminFoundation() { return <main id="main"><Container className="py-16"><Badge>Демонстрационная среда</Badge><h1 className="mt-6 text-3xl font-semibold">Основа административной панели</h1><p className="my-4 max-w-xl text-muted-foreground">Отдельный layout подготовлен. Управление товарами и заказами будет реализовано на этапе 8.</p><Link className="text-primary underline" href="/design-system">К дизайн-системе</Link></Container></main>; }
