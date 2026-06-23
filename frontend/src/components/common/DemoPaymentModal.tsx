import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/formatters";
import { CheckCircle, Loader2 } from "lucide-react";
import { useRef, useState } from "react";

export type DemoPayMethod = "CARD" | "APPLE_PAY" | "GOOGLE_PAY" | "BANK_TRANSFER";

type Stage = "form" | "processing" | "done";

type Props = {
  open: boolean;
  onClose: () => void;
  paymentMethod: DemoPayMethod;
  amount: number;
  onConfirm: () => Promise<void>;
};

function genTxId() {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function nowFormatted() {
  const d = new Date();
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const METHOD_LABELS: Record<DemoPayMethod, string> = {
  CARD: "Картка",
  APPLE_PAY: "Apple Pay",
  GOOGLE_PAY: "Google Pay",
  BANK_TRANSFER: "Банківський переказ",
};

export function DemoPaymentModal({ open, onClose, paymentMethod, amount, onConfirm }: Props) {
  const [stage, setStage] = useState<Stage>("form");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [error, setError] = useState<string | null>(null);
  const txRef = useRef(genTxId());

  async function handlePay() {
    setError(null);
    setStage("processing");
    try {
      await onConfirm();
      txRef.current = genTxId();
      setStage("done");
    } catch (e) {
      setStage("form");
      setError(e instanceof Error ? e.message : "Помилка оплати. Спробуйте ще раз.");
    }
  }

  function handleClose() {
    if (stage === "processing") return;
    setStage("form");
    setCardNumber("");
    setCardName("");
    setCardExpiry("");
    setCardCvv("");
    setError(null);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose(); }}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {stage === "done" ? "Оплата підтверджена" : `Оплата · ${METHOD_LABELS[paymentMethod]}`}
          </DialogTitle>
        </DialogHeader>

        {stage === "processing" && (
          <div className="flex flex-col items-center gap-4 py-8">
            <Loader2 className="h-12 w-12 animate-spin text-gold" />
            <p className="text-base font-medium text-navy">Авторизація платежу…</p>
            <p className="text-sm text-slate-custom">Будь ласка, зачекайте</p>
          </div>
        )}

        {stage === "done" && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <CheckCircle className="h-14 w-14 text-emerald-500" />
            <div>
              <p className="text-lg font-bold text-navy">Оплату успішно проведено</p>
              <p className="mt-1 text-2xl font-bold text-gold">{formatCurrency(amount)}</p>
            </div>
            <div className="w-full rounded-lg border border-navy/10 bg-navy/[0.02] p-4 text-sm text-left space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-custom">Транзакція</span>
                <span className="font-mono font-medium">{txRef.current}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-custom">Метод</span>
                <span className="font-medium">{METHOD_LABELS[paymentMethod]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-custom">Час</span>
                <span className="font-medium">{nowFormatted()}</span>
              </div>
            </div>
            <p className="text-xs text-slate-custom opacity-70">
              Демо-режим: реального списання не відбулося
            </p>
            <Button variant="gold" className="w-full" onClick={handleClose}>
              Готово
            </Button>
          </div>
        )}

        {stage === "form" && (
          <div className="space-y-4">
            {error && (
              <p className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-700">{error}</p>
            )}

            {paymentMethod === "CARD" && (
              <div className="space-y-3">
                <div
                  className="relative h-36 rounded-xl p-5 text-white shadow-lg select-none"
                  style={{ background: "linear-gradient(135deg, #1a2e4a 0%, #2d4a6e 60%, #c9a84c 100%)" }}
                >
                  <p className="text-xs tracking-widest opacity-70">LUXURY RESORT · DEMO CARD</p>
                  <p className="mt-4 font-mono text-lg tracking-[0.2em]">
                    {cardNumber
                      ? cardNumber.padEnd(19, "·").replace(/(.{4})/g, "$1 ").trim()
                      : "•••• •••• •••• ••••"}
                  </p>
                  <div className="mt-3 flex justify-between text-xs">
                    <span className="opacity-70 truncate max-w-[60%]">{cardName || "ІМʼЯ ВЛАСНИКА"}</span>
                    <span className="font-mono">{cardExpiry || "MM/YY"}</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="dm-card-num">Номер картки</Label>
                  <Input
                    id="dm-card-num"
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => {
                      const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
                      setCardNumber(raw.replace(/(.{4})/g, "$1 ").trim());
                    }}
                    className="mt-1 font-mono tracking-widest"
                  />
                </div>
                <div>
                  <Label htmlFor="dm-card-name">Ім'я власника</Label>
                  <Input
                    id="dm-card-name"
                    placeholder="ІВАН ПЕТРЕНКО"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className="mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="dm-exp">Термін дії</Label>
                    <Input
                      id="dm-exp"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "").slice(0, 4);
                        setCardExpiry(raw.length > 2 ? `${raw.slice(0, 2)}/${raw.slice(2)}` : raw);
                      }}
                      className="mt-1 font-mono"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dm-cvv">Код CVV</Label>
                    <Input
                      id="dm-cvv"
                      placeholder="•••"
                      maxLength={3}
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                      className="mt-1 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "APPLE_PAY" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-black text-white text-2xl font-bold shadow-md">

                </div>
                <p className="text-center text-sm text-slate-custom">
                  Підтвердіть оплату за допомогою Touch ID або Face ID на своєму пристрої.
                </p>
                <button
                  onClick={() => void handlePay()}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-black text-white text-sm font-semibold tracking-wide shadow hover:opacity-90 transition"
                >
                  Сплатити {formatCurrency(amount)}
                </button>
                <p className="text-xs text-slate-custom opacity-60">Демо: реального списання не відбудеться</p>
              </div>
            )}

            {paymentMethod === "GOOGLE_PAY" && (
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-navy/10 bg-white shadow-md">
                  <span className="text-xl font-bold">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                  </span>
                </div>
                <p className="text-center text-sm text-slate-custom">
                  Ви будете перенаправлені до Google Pay для підтвердження через Google Wallet.
                </p>
                <button
                  onClick={() => void handlePay()}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-navy/15 bg-white text-sm font-semibold shadow hover:bg-navy/5 transition"
                >
                  <span className="text-navy">Сплатити через</span>
                  <span className="font-bold">
                    <span className="text-blue-500">G</span>
                    <span className="text-red-500">o</span>
                    <span className="text-yellow-500">o</span>
                    <span className="text-blue-500">g</span>
                    <span className="text-green-500">l</span>
                    <span className="text-red-500">e</span>
                    <span className="text-navy"> Pay</span>
                  </span>
                </button>
                <p className="text-xs text-slate-custom opacity-60">Демо: реального списання не відбудеться</p>
              </div>
            )}

            {paymentMethod === "BANK_TRANSFER" && (
              <div className="space-y-3">
                <p className="text-sm text-slate-custom">
                  Переказ за реквізитами нижче. Після надходження коштів ваше замовлення буде підтверджено.
                </p>
                <div className="rounded-lg border border-navy/10 bg-navy/[0.02] p-4 text-sm space-y-2">
                  {[
                    ["Отримувач", "Luxury Resort Ltd"],
                    ["IBAN", "UA10 3223 1000 0000 2600 0789 1234 5"],
                    ["Банк", "JSC «Resort Bank»"],
                    ["Призначення", "Оплата послуг курорту (демо)"],
                    ["Сума", formatCurrency(amount)],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-4">
                      <span className="text-slate-custom shrink-0">{label}</span>
                      <span className="font-medium text-navy text-right break-all">{value}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-slate-custom opacity-70">
                  Демо-режим: реквізити є тестовими і не відповідають реальному рахунку.
                </p>
              </div>
            )}

            {paymentMethod === "CARD" && (
              <Button variant="gold" className="w-full" onClick={() => void handlePay()}>
                Сплатити {formatCurrency(amount)}
              </Button>
            )}

            {paymentMethod === "BANK_TRANSFER" && (
              <Button variant="gold" className="w-full" onClick={() => void handlePay()}>
                Підтвердити переказ
              </Button>
            )}

            <p className="text-center text-xs text-slate-custom opacity-60">
              Захищено SSL · Дані не зберігаються
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
