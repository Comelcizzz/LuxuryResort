import { GuestReviewsList } from "@/components/reviews/GuestReviewsList";
import { PageTransition } from "@/components/common/PageTransition";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRooms } from "@/hooks/useRooms";
import { useListQuery } from "@/lib/listQuery";
import { roomTypeLabelUk } from "@/lib/roomLabels";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const ROOM_PICKER_PAGE_SIZE = 200;

export function Reviews() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { query, patch } = useListQuery({ sort: "createdAt,desc", size: 6 });
  const roomId = searchParams.get("roomId") ?? "";
  const ratingMin = searchParams.get("ratingMin") ?? "";

  const roomsQ = useRooms({ page: 0, size: ROOM_PICKER_PAGE_SIZE });

  const sortedRooms = useMemo(() => {
    const list = roomsQ.data?.content ?? [];
    return [...list].sort((a, b) => a.name.localeCompare(b.name, "uk"));
  }, [roomsQ.data?.content]);

  const onRoomChange = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) {
        next.set("roomId", value);
      } else {
        next.delete("roomId");
      }
      next.delete("page");
      return next;
    });
  };
  const onRatingMin = (value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set("ratingMin", value);
      else next.delete("ratingMin");
      next.delete("page");
      return next;
    });
  };

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Відгуки гостей</h1>
      <p className="mt-2 max-w-3xl text-slate-custom">
        Показані лише схвалені відгуки. Оберіть номер у списку, щоб побачити відгуки саме про нього, або залиште «Усі
        номери».
      </p>
      <div className="mt-6 rounded-2xl border border-navy/10 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <Label htmlFor="reviews-q">Пошук</Label>
            <Input
              id="reviews-q"
              className="mt-1"
              value={query.q}
              onChange={(e) => patch({ q: e.target.value, page: 0 })}
              placeholder="Слова з коментаря"
            />
          </div>
          <div>
            <Label htmlFor="reviews-sort">Сортування</Label>
            <select
              id="reviews-sort"
              className="mt-1 h-10 w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm"
              value={query.sort}
              onChange={(e) => patch({ sort: e.target.value, page: 0 })}
            >
              <option value="createdAt,desc">Спочатку нові</option>
              <option value="rating,desc">Вищий рейтинг</option>
              <option value="rating,asc">Нижчий рейтинг</option>
            </select>
          </div>
          <div>
            <Label htmlFor="reviews-rating">Рейтинг</Label>
            <select
              id="reviews-rating"
              className="mt-1 h-10 w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm"
              value={ratingMin}
              onChange={(e) => onRatingMin(e.target.value)}
            >
              <option value="">Будь-який</option>
              <option value="5">Від 5</option>
              <option value="4">Від 4</option>
              <option value="3">Від 3</option>
            </select>
          </div>
          <div>
            <Label htmlFor="room-filter">Номер</Label>
            <select
              id="room-filter"
              className={cn(
                "mt-1 h-10 w-full rounded-md border border-navy/15 bg-white px-3 py-2 text-sm text-navy",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold disabled:cursor-not-allowed disabled:opacity-50"
              )}
              value={roomId}
              onChange={(e) => onRoomChange(e.target.value)}
              disabled={roomsQ.isLoading || roomsQ.isError}
            >
              <option value="">Усі номери</option>
              {sortedRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} · №{r.roomNumber} · {roomTypeLabelUk(r.roomType)}
                </option>
              ))}
            </select>
          </div>
        </div>
        {roomsQ.isError && (
          <p className="mt-3 text-sm text-error">Не вдалося завантажити список номерів. Спробуйте оновити сторінку.</p>
        )}
      </div>
      <div className="mt-8">
        <GuestReviewsList
          roomId={roomId || undefined}
          q={query.q || undefined}
          sort={query.sort}
          page={query.page}
          size={query.size}
          ratingMin={ratingMin ? Number(ratingMin) : undefined}
          onPageChange={(p) => patch({ page: p })}
          showRoomLink
        />
      </div>
    </PageTransition>
  );
}
