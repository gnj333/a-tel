import { PackageOpen } from "lucide-react";
import type { ReactNode } from "react";
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="flex flex-col items-center rounded-2xl border border-dashed p-8 text-center"><PackageOpen aria-hidden="true" className="mb-4 text-muted-foreground" size={32} /><h3 className="text-xl font-semibold">{title}</h3><p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>{action}</div>; }
