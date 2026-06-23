import { downloadInvoice, fetchBookings, updateBookingStatus } from "@/api/endpoints/bookings.api";
import { PaginationBar } from "@/components/common/PaginationBar";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { bookingStatusLabelUk } from "@/lib/labels";
import { useListQuery } from "@/lib/listQuery";
import { BookingStatus } from "@/types/domain";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const filterSelectClass =
  "rounded-md border border-navy/15 bg-white px-3 py-2 text-sm";

export function MyBookings() {
  const qc = useQueryClient();
  const [err, setErr] = useState<string | null>(null);
  const { query, patch } = useListQuery({ sort: "createdAt,desc", size: 8 });
  const [sp, setSp] = useSearchParams();
  const status = (sp.get("status") as BookingStatus | "") || "";
  const checkInFrom = sp.get("checkInFrom") ?? "";
  const checkInTo = sp.get("checkInTo") ?? "";

  const setExtra = (key: string, value: string) => {
    setSp((prev) => {
      const out = new URLSearchParams(prev);
      if (value) out.set(key, value);
      else out.delete(key);
      out.delete("page");
      return out;
    });
  };

  const q = useQuery({
    queryKey: ["bookings", "mine", query, status, checkInFrom, checkInTo],
    queryFn: () =>
      fetchBookings({
        page: query.page,
        size: query.size,
        sort: query.sort,
        q: query.q || undefined,
        status: status || undefined,
        checkInFrom: checkInFrom || undefined,
        checkInTo: checkInTo || undefined,
      }),
  });

  const cancelMut = useMutation({
    mutationFn: (id: string) =>
      updateBookingStatus(id, BookingStatus.CANCELLED, "Скасовано гостем"),
    onSuccess: async () => {
      setErr(null);
      await qc.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  async function onInvoice(id: string) {
    try {
      const blob = await downloadInvoice(id);
      const url = URL.createObjectURL(blob);
      const slug = id.replace(/-/g, "").slice(0, 8).toUpperCase();
      const a = document.createElement("a");
      a.href = url;
      a.download = `LuxuryResort-cheque-${slug}.pdf`;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "PDF недоступний");
    }
  }

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold">Мої бронювання</h1>
      <p className="mt-2 text-sm text-slate-custom">Фільтруйте за статусом, датою заїзду або сортуйте список.</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <Input
          value={query.q}
          onChange={(e) => patch({ q: e.target.value, page: 0 })}
          placeholder="Пошук: назва номера"
          aria-label="Пошук бронювань"
        />
        <select
          className={filterSelectClass}
          value={status}
          onChange={(e) => setExtra("status", e.target.value)}
          aria-label="Статус бронювання"
        >
          <option value="">Усі статуси</option>
          {Object.values(BookingStatus).map((s) => (
            <option key={s} value={s}>
              {bookingStatusLabelUk(s)}
            </option>
          ))}
        </select>
        <Input
          type="date"
          className={filterSelectClass}
          value={checkInFrom}
          onChange={(e) => setExtra("checkInFrom", e.target.value)}
          aria-label="Заїзд від"
        />
        <Input
          type="date"
          className={filterSelectClass}
          value={checkInTo}
          onChange={(e) => setExtra("checkInTo", e.target.value)}
          aria-label="Заїзд до"
        />
        <select
          className={filterSelectClass}
          value={query.sort}
          onChange={(e) => patch({ sort: e.target.value, page: 0 })}
          aria-label="Сортування"
        >
          <option value="createdAt,desc">Новіші спочатку</option>
          <option value="createdAt,asc">Старіші спочатку</option>
          <option value="checkInDate,asc">Заїзд: найближчі</option>
          <option value="checkInDate,desc">Заїзд: найпізніші</option>
          <option value="dynamicPriceTotal,desc">Сума: спадання</option>
          <option value="dynamicPriceTotal,asc">Сума: зростання</option>
        </select>
      </div>

      {err && <p className="mt-4 text-sm text-error">{err}</p>}
      {q.isLoading && <p className="mt-8 text-slate-custom">Завантаження…</p>}
      {q.data && (
        <>
          <div className="mt-8 space-y-4">
            {q.data.content.length === 0 && (
              <p className="text-slate-custom">За цими фільтрами бронювань не знайдено.</p>
            )}
            {q.data.content.map((b) => {
              const canCancel =
                b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED;
              return (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-xl border border-navy/10 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold">{b.roomName}</p>
                    <p className="text-sm text-slate-custom">
                      {formatDate(b.checkInDate)} — {formatDate(b.checkOutDate)}
                    </p>
                    <p className="text-sm">
                      Статус:{" "}
                      <span className="font-medium text-gold">{bookingStatusLabelUk(b.status)}</span>
                    </p>
                    <p className="text-sm font-semibold">{formatCurrency(Number(b.dynamicPriceTotal))}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" type="button" onClick={() => void onInvoice(b.id)}>
                      Чек PDF
                    </Button>
                    {canCancel && (
                      <Button
                        variant="danger"
                        size="sm"
                        type="button"
                        disabled={cancelMut.isPending}
                        onClick={() => cancelMut.mutate(b.id)}
                      >
                        Скасувати
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <PaginationBar page={query.page} totalPages={q.data.totalPages} onPageChange={(p) => patch({ page: p })} />
        </>
      )}
    </PageTransition>
  );
}
