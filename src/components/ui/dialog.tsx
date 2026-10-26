"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogTitle = DialogPrimitive.Title;
export const DialogDescription = DialogPrimitive.Description;
export const DialogClose = DialogPrimitive.Close;
export function DialogContent({ children, className, ...props }: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return <DialogPrimitive.Portal><DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-foreground/30" />
    <DialogPrimitive.Content className={cn("fixed left-1/2 top-1/2 z-50 grid max-h-[90dvh] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto rounded-2xl border bg-white p-6 shadow-lg", className)} {...props}>
      {children}<DialogPrimitive.Close aria-label="Закрыть окно" className="absolute right-3 top-3 flex size-11 items-center justify-center rounded-xl hover:bg-surface"><X size={20} /></DialogPrimitive.Close>
    </DialogPrimitive.Content></DialogPrimitive.Portal>;
}
