import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Введите название от 2 символов")
    .max(120, "Не более 120 символов"),
  slug: z
    .string()
    .trim()
    .min(2, "Введите slug")
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Используйте латиницу, цифры и дефисы"),
  categoryId: z.string().min(1, "Выберите категорию"),
  description: z
    .string()
    .trim()
    .min(10, "Описание от 10 символов")
    .max(5000, "Не более 5000 символов"),
  price: z
    .number()
    .min(0.01, "Цена должна быть больше нуля")
    .max(1000000, "Цена до 1 000 000 ₽")
    .refine(
      (n) => Math.abs(n * 100 - Math.round(n * 100)) < 0.00001,
      "Не более двух знаков после запятой",
    ),
  volumeLiters: z.union([
    z.literal(""),
    z.number().positive("Объём должен быть больше нуля").max(1000),
  ]),
  image: z
    .string()
    .max(1_500_000, "Изображение слишком большое")
    .refine(
      (value) =>
        !value ||
        (/^\/images\/[a-zA-Z0-9_./-]+\.(?:png|jpe?g|webp|avif)$/i.test(value) &&
          !value.includes("..")) ||
        /^data:image\/(?:png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value),
      "Укажите путь /images/… или загрузите PNG, JPEG, WebP",
    ),
  status: z.enum(["published", "draft", "archived"]),
});
export type ProductValues = z.infer<typeof productSchema>;
