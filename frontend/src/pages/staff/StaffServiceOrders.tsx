import { ServiceOrdersPanel } from "@/components/serviceOrders/ServiceOrdersPanel";
import { PageTransition } from "@/components/common/PageTransition";

export function StaffServiceOrders() {
  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Ресепшн · замовлення послуг</h1>
      <p className="mt-2 text-sm text-slate-custom">Ті самі дані, що й у адмін-панелі, без доступу до аналітики.</p>
      <div className="mt-8">
        <ServiceOrdersPanel />
      </div>
    </PageTransition>
  );
}
