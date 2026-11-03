import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/shared/container";
import { EmptyState } from "@/components/shared/empty-state";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1}>
      <Container className="max-w-2xl py-16">
        <EmptyState
          headingLevel="h1"
          title="Страница не найдена"
          description="Возможно, адрес изменился. Откройте каталог или вернитесь на главную страницу."
          action={
            <div className="flex flex-wrap justify-center gap-3">
              <Button asChild>
                <Link href="/catalog">Открыть каталог</Link>
              </Button>
              <Button variant="secondary" asChild>
                <Link href="/">На главную</Link>
              </Button>
            </div>
          }
        />
      </Container>
    </main>
  );
}
