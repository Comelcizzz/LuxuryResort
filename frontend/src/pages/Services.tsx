import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PaginationBar } from "@/components/common/PaginationBar";
import { PageTransition } from "@/components/common/PageTransition";
import { ServiceCard } from "@/components/services/ServiceCard";
import { useServices } from "@/hooks/useServices";
import { serviceCategoryLabelUk } from "@/lib/labels";
import { useListQuery } from "@/lib/listQuery";
import { ServiceCategory as SC, type ServiceCategory } from "@/types/domain";
import { useState } from "react";

/** Парна кількість для сітки 2 колонки (sm+) */
const SERVICES_PAGE_SIZE = 8;

export function Services() {
  const { query, patch } = useListQuery({ sort: "popularityScore,desc", size: SERVICES_PAGE_SIZE });
  const [category, setCategory] = useState("");
  const { data, isLoading } = useServices({
    page: query.page,
    size: query.size,
    q: query.q || undefined,
    sort: query.sort,
    category: (category || undefined) as ServiceCategory | undefined,
  });

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Послуги курорту</h1>
      <p className="mt-2 text-slate-custom">СПА, ресторани, екскурсії та інше — замовлення після входу в акаунт.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-3">
        <input
          className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm"
          value={query.q}
          onChange={(e) => patch({ q: e.target.value, page: 0 })}
          placeholder="Пошук послуг"
        />
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={category} onChange={(e) => { setCategory(e.target.value); patch({ page: 0 }); }}>
          <option value="">Усі категорії</option>
          {Object.values(SC).map((x) => (
            <option key={x} value={x}>{serviceCategoryLabelUk(x)}</option>
          ))}
        </select>
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={query.sort} onChange={(e) => patch({ sort: e.target.value, page: 0 })}>
          <option value="name,asc">Назва А-Я</option>
          <option value="price,asc">Ціна зростання</option>
          <option value="price,desc">Ціна спадання</option>
          <option value="popularityScore,desc">Популярність</option>
        </select>
      </div>
      {isLoading && (
        <div className="mt-16 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
      {data && (
        <>
          <div className="mt-10 grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-2">
            {data.content.map((s) => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <PaginationBar page={query.page} totalPages={data.totalPages} onPageChange={(p) => patch({ page: p })} />
        </>
      )}
    </PageTransition>
  );
}
