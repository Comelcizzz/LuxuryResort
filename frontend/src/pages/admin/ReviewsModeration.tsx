import { approveReview, deleteReview } from "@/api/endpoints/services.api";
import { PaginationBar } from "@/components/common/PaginationBar";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useReviewsList } from "@/hooks/useReviews";
import { canDeleteRoomsAndServices } from "@/lib/roles";
import { formatDate } from "@/lib/formatters";
import { useListQuery } from "@/lib/listQuery";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function ReviewsModeration() {
  const role = useAuthStore((s) => s.user?.role);
  const { query, patch } = useListQuery({ sort: "createdAt,desc", size: 6 });
  const [ratingMin, setRatingMin] = useState("");
  const q = useReviewsList({
    approved: false,
    q: query.q || undefined,
    sort: query.sort,
    ratingMin: ratingMin ? Number(ratingMin) : undefined,
    page: query.page,
    size: query.size,
  });
  const qc = useQueryClient();
  const [err, setErr] = useState<string | null>(null);

  const approveMut = useMutation({
    mutationFn: (id: string) => approveReview(id),
    onSuccess: async () => {
      setErr(null);
      await qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteReview(id),
    onSuccess: async () => {
      setErr(null);
      await qc.invalidateQueries({ queryKey: ["reviews"] });
    },
    onError: (e: Error) => setErr(e.message),
  });

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Модерація відгуків</h1>
      <p className="mt-2 text-sm text-slate-custom">Відгуки, що очікують схвалення.</p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Input value={query.q} onChange={(e) => patch({ q: e.target.value, page: 0 })} placeholder="Пошук по коментарях" />
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={ratingMin} onChange={(e) => { setRatingMin(e.target.value); patch({ page: 0 }); }}>
          <option value="">Усі оцінки</option>
          <option value="5">Тільки 5</option>
          <option value="4">Від 4</option>
          <option value="3">Від 3</option>
        </select>
      </div>
      {err && <p className="mt-4 text-sm text-error">{err}</p>}
      {q.isLoading && <p className="mt-8">…</p>}
      {q.data && (
        <>
          <ul className="mt-8 space-y-4">
            {q.data.content.length === 0 && <li className="text-slate-custom">Черга порожня.</li>}
            {q.data.content.map((r) => (
              <li key={r.id} className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 shadow-sm">
                <p className="text-xs text-slate-custom">{formatDate(r.createdAt)}</p>
                <p className="mt-1 font-semibold">Оцінка: {r.rating}</p>
                <p className="mt-2 text-sm">{r.comment ?? "—"}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    variant="gold"
                    size="sm"
                    type="button"
                    disabled={approveMut.isPending}
                    onClick={() => approveMut.mutate(r.id)}
                  >
                    Схвалити
                  </Button>
                  {canDeleteRoomsAndServices(role) && (
                    <Button
                      variant="danger"
                      size="sm"
                      type="button"
                      disabled={delMut.isPending}
                      onClick={() => {
                        if (window.confirm("Видалити відгук?")) delMut.mutate(r.id);
                      }}
                    >
                      Видалити
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <PaginationBar page={query.page} totalPages={q.data.totalPages} onPageChange={(p) => patch({ page: p })} />
        </>
      )}
    </PageTransition>
  );
}
