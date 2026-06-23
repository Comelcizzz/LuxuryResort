import { BookingWizard } from "@/components/bookings/BookingWizard";
import { BookingContactCard } from "@/components/common/BookingContactCard";
import { PageTransition } from "@/components/common/PageTransition";
import { useParams } from "react-router-dom";

export function BookingWizardPage() {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;
  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Бронювання</h1>
      <p className="mt-2 text-sm text-slate-custom">Кроки: дати → деталі → оплата → підтвердження</p>
      <div className="mt-6 max-w-2xl">
        <BookingContactCard />
      </div>
      <div className="mt-8">
        <BookingWizard roomId={id} />
      </div>
    </PageTransition>
  );
}
