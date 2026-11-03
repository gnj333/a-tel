"use client";
import { Toaster as Sonner } from "sonner";
export { toast } from "sonner";
export function Toaster() {
  return (
    <Sonner
      position="bottom-right"
      closeButton
      containerAriaLabel="Уведомления"
      toastOptions={{
        closeButtonAriaLabel: "Закрыть уведомление",
        style: { fontFamily: "var(--font-sans)", borderRadius: "16px" },
      }}
    />
  );
}
