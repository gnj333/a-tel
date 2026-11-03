"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

// Keep the button's size and accessible name stable during repeat additions.
export function CartAddButton({
  onAdd,
  label = "В корзину",
  feedbackLabel = "Добавлено",
  accessibleLabel,
  className,
  disabled,
}: {
  onAdd: () => number | void;
  label?: string;
  feedbackLabel?: string;
  accessibleLabel: string;
  className?: string;
  disabled?: boolean;
}) {
  const [feedback, setFeedback] = useState(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);

  return (
    <Button
      className={className}
      disabled={disabled}
      aria-label={accessibleLabel}
      onClick={() => {
        const added = onAdd();
        if (added === 0) return;
        clearTimeout(timeout.current);
        setFeedback((previous) => previous + 1);
        timeout.current = setTimeout(() => setFeedback(0), 1600);
      }}
    >
      <span
        key={feedback}
        className={feedback ? "cart-feedback inline-flex" : "inline-flex"}
        aria-hidden="true"
      >
        {feedback ? <Check size={18} /> : <ShoppingBag size={18} />}
      </span>
      <span className="grid">
        <span
          className={feedback ? "invisible col-start-1 row-start-1" : "col-start-1 row-start-1"}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          className={`${feedback ? "visible" : "invisible"} col-start-1 row-start-1`}
        >
          {feedbackLabel}
        </span>
      </span>
    </Button>
  );
}
