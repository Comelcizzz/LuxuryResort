import { createServiceOrder } from "@/api/endpoints/services.api";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageTransition } from "@/components/common/PageTransition";
import { RecommendedServices } from "@/components/services/RecommendedServices";
import { ServiceOrderCheckout, type ServiceOrderPayload } from "@/components/services/ServiceOrderCheckout";
import { useRecommendations } from "@/hooks/useRecommendations";
import { useService } from "@/hooks/useServices";
import { formatCurrency } from "@/lib/formatters";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";

function serviceUnitLabel(durationMinutes: number | null): string {
  if (!durationMinutes) return "за 1 послугу";
  return `за сеанс (${durationMinutes} хв)`;
}

export function ServiceDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useService(id);
  const token = useAuthStore((s) => s.accessToken);
  const rec = useRecommendations(Boolean(token));
  const qc = useQueryClient();

  const orderMut = useMutation({
    mutationFn: (payload: ServiceOrderPayload) =>
      createServiceOrder({
        serviceId: id!,
        bookingId: null,
        appointmentDatetime: payload.appointmentDatetime,
        quantity: payload.quantity,
        specialRequests: payload.specialRequests,
      }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["service-orders"] });
    },
  });

  if (isLoading || !id) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }
  if (!data) return <p className="text-error">Послугу не знайдено</p>;

  return (
    <PageTransition>
      <Link to="/services" className="text-sm text-gold hover:underline">
        ← Усі послуги
      </Link>
      <h1 className="mt-4 font-display text-4xl font-bold">{data.name}</h1>
      <p className="mt-4 max-w-2xl text-slate-custom">{data.description}</p>
      <p className="mt-4 text-2xl font-semibold text-gold">
        {formatCurrency(Number(data.price))}
        <span className="ml-2 text-sm font-normal text-slate-custom">{serviceUnitLabel(data.durationMinutes)}</span>
      </p>

      <RecommendedServices authenticated={Boolean(token)} items={rec.data} isLoading={rec.isLoading} />

      {token ? (
        <ServiceOrderCheckout
          service={data}
          isPending={orderMut.isPending}
          onConfirm={async (p) => {
            await orderMut.mutateAsync(p);
          }}
        />
      ) : (
        <p className="mt-8 text-sm text-slate-custom">
          <Link className="text-gold underline" to="/login">
            Увійдіть
          </Link>
          , щоб замовити послугу.
        </p>
      )}
    </PageTransition>
  );
}
