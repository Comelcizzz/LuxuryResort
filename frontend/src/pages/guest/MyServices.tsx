import { PaginationBar } from "@/components/common/PaginationBar";
import { PageTransition } from "@/components/common/PageTransition";
import { Input } from "@/components/ui/input";
import { useServiceOrders } from "@/hooks/useServices";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { orderStatusLabelUk } from "@/lib/labels";
import { useListQuery } from "@/lib/listQuery";
import { OrderStatus } from "@/types/domain";
import { useSearchParams } from "react-router-dom";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-violet-100 text-violet-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const PAY_LABELS: Record<string, string> = {
  CARD: "Картка",
  APPLE_PAY: "Apple Pay",
  GOOGLE_PAY: "Google Pay",
  BANK_TRANSFER: "Банківський переказ",
};

const filterSelectClass =
  "rounded-md border border-navy/15 bg-white px-3 py-2 text-sm";

function extractPaymentPref(sr: string | null): string | null {
  if (!sr) return null;
  const m = /Бажана оплата:\s*(\w+)/.exec(sr);
  return m ? (PAY_LABELS[m[1]] ?? m[1]) : null;
}

function extractUserRequests(sr: string | null): string | null {
  if (!sr) return null;
  const cleaned = sr.replace(/Бажана оплата:\s*\w+\.?\n?\n?/, "").trim();
  return cleaned || null;
}

export function MyServices() {
  const { query, patch } = useListQuery({ sort: "createdAt,desc", size: 8 });
  const [sp, setSp] = useSearchParams();
  const status = (sp.get("status") as OrderStatus | "") || "";
  const visitFrom = sp.get("visitFrom") ?? "";
  const visitTo = sp.get("visitTo") ?? "";

  const setExtra = (key: string, value: string) => {
    setSp((prev) => {
      const out = new URLSearchParams(prev);
      if (value) out.set(key, value);
      else out.delete(key);
      out.delete("page");
      return out;
    });
  };

  const { data, isLoading } = useServiceOrders({
    page: query.page,
    size: query.size,
    sort: query.sort,
    q: query.q || undefined,
    status: status || undefined,
    from: visitFrom ? `${visitFrom}T00:00:00.000Z` : undefined,
    to: visitTo ? `${visitTo}T23:59:59.999Z` : undefined,
  });

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold">Мої послуги</h1>
      <p className="mt-2 text-sm text-slate-custom">Фільтруйте замовлення за статусом, датою візиту та сортуйте список.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          value={query.q}
          onChange={(e) => patch({ q: e.target.value, page: 0 })}
          placeholder="Пошук за назвою послуги"
          aria-label="Пошук замовлень"
        />
        <select
          className={filterSelectClass}
          value={status}
          onChange={(e) => setExtra("status", e.target.value)}
          aria-label="Статус замовлення"
        >
          <option value="">Усі статуси</option>
          {Object.values(OrderStatus).map((s) => (
            <option key={s} value={s}>
              {orderStatusLabelUk(s)}
            </option>
          ))}
        </select>
        <Input
          type="date"
          className={filterSelectClass}
          value={visitFrom}
          onChange={(e) => setExtra("visitFrom", e.target.value)}
          aria-label="Візит від"
        />
        <Input
          type="date"
          className={filterSelectClass}
          value={visitTo}
          onChange={(e) => setExtra("visitTo", e.target.value)}
          aria-label="Візит до"
        />
        <select
          className={filterSelectClass}
          value={query.sort}
          onChange={(e) => patch({ sort: e.target.value, page: 0 })}
          aria-label="Сортування"
        >
          <option value="createdAt,desc">Новіші спочатку</option>
          <option value="createdAt,asc">Старіші спочатку</option>
          <option value="appointmentDatetime,asc">Візит: найближчі</option>
          <option value="appointmentDatetime,desc">Візит: найпізніші</option>
          <option value="totalPrice,desc">Сума: спадання</option>
          <option value="totalPrice,asc">Сума: зростання</option>
        </select>
      </div>

      {isLoading && <p className="mt-8 text-slate-custom">Завантаження…</p>}

      {data && (
        <>
          <div className="mt-8 space-y-4">
            {data.content.length === 0 && (
              <p className="text-slate-custom">За цими фільтрами замовлень не знайдено.</p>
            )}
            {data.content.map((o) => {
              const payPref = extractPaymentPref(o.specialRequests);
              const userNote = extractUserRequests(o.specialRequests);
              const statusLabel = orderStatusLabelUk(o.status as OrderStatus);
              const statusColor = STATUS_COLORS[o.status] ?? "bg-navy/10 text-navy";

              return (
                <div key={o.id} className="space-y-3 rounded-xl border border-navy/10 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-base font-semibold text-navy">{o.serviceName}</p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                      {statusLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm text-slate-custom">
                    <div>
                      <span className="text-xs uppercase tracking-wide opacity-60">Дата візиту</span>
                      <p className="font-medium text-navy">{formatDate(o.appointmentDatetime)}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide opacity-60">Замовлено</span>
                      <p className="font-medium text-navy">{formatDate(o.createdAt)}</p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide opacity-60">Кількість</span>
                      <p className="font-medium text-navy">
                        {o.quantity} {o.quantity === 1 ? "сеанс" : "сеансів"}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wide opacity-60">Сума</span>
                      <p className="font-bold text-gold">{formatCurrency(Number(o.totalPrice))}</p>
                    </div>
                    {payPref && (
                      <div>
                        <span className="text-xs uppercase tracking-wide opacity-60">Спосіб оплати</span>
                        <p className="font-medium text-navy">{payPref}</p>
                      </div>
                    )}
                  </div>

                  {userNote && (
                    <div className="rounded-lg border border-navy/10 bg-navy/[0.02] px-3 py-2 text-sm text-slate-custom">
                      <span className="mb-0.5 block text-xs uppercase tracking-wide opacity-60">Побажання</span>
                      {userNote}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <PaginationBar
            page={query.page}
            totalPages={data.totalPages}
            onPageChange={(p) => patch({ page: p })}
          />
        </>
      )}
    </PageTransition>
  );
}
