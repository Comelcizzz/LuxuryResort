import { fetchAvailability } from "@/api/endpoints/rooms.api";
import { createBooking, payBooking } from "@/api/endpoints/bookings.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PricingBreakdownPanel } from "@/components/bookings/PricingBreakdownPanel";
import { DemoPaymentModal } from "@/components/common/DemoPaymentModal";
import { wizardDatesSchema, wizardDetailsSchema, wizardPaymentSchema } from "@/lib/validators";
import type { BookingResponse } from "@/types/api";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const steps = ["Дати", "Деталі", "Оплата", "Готово"] as const;

const stepContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

const stepItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 420, damping: 30 },
  },
} as const;

export function BookingWizard({ roomId }: { roomId: string }) {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [specialRequests, setSpecialRequests] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "APPLE_PAY" | "GOOGLE_PAY" | "BANK_TRANSFER">("CARD");
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function nextFromDates() {
    setError(null);
    const parsed = wizardDatesSchema.safeParse({ checkIn, checkOut });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Невірні дати");
      return;
    }
    setLoading(true);
    try {
      const av = await fetchAvailability(roomId, checkIn, checkOut);
      if (!av.available) {
        setError("Номер недоступний на обрані дати");
        setLoading(false);
        return;
      }
      setStep(1);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Помилка доступності");
    } finally {
      setLoading(false);
    }
  }

  async function nextFromDetails() {
    setError(null);
    const parsed = wizardDetailsSchema.safeParse({ guests, specialRequests });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Перевірте дані");
      return;
    }
    setLoading(true);
    try {
      const b = await createBooking({
        roomId,
        checkIn,
        checkOut,
        guests: parsed.data.guests,
        loyaltyPointsToUse: 0,
        specialRequests: parsed.data.specialRequests || null,
      });
      setBooking(b);
      setStep(2);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не вдалося створити бронювання");
    } finally {
      setLoading(false);
    }
  }

  async function pay() {
    if (!booking) return;
    await payBooking(booking.id, paymentMethod);
    setPayModalOpen(false);
    setStep(3);
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      {reduceMotion ? (
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
      )}

      {error && <p className="rounded-md bg-error/10 p-3 text-sm text-error">{error}</p>}

      {step === 0 && (
        <div className="space-y-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
          <div>
            <Label htmlFor="ci">Заїзд</Label>
            <Input id="ci" type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="co">Виїзд</Label>
            <Input id="co" type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
          </div>
          <Button data-testid="wizard-dates-next" onClick={() => void nextFromDates()} disabled={loading}>
            {loading ? "…" : "Далі"}
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
          <div>
            <Label>Гості</Label>
            <Input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(Number(e.target.value))} />
          </div>
          <div>
            <Label>Особливі побажання</Label>
            <Input value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setStep(0)}>
              Назад
            </Button>
            <Button data-testid="wizard-create-booking" onClick={() => void nextFromDetails()} disabled={loading}>
              {loading ? "…" : "Створити бронювання"}
            </Button>
          </div>
        </div>
      )}

      {step === 2 && booking && (
        <div className="space-y-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
          <PricingBreakdownPanel pricing={booking.pricing} />

          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-custom">Спосіб оплати</p>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { value: "CARD", title: "Картка", hint: "Visa / Mastercard (демо)" },
                  { value: "APPLE_PAY", title: "Apple Pay", hint: "Швидка оплата" },
                  { value: "GOOGLE_PAY", title: "Google Pay", hint: "Android / Google Wallet" },
                  { value: "BANK_TRANSFER", title: "Переказ", hint: "Реквізити після підтвердження" },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer flex-col rounded-lg border p-3 text-left transition-colors ${
                    paymentMethod === opt.value
                      ? "border-gold bg-gold/10 ring-1 ring-gold"
                      : "border-navy/10 hover:border-gold/50"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <input
                      type="radio"
                      name="pay-method"
                      className="mt-0.5"
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                    />
                    <span>
                      <span className="block text-sm font-medium text-navy">{opt.title}</span>
                      <span className="block text-xs text-slate-custom">{opt.hint}</span>
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" type="button" onClick={() => setStep(1)}>
              Назад
            </Button>
            <Button
              data-testid="wizard-pay"
              variant="gold"
              className="flex-1"
              onClick={() => setPayModalOpen(true)}
              disabled={loading}
            >
              Перейти до оплати
            </Button>
          </div>

          <DemoPaymentModal
            open={payModalOpen}
            onClose={() => setPayModalOpen(false)}
            paymentMethod={paymentMethod}
            amount={Number(booking.pricing.totalPrice)}
            onConfirm={pay}
          />
        </div>
      )}

      {step === 3 && (
        <div className="rounded-xl border border-success/30 bg-success/5 p-6 text-center shadow-sm">
          <p className="font-display text-2xl text-success">Бронювання підтверджено</p>
          <p className="mt-2 text-sm text-slate-custom">Дякуємо за вибір Luxury Resort.</p>
          <p className="mx-auto mt-3 max-w-md text-xs leading-relaxed text-slate-custom">
            Квитанцію у форматі PDF (оформлена як чек) можна завантажити в «Мої бронювання» — кнопка поруч із
            бронюванням.
          </p>
          <Button className="mt-6" variant="gold" type="button" onClick={() => void navigate("/guest/bookings")}>
            Мої бронювання
          </Button>
        </div>
      )}
    </div>
  );
}
