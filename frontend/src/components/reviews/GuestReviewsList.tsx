import { PaginationBar } from "@/components/common/PaginationBar";
import { useReviewsList } from "@/hooks/useReviews";
import { formatDate } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Props = {
  roomId?: string;
  q?: string;
  ratingMin?: number;
  ratingMax?: number;
  sort?: string;
  size?: number;
  page?: number;
  onPageChange?: (page: number) => void;
  /** On the global reviews page, link each item to the room. Hidden on room detail. */
  showRoomLink?: boolean;
  className?: string;
};

export function GuestReviewsList({
  roomId,
  q,
  ratingMin,
  ratingMax,
  sort,
  size = 20,
  page,
  onPageChange,
  showRoomLink = true,
  className,
}: Props) {
  const [innerPage, setInnerPage] = useState(0);
  const currentPage = page ?? innerPage;

  useEffect(() => {
    if (page == null) setInnerPage(0);
  }, [roomId, page]);

  const reviewsQ = useReviewsList({
    roomId: roomId?.trim() || undefined,
    approved: true,
    q,
    ratingMin,
    ratingMax,
    sort,
    size,
    page: currentPage,
  });

  if (reviewsQ.isLoading) {
    return <p className={cn("text-slate-custom", className)}>Завантаження відгуків…</p>;
  }

  if (!reviewsQ.data) {
    return <p className={cn("text-error", className)}>Не вдалося завантажити відгуки.</p>;
  }

  return (
    <div className={className}>
      <ul className="space-y-4">
        {reviewsQ.data.content.length === 0 && <li className="text-slate-custom">Поки немає схвалених відгуків.</li>}
        {reviewsQ.data.content.map((r) => (
          <li key={r.id} className="rounded-2xl border border-navy/10 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-navy">{r.authorName}</p>
                <p className="text-xs text-slate-custom">Гість курорту</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-custom">{formatDate(r.createdAt)}</p>
                <p className="mt-1 font-semibold text-gold">{"★".repeat(Math.max(1, r.rating))} <span className="text-navy">({r.rating}/5)</span></p>
              </div>
            </div>
            <p className="mt-4 border-l-2 border-gold/40 pl-3 text-sm leading-relaxed text-slate-custom">
              {r.comment ?? "Без текстового коментаря."}
            </p>
            {showRoomLink && (
              <Link
                className="mt-4 inline-flex items-center rounded-md border border-gold/40 px-3 py-1.5 text-xs font-medium text-gold transition hover:bg-gold/10"
                to={`/rooms/${r.roomId}`}
              >
                Сторінка номера →
              </Link>
            )}
          </li>
        ))}
      </ul>
      <PaginationBar
        page={currentPage}
        totalPages={reviewsQ.data.totalPages}
        onPageChange={(nextPage) => {
          if (onPageChange) onPageChange(nextPage);
          else setInnerPage(nextPage);
        }}
      />
    </div>
  );
}
