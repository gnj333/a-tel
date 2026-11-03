import { PackageOpen } from "lucide-react";
import type { ReactNode } from "react";
export function EmptyState({
  title,
  description,
  action,
  headingLevel: Heading = "h2",
}: {
  title: string;
  description: string;
  action?: ReactNode;
  headingLevel?: "h1" | "h2" | "h3";
}) {
  return (
    <div className="state-enter flex flex-col items-center rounded-2xl border border-dashed p-8 text-center">
      <PackageOpen aria-hidden="true" className="mb-4 text-muted-foreground" size={32} />
      <Heading className="text-xl font-semibold">{title}</Heading>
      <p className="mb-6 mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>
      {action}
    </div>
  );
}
