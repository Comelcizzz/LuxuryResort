import { resortContact } from "@/lib/contact";

export function BookingContactCard() {
  return (
    <div className="rounded-xl border border-gold/25 bg-gold/10 p-4 text-sm text-navy">
      <p className="font-semibold">Бронювання телефоном</p>
      <p className="mt-1 text-slate-custom">
        Якщо зручніше оформити бронь через рецепцію, телефонуйте або пишіть нам.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
        <a className="font-medium text-gold hover:underline" href={resortContact.phoneHref}>
          {resortContact.phoneDisplay}
        </a>
        <a className="font-medium text-gold hover:underline" href={resortContact.bookingEmailHref}>
          {resortContact.bookingEmail}
        </a>
      </div>
    </div>
  );
}
