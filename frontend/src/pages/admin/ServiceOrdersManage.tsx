import { ServiceOrdersPanel } from "@/components/serviceOrders/ServiceOrdersPanel";
import { PageTransition } from "@/components/common/PageTransition";

export function ServiceOrdersManage() {
  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Черга замовлень послуг</h1>
      <p className="mt-2 text-sm text-slate-custom">Оновлення статусів для персоналу готелю.</p>
      <div className="mt-8">
        <ServiceOrdersPanel />
      </div>
    </PageTransition>
  );
}
