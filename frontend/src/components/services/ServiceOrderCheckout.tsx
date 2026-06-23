import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DemoPaymentModal } from "@/components/common/DemoPaymentModal";
import { formatCurrency } from "@/lib/formatters";
import type { ServiceResponse } from "@/types/api";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export type ServiceOrderPayload = {
  appointmentDatetime: string;
  quantity: number;
  specialRequests: string | null;
};

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toLocalDatetimeValue(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function defaultAppointment(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(11, 0, 0, 0);
  return toLocalDatetimeValue(d);
}

function minLocalDatetimeValue(): string {
  return toLocalDatetimeValue(new Date());
}

function serviceUnitLabel(durationMinutes: number | null): string {
  if (!durationMinutes) return "за 1 послугу";
  return `за сеанс (${durationMinutes} хв)`;
}

function formatAppointmentHuman(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("uk-UA", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const steps = ["Дата й час", "Кількість і коментар", "Підсумок"] as const;

const PAYMENT_OPTIONS = [
  { value: "CARD", title: "Картка", hint: "Visa / Mastercard (демо)" },
  { value: "APPLE_PAY", title: "Apple Pay", hint: "Швидка оплата з пристрою" },
  { value: "GOOGLE_PAY", title: "Google Pay", hint: "Для Android / Google Wallet" },
  { value: "BANK_TRANSFER", title: "Переказ", hint: "Реквізити після підтвердження" },
] as const;

type PaymentPref = (typeof PAYMENT_OPTIONS)[number]["value"];

const stepContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.03 },
  },
};

const stepItem = {
  hidden: { opacity: 0, y: 6 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 32 },
  },
} as const;

type Props = {
  service: ServiceResponse;
  isPending: boolean;
  onConfirm: (payload: ServiceOrderPayload) => Promise<void>;
};

