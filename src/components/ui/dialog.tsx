"use client";
import type { ComponentProps } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;
export function DialogContent({
  children,
  className,
  presentation = "dialog",
  ...props
}: ComponentProps<typeof DialogPrimitive.Content> & { presentation?: "dialog" | "sheet" }) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay
        data-slot="dialog-overlay"
        className="fixed inset-0 z-40 bg-foreground/30"
      />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        data-presentation={presentation}
        className={cn(
          "fixed z-50 grid gap-4 overflow-y-auto overscroll-contain border bg-white p-5 shadow-lg sm:p-6",
          presentation === "sheet"
            ? "inset-y-0 right-0 h-dvh max-h-dvh w-full max-w-sm content-start rounded-l-2xl pb-[max(24px,env(safe-area-inset-bottom))]"
            : "left-1/2 top-1/2 max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl",
          className,
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close
          aria-label="Закрыть окно"
          className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-xl hover:bg-surface"
        >
          <X size={20} />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
