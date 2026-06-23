import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function Home() {
  return (
    <PageTransition>
      <section className="grid gap-10 py-6 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Luxury Resort</p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight text-navy md:text-5xl">
            Відпочинок, де кожна деталь — про комфорт
          </h1>
          <p className="mt-4 max-w-lg text-slate-custom">
            Оберіть номер, динамічне ціноутворення, миттєве бронювання та сервіс преміум-класу — усе в одному
            сучасному веб-інтерфейсі.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="gold" size="lg" asChild>
              <Link to="/rooms">Переглянути номери</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/services">Послуги курорту</Link>
            </Button>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-navy/10 shadow-xl">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&q=80"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-navy/70 to-transparent" />
        </div>
      </section>
    </PageTransition>
  );
}