export function ServiceOrderCheckout({ service, isPending, onConfirm }: Props) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [when, setWhen] = useState(defaultAppointment);
  const [qty, setQty] = useState(1);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentPref, setPaymentPref] = useState<PaymentPref>("CARD");
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [pendingPayload, setPendingPayload] = useState<ServiceOrderPayload | null>(null);

  const unitPrice = Number(service.price);
  const lineTotal = useMemo(() => unitPrice * qty, [unitPrice, qty]);

  const heroImage = service.images?.[0];

  function validateWhen(): string | null {
    if (!when) return "Оберіть дату й час візиту.";
    const t = new Date(when).getTime();
    if (Number.isNaN(t)) return "Некоректна дата.";
    if (t <= Date.now()) return "Оберіть час у майбутньому (після поточної хвилини).";
    return null;
  }

  function openPayModal() {
    setError(null);
    const wErr = validateWhen();
    if (wErr) { setError(wErr); setStep(0); return; }
    if (qty < 1 || qty > 99) { setError("Кількість має бути від 1 до 99."); setStep(1); return; }
    const trimmed = specialRequests.trim();
    const payLine = `Бажана оплата: ${paymentPref}.`;
    const combined = trimmed.length > 0 ? `${payLine}\n\n${trimmed}` : payLine;
    setPendingPayload({
      appointmentDatetime: new Date(when).toISOString(),
      quantity: qty,
      specialRequests: combined,
    });
    setPayModalOpen(true);
  }

  async function handleConfirm() {
    if (!pendingPayload) return;
    await onConfirm(pendingPayload);
    setPayModalOpen(false);
    setDone(true);
  }

  if (!service.available) {
    return (
      <Card className="mt-8 max-w-2xl border-navy/15 bg-navy/5">
        <CardHeader>
          <CardTitle>Послуга тимчасово недоступна</CardTitle>
          <CardDescription>
            Оформлення замовлення вимкнено. Оберіть іншу послугу або зверніться до адміністрації курорту.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" type="button" asChild>
            <Link to="/services">До каталогу послуг</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (done) {
    return (
      <Card className="mt-8 max-w-2xl border-success/30 bg-success/5">
        <CardHeader>
          <CardTitle className="text-success">Замовлення прийнято</CardTitle>
          <CardDescription>
            Послуга «{service.name}» додана в чергу. У демо-режимі оплата не списується автоматично — персонал підтвердить
            час і спосіб розрахунку.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button variant="gold" type="button" asChild>
            <Link to="/guest/orders">Мої послуги</Link>
          </Button>
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/services")}
          >
            Замовити ще раз
          </Button>
        </CardContent>
      </Card>
    );
  }

  const Stepper = reduceMotion ? (
    <div className="flex gap-2">
      {steps.map((label, i) => (
        <div
          key={label}
          className={`flex-1 rounded-md px-2 py-2 text-center text-xs font-medium ${
            i === step ? "bg-gold text-navy" : i < step ? "bg-success/20 text-success" : "bg-navy/5 text-slate-custom"
          }`}
        >
          {i + 1}. {label}
        </div>
      ))}
    </div>
  ) : (
    <motion.div className="flex gap-2" variants={stepContainer} initial="hidden" animate="show">
      {steps.map((label, i) => (
        <motion.div
          key={label}
          variants={stepItem}
          className={`flex-1 rounded-md px-2 py-2 text-center text-xs font-medium ${
            i === step ? "bg-gold text-navy" : i < step ? "bg-success/20 text-success" : "bg-navy/5 text-slate-custom"
          }`}
        >
          {i + 1}. {label}
        </motion.div>
      ))}
    </motion.div>
  );

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:items-start">
      <div className="space-y-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-navy">Оформлення замовлення</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-custom">
            Оберіть зручний час, кількість сеансів і спосіб оплати. Підказки на кожному кроці допоможуть без зайвих
            питань до ресепшену.
          </p>
        </div>

        <ul className="space-y-2 rounded-lg border border-navy/10 bg-navy/[0.03] p-4 text-sm text-slate-custom">
          <li>
            <span className="font-medium text-navy">Що відбувається після відправки:</span> замовлення з&apos;являється у
            вашому кабінеті та в черзі персоналу курорту.
          </li>
          <li>
            <span className="font-medium text-navy">Оплата в демо:</span> кошти не списуються онлайн — це навчальний
            проєкт. Обраний спосіб оплати передається як побажання в замовленні.
          </li>
          <li>
            <span className="font-medium text-navy">Максимум гостей на сеанс:</span> {service.maxParticipants} — не
            перевищуйте при груповому бронюванні (кількість сеансів × учасників узгодьте в коментарі).
          </li>
        </ul>

        {heroImage && (
          <div className="overflow-hidden rounded-xl border border-navy/10 shadow-sm">
            <img src={heroImage} alt="" className="h-48 w-full object-cover" loading="lazy" />
          </div>
        )}
      </div>

      <Card className="border-navy/15 shadow-md">
        <CardHeader className="space-y-4">
          <div>
            <CardTitle>Кошик послуги</CardTitle>
            <CardDescription>
              {service.name} · {formatCurrency(unitPrice)} / {serviceUnitLabel(service.durationMinutes)}
            </CardDescription>
          </div>
          {Stepper}
        </CardHeader>
        <CardContent className="space-y-5">
          {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="svc-when">Дата й час візиту</Label>
                <Input
                  id="svc-when"
                  type="datetime-local"
                  min={minLocalDatetimeValue()}
                  value={when}
                  onChange={(e) => setWhen(e.target.value)}
                  className="mt-1"
                />
                <p className="mt-2 text-xs text-slate-custom">
                  Оберіть момент початку послуги. Мінімальний час — найближча доступна хвилина за вашим локальним часом.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const d = new Date();
                    d.setMinutes(d.getMinutes() + 35);
                    setWhen(toLocalDatetimeValue(d));
                  }}
                >
                  Через ~35 хв
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 1);
                    d.setHours(18, 0, 0, 0);
                    setWhen(toLocalDatetimeValue(d));
                  }}
                >
                  Завтра 18:00
                </Button>
              </div>
              <Button
                type="button"
                variant="gold"
                className="w-full"
                onClick={() => {
                  const e = validateWhen();
                  if (e) {
                    setError(e);
                    return;
                  }
                  setError(null);
                  setStep(1);
                }}
              >
                Далі
              </Button>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <Label>Кількість</Label>
                <div className="mt-2 flex items-center gap-3">
                  <Button type="button" variant="outline" size="icon" aria-label="Менше" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                    −
                  </Button>
                  <span className="min-w-[2.5rem] text-center text-lg font-semibold tabular-nums">{qty}</span>
                  <Button type="button" variant="outline" size="icon" aria-label="Більше" onClick={() => setQty((q) => Math.min(99, q + 1))}>
                    +
                  </Button>
                </div>
                <p className="mt-2 text-xs text-slate-custom">
                  Підсумок оновлюється автоматично:{" "}
                  <span className="font-medium text-navy">{formatCurrency(lineTotal)}</span> за {qty}{" "}
                  {qty === 1 ? "одиницю" : "одиниць"}.
                </p>
              </div>
              <div>
                <Label htmlFor="svc-note">Особливі побажання (необов&apos;язково)</Label>
                <Textarea
                  id="svc-note"
                  className="mt-1"
                  placeholder="Напр.: алергії, мовний супровід, подарункова упаковка…"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  maxLength={1900}
                />
                <p className="mt-1 text-xs text-slate-custom">{specialRequests.length}/1900</p>
              </div>

              <details className="rounded-lg border border-navy/10 bg-white p-3 text-sm open:shadow-sm">
                <summary className="cursor-pointer font-medium text-navy">Як працює «оплата» в демо</summary>
                <p className="mt-2 text-slate-custom">
                  Реального еквайрингу немає. Ваш вибір способу оплати зберігається в замовленні як побажання — зручно для
                  сценарію захисту диплому та для персоналу, який бачить пріоритет (картка / гаманець / переказ).
                </p>
              </details>

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(0)}>
                  Назад
                </Button>
                <Button type="button" variant="gold" className="flex-1" onClick={() => setStep(2)}>
                  Далі
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="rounded-lg border border-navy/10 bg-navy/[0.02] p-4 text-sm">
                <p className="font-medium text-navy">{service.name}</p>
                <p className="mt-1 text-slate-custom">{formatAppointmentHuman(new Date(when).toISOString())}</p>
                <p className="mt-2 text-slate-custom">
                  Кількість: <span className="font-semibold text-navy">{qty}</span>
                </p>
                <div className="mt-3 flex justify-between border-t border-navy/10 pt-3 text-sm">
                  <span className="text-slate-custom">Разом</span>
                  <span className="text-lg font-bold text-gold">{formatCurrency(lineTotal)}</span>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-custom">Бажаний спосіб оплати</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {PAYMENT_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer flex-col rounded-lg border p-3 text-left transition-colors ${
                        paymentPref === opt.value
                          ? "border-gold bg-gold/10 ring-1 ring-gold"
                          : "border-navy/10 hover:border-gold/50"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <input
                          type="radio"
                          name="pay-pref"
                          className="mt-1"
                          checked={paymentPref === opt.value}
                          onChange={() => setPaymentPref(opt.value)}
                        />
                        <span>
                          <span className="block font-medium text-navy">{opt.title}</span>
                          <span className="block text-xs text-slate-custom">{opt.hint}</span>
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)} disabled={isPending}>
                  Назад
                </Button>
                <Button type="button" variant="gold" className="flex-1" onClick={openPayModal} disabled={isPending}>
                  Перейти до оплати
                </Button>
              </div>

              <DemoPaymentModal
                open={payModalOpen}
                onClose={() => setPayModalOpen(false)}
                paymentMethod={paymentPref}
                amount={lineTotal}
                onConfirm={handleConfirm}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
