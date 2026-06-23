import type { PricingResult } from "@/types/api";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { formatCurrency } from "@/lib/formatters";
import { pricingRuleNameLabelUk } from "@/lib/labels";

export function PricingBreakdownPanel({ pricing }: { pricing: PricingResult | null | undefined }) {
  const [open, setOpen] = useState(true);
  if (!pricing) return null;
  return (
    <div className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left font-medium text-navy"
        onClick={() => setOpen((v) => !v)}
      >
        Розбір ціни
        <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-custom">Базова сума</span>
                <span>{formatCurrency(Number(pricing.baseTotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-custom">Комбінований множник</span>
                <span className="rounded bg-gold/20 px-2 py-0.5 text-xs font-semibold">{pricing.combinedMultiplier}×</span>
              </div>
              <div className="flex justify-between border-t border-navy/10 pt-2 font-semibold">
                <span>До сплати</span>
                <span>{formatCurrency(Number(pricing.finalTotal))}</span>
              </div>
              <div className="pt-2">
                <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-custom">Застосовані правила</p>
                <ul className="flex flex-wrap gap-2">
                  {pricing.appliedRules.map((r) => (
                    <li key={r.name} className="rounded-full bg-navy/5 px-2 py-1 text-xs">
                      {pricingRuleNameLabelUk(r.name)}{" "}
                      <span className="font-semibold text-gold">{r.multiplier}×</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
