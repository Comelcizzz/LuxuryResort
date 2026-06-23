import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import type { ServiceResponse } from "@/types/api";
import { Link } from "react-router-dom";

function serviceUnitLabel(durationMinutes: number | null): string {
  if (!durationMinutes) return "за 1 послугу";
  return `за сеанс (${durationMinutes} хв)`;
}

export function ServiceCard({ service }: { service: ServiceResponse }) {
  const img =
    service.images[0] ??
    "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=80";

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden bg-navy/5">
        <img
          src={img}
          alt=""
          className="h-full w-full object-cover transition duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>
      <CardHeader className="shrink-0 pb-2">
        <CardTitle className="line-clamp-2 min-h-[3.25rem] text-xl leading-snug">{service.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col space-y-3 pt-0">
        <p className="line-clamp-3 min-h-[4.5rem] flex-1 text-sm text-slate-custom">
          {service.description ?? ""}
        </p>
        <p className="shrink-0 font-semibold text-gold">
          {formatCurrency(Number(service.price))}{" "}
          <span className="text-xs font-normal text-slate-custom">· {serviceUnitLabel(service.durationMinutes)}</span>
        </p>
        <Button variant="outline" className="mt-auto w-fit" asChild>
          <Link to={`/services/${service.id}`}>Деталі</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
