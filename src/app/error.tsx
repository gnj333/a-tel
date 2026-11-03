"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="max-w-2xl py-16">
        <EmptyState
          headingLevel="h1"
          title="Не удалось открыть страницу"
          description="Не удалось загрузить страницу. Попробуйте ещё раз или вернитесь позже."
          action={<Button onClick={retry}>Попробовать ещё раз</Button>}
        />
      </Container>
    </main>
  );
}
