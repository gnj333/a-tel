"use client";
import { Minus, Plus } from "lucide-react";
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Количество",
}: {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-12 shrink-0 items-center rounded-xl border bg-white"
    >
      <button
        type="button"
        className="flex size-11 items-center justify-center rounded-xl transition-colors hover:bg-surface disabled:opacity-30"
        aria-label="Уменьшить количество"
        disabled={value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus size={16} />
      </button>
      <span
        aria-live="polite"
        aria-atomic="true"
        className="min-w-6 text-center text-sm tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        className="flex size-11 items-center justify-center rounded-xl transition-colors hover:bg-surface disabled:opacity-30"
        aria-label="Увеличить количество"
        disabled={value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus size={16} />
      </button>
    </div>
  );
}
