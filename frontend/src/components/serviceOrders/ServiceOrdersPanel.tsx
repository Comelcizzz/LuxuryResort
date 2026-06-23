import { updateServiceOrderStatus } from "@/api/endpoints/services.api";
import { PaginationBar } from "@/components/common/PaginationBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useServiceOrders } from "@/hooks/useServices";
import { formatCurrency, formatDate } from "@/lib/formatters";
import { orderStatusLabelUk } from "@/lib/labels";
import { useListQuery } from "@/lib/listQuery";
import type { OrderStatus } from "@/types/domain";
import { OrderStatus as OS } from "@/types/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const statuses: OrderStatus[] = [
  OS.PENDING,
  OS.CONFIRMED,
  OS.IN_PROGRESS,
  OS.COMPLETED,
  OS.CANCELLED,
];

export function ServiceOrdersPanel() {
  const { query, patch } = useListQuery({ sort: "createdAt,desc", size: 6 });
  const [statusFilter, setStatusFilter] = useState("");
  const { data, isLoading, refetch } = useServiceOrders({
    page: query.page,
    size: query.size,
    sort: query.sort,
    q: query.q || undefined,
    status: (statusFilter || undefined) as OrderStatus | undefined,
  });
  const qc = useQueryClient();
  const [local, setLocal] = useState<Record<string, OrderStatus>>({});

  useEffect(() => {
    if (!data) return;
    const next: Record<string, OrderStatus> = {};
    for (const o of data.content) {
      next[o.id] = o.status as OrderStatus;
    }
    setLocal(next);
  }, [data]);

  const mut = useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => updateServiceOrderStatus(id, status),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["service-orders"] });
      await refetch();
    },
  });

  if (isLoading) {
    return <p className="text-slate-custom">Завантаження…</p>;
  }
  if (!data || data.content.length === 0) {
    return <p className="text-slate-custom">Немає замовлень.</p>;
  }

  return (
    <>
    <div className="mb-4 grid gap-3 md:grid-cols-3">
      <Input value={query.q} onChange={(e) => patch({ q: e.target.value, page: 0 })} placeholder="Пошук: послуга або email" />
      <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); patch({ page: 0 }); }}>
        <option value="">Усі статуси</option>
        {statuses.map((s) => <option key={s} value={s}>{orderStatusLabelUk(s)}</option>)}
      </select>
      <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={query.sort} onChange={(e) => patch({ sort: e.target.value, page: 0 })}>
        <option value="createdAt,desc">Новіші</option>
        <option value="appointmentDatetime,asc">Найближчий час</option>
        <option value="totalPrice,desc">Сума спадання</option>
      </select>
    </div>
    <div className="overflow-x-auto rounded-xl border border-navy/10 bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-navy text-cream">
          <tr>
            <th className="p-3">Послуга</th>
            <th className="p-3">Клієнт</th>
            <th className="p-3">Час</th>
            <th className="p-3">Сума</th>
            <th className="p-3">Статус</th>
            <th className="p-3" />
          </tr>
        </thead>
        <tbody>
          {data.content.map((o) => (
            <tr key={o.id} className="border-t border-navy/10">
              <td className="p-3 font-medium">{o.serviceName}</td>
              <td className="p-3 text-xs">{o.userId}</td>
              <td className="p-3">{formatDate(o.appointmentDatetime)}</td>
              <td className="p-3">{formatCurrency(Number(o.totalPrice))}</td>
              <td className="p-3">
                <select
                  className="rounded border border-navy/20 px-2 py-1 text-xs"
                  value={local[o.id] ?? o.status}
                  onChange={(e) =>
                    setLocal((s) => ({
                      ...s,
                      [o.id]: e.target.value as OrderStatus,
                    }))
                  }
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {orderStatusLabelUk(s)}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-3">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  disabled={mut.isPending || (local[o.id] ?? o.status) === o.status}
                  onClick={() => mut.mutate({ id: o.id, status: local[o.id] ?? (o.status as OrderStatus) })}
                >
                  Зберегти
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <PaginationBar page={query.page} totalPages={data.totalPages} onPageChange={(p) => patch({ page: p })} />
    </>
  );
}
