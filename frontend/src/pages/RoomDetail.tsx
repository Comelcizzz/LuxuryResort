import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { BookingContactCard } from "@/components/common/BookingContactCard";
import { PageTransition } from "@/components/common/PageTransition";
import { GuestReviewsList } from "@/components/reviews/GuestReviewsList";
import { Button } from "@/components/ui/button";
import { useRoom } from "@/hooks/useRooms";
import { formatCurrency } from "@/lib/formatters";
import { roomTypeLabelUk } from "@/lib/labels";
import { useAuthStore } from "@/store/authStore";
import { Link, useParams } from "react-router-dom";

export function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useRoom(id);
  const token = useAuthStore((s) => s.accessToken);

  if (isLoading || !id) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }
  if (!data) {
    return <p className="text-error">Номер не знайдено</p>;
  }

  const hero = data.images[0] ?? "https://images.unsplash.com/photo-1618773928121-3223e5af4c4?w=1200&q=80";

  return (
    <PageTransition>
      <div className="grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-navy/10 shadow-lg">
          <img src={hero} alt="" className="aspect-[4/3] w-full object-cover" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-gold">{roomTypeLabelUk(data.roomType)}</p>
          <h1 className="mt-2 font-display text-4xl font-bold">{data.name}</h1>
          <p className="mt-4 text-slate-custom">{data.description}</p>
          <p className="mt-6 text-2xl font-semibold text-navy">{formatCurrency(Number(data.basePricePerNight))} / ніч</p>
          <p className="mt-2 text-sm text-slate-custom">До {data.maxOccupancy} гостей · № {data.roomNumber}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {token ? (
              <Button variant="gold" size="lg" asChild>
                <Link to={`/rooms/${id}/book`}>Забронювати</Link>
              </Button>
            ) : (
              <Button variant="gold" size="lg" asChild>
                <Link to="/login">Увійти для бронювання</Link>
              </Button>
            )}
            <Button variant="outline" size="lg" asChild>
              <Link to="/rooms">Назад до списку</Link>
            </Button>
          </div>
          <div className="mt-6">
            <BookingContactCard />
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-navy/10 pt-12">
        <h2 className="font-display text-2xl font-bold text-navy">Відгуки гостей</h2>
        <p className="mt-2 text-sm text-slate-custom">Лише схвалені відгуки для цього номера.</p>
        <GuestReviewsList roomId={id} showRoomLink={false} className="mt-6" />
        <p className="mt-6 text-sm">
          <Link className="text-gold hover:underline" to={`/reviews?roomId=${id}`}>
            Відкрити цей фільтр на сторінці «Усі відгуки» →
          </Link>
        </p>
      </section>
    </PageTransition>
  );
}
