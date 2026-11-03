"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Container } from "@/components/shared/container";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCatalogData } from "@/features/catalog/use-catalog-data";
import { CartEmpty, CartLoading } from "@/features/cart/cart-states";
import { resolveCart } from "@/features/cart/cart-data";
import { OrderSummary } from "@/features/cart/order-summary";
import { checkoutSchema, deliveryToday, formatPhone, type CheckoutValues } from "./checkout-schema";
import { checkoutDefaultValues, loadCheckoutForm, saveCheckoutForm } from "./checkout-form-storage";
import { submitDemoOrder } from "./submit-demo-order";
import { OrderSuccess } from "./order-success";

function Field({
  id,
  label,
  error,
  hint,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`min-w-0 ${className}`}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}

export function CheckoutPage() {
  const { ready, products, items } = useCatalogData();
  const cart = resolveCart(items, products);
  const [success, setSuccess] = useState<Awaited<ReturnType<typeof submitDemoOrder>> | null>(null);
  const submitting = useRef(false);
  const {
    register,
    control,
    handleSubmit,
    reset,
    subscribe,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onTouched",
    defaultValues: checkoutDefaultValues,
  });

  useEffect(() => {
    reset(loadCheckoutForm());
    return subscribe({
      formState: { values: true },
      callback: ({ values }) => saveCheckoutForm(values),
    });
  }, [reset, subscribe]);

  async function submit(values: CheckoutValues) {
    if (submitting.current) return;
    submitting.current = true;
    try {
      const result = await submitDemoOrder(values);
      setSuccess(result);
      window.scrollTo({ top: 0, behavior: "instant" });
    } catch {
      setError("root", {
        message: "Не удалось оформить заказ. Проверьте состав корзины и попробуйте ещё раз.",
      });
    } finally {
      submitting.current = false;
    }
  }

  function fieldProps(name: keyof CheckoutValues) {
    return {
      id: name,
      "aria-required": ["name", "phone", "street", "building", "deliveryDate"].includes(name),
      "aria-invalid": Boolean(errors[name]),
      "aria-describedby": errors[name] ? `${name}-error` : undefined,
    };
  }

  return (
    <main id="main" tabIndex={-1}>
      <Container className="py-8 sm:py-12">
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Корзина", href: "/cart" },
            { label: success ? "Заказ оформлен" : "Оформление" },
          ]}
        />
        {success ? (
          <OrderSuccess {...success} />
        ) : (
          <>
            <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-primary">02 / Оформление</p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Куда доставить заказ?
                </h1>
                <p className="mt-3 text-sm text-muted-foreground">
                  Укажите получателя, адрес и удобную дату доставки. Регистрация не нужна.
                </p>
              </div>
              <Link
                href="/cart"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary"
              >
                <ArrowLeft size={17} aria-hidden="true" />
                Вернуться в корзину
              </Link>
            </div>
            {!ready ? (
              <CartLoading />
            ) : !items.length ? (
              <CartEmpty />
            ) : !cart.canCheckout ? (
              <div role="alert" className="mt-8 rounded-2xl border p-6">
                <h2 className="text-xl font-semibold">В корзине есть недоступные позиции</h2>
                <p className="mt-2 text-muted-foreground">
                  Проверьте состав и удалите недоступные товары перед оформлением.
                </p>
                <Button asChild className="mt-5">
                  <Link href="/cart">Проверить корзину</Link>
                </Button>
              </div>
            ) : (
              <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-8">
                <form
                  id="checkout-form"
                  noValidate
                  autoComplete="off"
                  onSubmit={(event) => {
                    void handleSubmit(submit)(event);
                  }}
                  className="min-w-0"
                >
                  <fieldset
                    disabled={isSubmitting}
                    className="min-w-0 rounded-2xl border p-5 sm:p-6"
                  >
                    <legend className="px-2 text-lg font-semibold">Получатель</legend>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field id="name" label="Имя *" error={errors.name?.message}>
                        <Input
                          {...register("name")}
                          {...fieldProps("name")}
                          maxLength={80}
                          placeholder="Например, Алексей"
                          autoComplete="off"
                        />
                      </Field>
                      <Field id="phone" label="Телефон *" error={errors.phone?.message}>
                        <Controller
                          control={control}
                          name="phone"
                          render={({ field }) => (
                            <Input
                              {...field}
                              {...fieldProps("phone")}
                              type="tel"
                              inputMode="tel"
                              placeholder="+7 (___) ___-__-__"
                              autoComplete="off"
                              onChange={(event) => field.onChange(formatPhone(event.target.value))}
                            />
                          )}
                        />
                      </Field>
                    </div>
                  </fieldset>
                  <fieldset
                    disabled={isSubmitting}
                    className="mt-6 min-w-0 rounded-2xl border p-5 sm:p-6"
                  >
                    <legend className="px-2 text-lg font-semibold">Адрес доставки</legend>
                    <p className="mb-5 flex items-center gap-2 text-sm">
                      <MapPin size={17} className="text-primary" aria-hidden="true" />
                      Тюмень
                    </p>
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field
                        id="street"
                        label="Улица *"
                        error={errors.street?.message}
                        className="sm:col-span-2"
                      >
                        <Input
                          {...register("street")}
                          {...fieldProps("street")}
                          maxLength={120}
                          placeholder="Название улицы"
                        />
                      </Field>
                      <Field id="building" label="Дом, корпус *" error={errors.building?.message}>
                        <Input
                          {...register("building")}
                          {...fieldProps("building")}
                          maxLength={20}
                          placeholder="Например, 12/1"
                        />
                      </Field>
                      <Field
                        id="apartment"
                        label="Квартира или офис"
                        error={errors.apartment?.message}
                      >
                        <Input
                          {...register("apartment")}
                          {...fieldProps("apartment")}
                          maxLength={20}
                          placeholder="Необязательно"
                        />
                      </Field>
                      <Field
                        id="comment"
                        label="Комментарий к доставке"
                        error={errors.comment?.message}
                        className="sm:col-span-2"
                      >
                        <textarea
                          {...register("comment")}
                          {...fieldProps("comment")}
                          maxLength={500}
                          rows={3}
                          placeholder="Например, как найти подъезд"
                          className="w-full resize-y rounded-xl border border-input bg-white px-4 py-3 text-base placeholder:text-muted-foreground aria-invalid:border-destructive"
                        />
                      </Field>
                    </div>
                  </fieldset>
                  <fieldset
                    disabled={isSubmitting}
                    className="mt-6 min-w-0 rounded-2xl border p-5 sm:p-6"
                  >
                    <legend className="px-2 text-lg font-semibold">Когда вам удобно?</legend>
                    <Field
                      id="deliveryDate"
                      label="Желаемая дата доставки *"
                      error={errors.deliveryDate?.message}
                      hint="Дата — ваше пожелание, доступность доставки не подтверждается."
                    >
                      <Input
                        {...register("deliveryDate")}
                        {...fieldProps("deliveryDate")}
                        aria-describedby={`deliveryDate-hint${errors.deliveryDate ? " deliveryDate-error" : ""}`}
                        type="date"
                        min={deliveryToday()}
                        className="min-w-0 max-w-full"
                      />
                    </Field>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Дату и удобный интервал доставки согласуем при подтверждении заказа.
                    </p>
                  </fieldset>
                  <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-xl border p-4 text-sm">
                    <input
                      {...register("saveBasket")}
                      type="checkbox"
                      disabled={isSubmitting}
                      className="mt-1 size-5 shrink-0 accent-primary"
                    />
                    <span>
                      <span className="block font-medium">
                        Сохранить состав для повторной покупки
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">
                        Сохранённый набор можно добавить в корзину на главной странице.
                      </span>
                    </span>
                  </label>
                  <p className="mt-4 text-xs text-muted-foreground">* Обязательные поля.</p>
                </form>
                <OrderSummary cart={cart} showItems>
                  {errors.root && (
                    <p role="alert" className="mb-4 text-sm text-destructive">
                      {errors.root.message}
                    </p>
                  )}
                  <Button
                    type="submit"
                    form="checkout-form"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "Сохраняем…" : "Оформить заказ"}
                    <ArrowRight size={17} aria-hidden="true" />
                  </Button>
                  <p className="mt-3 text-center text-xs text-muted-foreground">
                    Проверьте контактные данные и адрес доставки перед оформлением.
                  </p>
                </OrderSummary>
              </div>
            )}
          </>
        )}
      </Container>
    </main>
  );
}
