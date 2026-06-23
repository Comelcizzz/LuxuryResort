import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-lg py-20 text-center">
        <p className="font-display text-6xl font-bold text-gold">404</p>
        <h1 className="mt-4 font-display text-2xl text-navy">Сторінку не знайдено</h1>
        <p className="mt-2 text-slate-custom">Перевірте адресу або поверніться на головну.</p>
        <Button className="mt-8" variant="gold" asChild>
          <Link to="/">На головну</Link>
        </Button>
      </div>
    </PageTransition>
  );
}
