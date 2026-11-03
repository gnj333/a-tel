import { Suspense } from "react";
import { RecordQueryPage } from "@/features/admin/record-query-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <RecordQueryPage kind="order" />
    </Suspense>
  );
}
