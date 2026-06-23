import { createReview } from "@/api/endpoints/services.api";
import { fetchBookings } from "@/api/endpoints/bookings.api";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookingStatus } from "@/types/domain";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function WriteReview() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const bookings = useQuery({
    queryKey: ["bookings", "for-review"],
    queryFn: () => fetchBookings({ page: 0, size: 100, sort: "createdAt,desc" }),
  });
  const [bookingId, setBookingId] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [imagesRaw, setImagesRaw] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: () =>
      createReview({
        bookingId,
        rating,
        comment: comment.trim() || null,
        images: imagesRaw
          .split(/\r?\n/)
          .map((s) => s.trim())
          .filter(Boolean),
      }),
    onSuccess: async () => {
      setErr(null);
      await qc.invalidateQueries({ queryKey: ["reviews"] });
      navigate("/reviews");
    },
    onError: (e: Error) => setErr(e.message),
  });

  const eligible =
    bookings.data?.content.filter(
      (b) => b.status === BookingStatus.CHECKED_OUT || b.status === BookingStatus.CHECKED_IN
    ) ?? [];

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Новий відгук</h1>
      <p className="mt-2 text-sm text-slate-custom">
        Доступні бронювання зі статусом «заїзд» або «виїзд». Один відгук на бронювання.
      </p>
      <Link to="/reviews" className="mt-4 inline-block text-sm text-gold hover:underline">
        ← Усі відгуки
      </Link>
      {bookings.isLoading && <p className="mt-8">…</p>}
      {eligible.length === 0 && !bookings.isLoading && (
        <p className="mt-8 text-slate-custom">Немає бронювань для відгуку.</p>
      )}
      {eligible.length > 0 && (
        <div className="mx-auto mt-8 max-w-lg space-y-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
          <div>
            <Label>Бронювання</Label>
            <select
              className="mt-1 flex h-10 w-full rounded-md border border-navy/15 bg-white px-3 text-sm"
              value={bookingId}
              onChange={(e) => setBookingId(e.target.value)}
            >
              <option value="">— оберіть —</option>
              {eligible.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.roomName} · {b.checkInDate} → {b.checkOutDate}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Оцінка (1–5)</Label>
            <Input type="number" min={1} max={5} value={rating} onChange={(e) => setRating(Number(e.target.value))} />
          </div>
          <div>
            <Label>Коментар</Label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} />
          </div>
          <div>
            <Label>Посилання на фото (по одному в рядку)</Label>
            <Textarea value={imagesRaw} onChange={(e) => setImagesRaw(e.target.value)} rows={3} />
          </div>
          {err && <p className="text-sm text-error">{err}</p>}
          <Button
            variant="gold"
            type="button"
            disabled={!bookingId || mut.isPending}
            onClick={() => mut.mutate()}
          >
            {mut.isPending ? "…" : "Надіслати на модерацію"}
          </Button>
        </div>
      )}
    </PageTransition>
  );
}
