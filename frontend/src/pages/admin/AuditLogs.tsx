import { PaginationBar } from "@/components/common/PaginationBar";
import { PageTransition } from "@/components/common/PageTransition";
import { useAuditLogs } from "@/hooks/useAdmin";
import { formatDate } from "@/lib/formatters";
import { AUDIT_ENTITY_TYPES, auditActionLabelUk, entityTypeLabelUk } from "@/lib/labels";
import { useListQuery } from "@/lib/listQuery";
import type { AuditAction } from "@/types/domain";
import { AuditAction as AA } from "@/types/domain";
import { useState } from "react";

function badge(action: AuditAction): string {
  switch (action) {
    case AA.CREATE:
      return "bg-success/20 text-success";
    case AA.UPDATE:
      return "bg-blue-100 text-blue-800";
    case AA.DELETE:
      return "bg-error/15 text-error";
    case AA.STATUS_CHANGE:
      return "bg-amber-100 text-amber-900";
    default:
      return "bg-navy/10 text-navy";
  }
}

export function AuditLogs() {
  const { query, patch } = useListQuery({ sort: "createdAt,desc", size: 6 });
  const [entityType, setEntityType] = useState("");
  const [action, setAction] = useState("");
  const { data, isLoading } = useAuditLogs({
    page: query.page,
    entityType: entityType || undefined,
    action: (action || undefined) as AuditAction | undefined,
  });

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold">Журнал аудиту</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <select
          className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm"
          value={entityType}
          onChange={(e) => { setEntityType(e.target.value); patch({ page: 0 }); }}
        >
          <option value="">Усі типи сутностей</option>
          {AUDIT_ENTITY_TYPES.map((t) => (
            <option key={t} value={t}>{entityTypeLabelUk(t)}</option>
          ))}
        </select>
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={action} onChange={(e) => { setAction(e.target.value); patch({ page: 0 }); }}>
          <option value="">Усі дії</option>
          {Object.values(AA).map((x) => <option key={x} value={x}>{auditActionLabelUk(x)}</option>)}
        </select>
      </div>
      {isLoading && <p className="mt-8">…</p>}
      {data && (
        <>
          <ul className="mt-8 space-y-3">
            {data.content.length === 0 && <li className="text-slate-custom">Записів немає.</li>}
            {data.content.map((a) => (
              <li key={a.id} className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badge(a.action)}`}>
                    {auditActionLabelUk(a.action)}
                  </span>
                  <span className="text-sm font-medium">
                    {entityTypeLabelUk(a.entityType)} · {a.entityId}
                  </span>
                  <span className="text-xs text-slate-custom">{formatDate(a.createdAt)}</span>
                </div>
                <p className="mt-1 text-xs text-slate-custom">{a.performedByEmail ?? "система"}</p>
              </li>
            ))}
          </ul>
          <PaginationBar page={query.page} totalPages={data.totalPages} onPageChange={(p) => patch({ page: p })} />
        </>
      )}
    </PageTransition>
  );
}
