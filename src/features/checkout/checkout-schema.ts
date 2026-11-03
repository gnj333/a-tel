import { z } from "zod";

export function deliveryToday(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en", {
    timeZone: "Asia/Yekaterinburg",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((entry) => entry.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function phoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && digits.startsWith("8") ? `7${digits.slice(1)}` : digits;
}

export function formatPhone(value: string) {
  let digits = value.replace(/\D/g, "");
  if (!digits) return "";
  if (digits[0] === "8" || digits[0] === "7") digits = digits.slice(1);
  const national = digits.slice(0, 10);
  let result = "+7";
  if (national.length) result += ` (${national.slice(0, 3)}`;
  if (national.length > 3) result += ")";
  if (national.length > 3) result += ` ${national.slice(3, 6)}`;
  if (national.length > 6) result += `-${national.slice(6, 8)}`;
  if (national.length > 8) result += `-${national.slice(8, 10)}`;
  return result;
}

function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, "Укажите имя: минимум 2 символа").max(80, "Не более 80 символов"),
  phone: z
    .string()
    .refine(
      (value) => /^7\d{10}$/.test(phoneDigits(value)),
      "Введите телефон полностью: +7 и 10 цифр",
    ),
  street: z.string().trim().min(2, "Укажите улицу").max(120, "Не более 120 символов"),
  building: z.string().trim().min(1, "Укажите номер дома").max(20, "Не более 20 символов"),
  apartment: z.string().trim().max(20, "Не более 20 символов"),
  comment: z.string().trim().max(500, "Комментарий — не более 500 символов"),
  deliveryDate: z
    .string()
    .refine(validDate, "Выберите корректную дату доставки")
    .refine((value) => value >= deliveryToday(), "Дата не может быть в прошлом"),
  saveBasket: z.boolean(),
});

export type CheckoutValues = z.infer<typeof checkoutSchema>;
