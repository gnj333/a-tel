"use client";

import { useSearchParams } from "next/navigation";
import { OrderDetail } from "./order-detail";
import { ProductEditor } from "./product-form";
import { MissingRecord } from "./admin-ui";

export function RecordQueryPage({ kind }: { kind: "order" | "product" }) {
  const id = useSearchParams().get("id");
  if (!id) return <MissingRecord kind={kind} />;
  return kind === "order" ? <OrderDetail id={id} /> : <ProductEditor id={id} />;
}
