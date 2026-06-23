import { createPricingRule, updatePricingRule } from "@/api/endpoints/admin.api";
import { PaginationBar } from "@/components/common/PaginationBar";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePricingRules } from "@/hooks/useAdmin";
import { pricingRuleNameLabelUk, ruleTypeLabelUk } from "@/lib/labels";
import { useListQuery } from "@/lib/listQuery";
import type { PricingRuleResponse } from "@/types/api";
import type { RuleType } from "@/types/domain";
import { RuleType as RT } from "@/types/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, type Dispatch, type SetStateAction } from "react";

const ruleTypes = Object.values(RT) as RuleType[];

type RuleForm = {
  name: string;
  ruleType: RuleType;
  multiplier: string;
  startDate: string;
  endDate: string;
  minNights: string;
  daysBeforeCheckin: string;
  priority: string;
  active: boolean;
};

const emptyForm = (): RuleForm => ({
  name: "",
  ruleType: RT.SEASONAL,
  multiplier: "1.0",
  startDate: "",
  endDate: "",
  minNights: "",
  daysBeforeCheckin: "",
  priority: "0",
  active: true,
});

function responseToForm(r: PricingRuleResponse): RuleForm {
  return {
    name: r.name,
    ruleType: r.ruleType as RuleType,
    multiplier: r.multiplier,
    startDate: r.startDate ? r.startDate.slice(0, 10) : "",
    endDate: r.endDate ? r.endDate.slice(0, 10) : "",
    minNights: r.minNights != null ? String(r.minNights) : "",
    daysBeforeCheckin: r.daysBeforeCheckin != null ? String(r.daysBeforeCheckin) : "",
    priority: String(r.priority),
    active: r.active,
  };
}

function formToApiPayload(f: RuleForm) {
  return {
    name: f.name.trim(),
    ruleType: f.ruleType,
    multiplier: f.multiplier.trim(),
    startDate: f.startDate.trim() || null,
    endDate: f.endDate.trim() || null,
    minNights: parseOptionalInt(f.minNights),
    daysBeforeCheckin: parseOptionalInt(f.daysBeforeCheckin),
    priority: Number(f.priority) || 0,
    active: f.active,
  };
}

function parseOptionalInt(s: string): number | null {
  const t = s.trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

function RuleFormFields({
  form,
  setForm,
  idPrefix,
}: {
  form: RuleForm;
  setForm: Dispatch<SetStateAction<RuleForm>>;
  idPrefix: string;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="sm:col-span-2">
        <Label htmlFor={`${idPrefix}-name`}>Назва</Label>
        <Input
          id={`${idPrefix}-name`}
          value={form.name}
          onChange={(e) => setForm((x) => ({ ...x, name: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-type`}>Тип</Label>
        <select
          id={`${idPrefix}-type`}
          className="mt-1 flex h-10 w-full rounded-md border border-navy/15 bg-white px-3 text-sm"
          value={form.ruleType}
          onChange={(e) => setForm((x) => ({ ...x, ruleType: e.target.value as RuleType }))}
        >
          {ruleTypes.map((t) => (
            <option key={t} value={t}>
              {ruleTypeLabelUk(t)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-mult`}>Множник (&gt; 0)</Label>
        <Input
          id={`${idPrefix}-mult`}
          value={form.multiplier}
          onChange={(e) => setForm((x) => ({ ...x, multiplier: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-sd`}>Початок</Label>
        <Input
          id={`${idPrefix}-sd`}
          type="date"
          value={form.startDate}
          onChange={(e) => setForm((x) => ({ ...x, startDate: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-ed`}>Кінець</Label>
        <Input
          id={`${idPrefix}-ed`}
          type="date"
          value={form.endDate}
          onChange={(e) => setForm((x) => ({ ...x, endDate: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-mn`}>Мін. ночей (необовʼязково)</Label>
        <Input
          id={`${idPrefix}-mn`}
          value={form.minNights}
          onChange={(e) => setForm((x) => ({ ...x, minNights: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-dbc`}>Днів до заїзду (необовʼязково)</Label>
        <Input
          id={`${idPrefix}-dbc`}
          value={form.daysBeforeCheckin}
          onChange={(e) => setForm((x) => ({ ...x, daysBeforeCheckin: e.target.value }))}
        />
      </div>
      <div>
        <Label htmlFor={`${idPrefix}-pr`}>Пріоритет</Label>
        <Input
          id={`${idPrefix}-pr`}
          type="number"
          value={form.priority}
          onChange={(e) => setForm((x) => ({ ...x, priority: e.target.value }))}
        />
      </div>
      <div className="flex items-center gap-2 pt-6">
        <input
          id={`${idPrefix}-act`}
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm((x) => ({ ...x, active: e.target.checked }))}
        />
        <Label htmlFor={`${idPrefix}-act`}>Активне</Label>
      </div>
    </div>
  );
}

export function PricingRules() {
  const { query, patch } = useListQuery({ sort: "priority,desc", size: 6 });
  const [ruleTypeFilter, setRuleTypeFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const { data, isLoading } = usePricingRules({
    page: query.page,
    size: query.size,
    sort: query.sort,
    q: query.q || undefined,
    ruleType: (ruleTypeFilter || undefined) as RuleType | undefined,
    active: activeFilter === "" ? undefined : activeFilter === "true",
  });
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const [editRule, setEditRule] = useState<PricingRuleResponse | null>(null);
  const [editForm, setEditForm] = useState<RuleForm>(emptyForm());
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState<RuleForm>(emptyForm());

  const updateMut = useMutation({
    mutationFn: () => {
      if (!editRule) throw new Error("Немає правила");
      return updatePricingRule(editRule.id, formToApiPayload(editForm));
    },
    onSuccess: async () => {
      setEditOpen(false);
      setEditRule(null);
      await qc.invalidateQueries({ queryKey: ["admin", "pricing"] });
    },
  });

  const createMut = useMutation({
    mutationFn: () => createPricingRule(formToApiPayload(createForm)),
    onSuccess: async () => {
      setCreateOpen(false);
      setCreateForm(emptyForm());
      await qc.invalidateQueries({ queryKey: ["admin", "pricing"] });
    },
  });

  function openEdit(r: PricingRuleResponse) {
    setEditRule(r);
    setEditForm(responseToForm(r));
    setEditOpen(true);
  }

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-navy">Правила ціноутворення</h1>
        <Button
          variant="gold"
          type="button"
          onClick={() => {
            setCreateForm(emptyForm());
            setCreateOpen(true);
          }}
        >
          Нове правило
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-4">
        <Input value={query.q} onChange={(e) => patch({ q: e.target.value, page: 0 })} placeholder="Пошук правила" />
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={ruleTypeFilter} onChange={(e) => { setRuleTypeFilter(e.target.value); patch({ page: 0 }); }}>
          <option value="">Усі типи</option>
          {ruleTypes.map((t) => <option key={t} value={t}>{ruleTypeLabelUk(t)}</option>)}
        </select>
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={activeFilter} onChange={(e) => { setActiveFilter(e.target.value); patch({ page: 0 }); }}>
          <option value="">Будь-яка активність</option>
          <option value="true">Активні</option>
          <option value="false">Неактивні</option>
        </select>
      </div>
      {isLoading && <p className="mt-8">…</p>}
      {data && (
        <div className="mt-8 overflow-x-auto rounded-xl border border-navy/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy text-cream">
              <tr>
                <th className="p-3">Назва</th>
                <th className="p-3">Тип</th>
                <th className="p-3">Множник</th>
                <th className="p-3">Активне</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {data.content.map((r) => (
                <tr key={r.id} className="border-t border-navy/10">
                  <td className="p-3 font-medium">{pricingRuleNameLabelUk(r.name)}</td>
                  <td className="p-3">{ruleTypeLabelUk(r.ruleType as RuleType)}</td>
                  <td className="p-3">{r.multiplier}</td>
                  <td className="p-3">{r.active ? "так" : "ні"}</td>
                  <td className="p-3">
                    <Button variant="outline" size="sm" type="button" onClick={() => openEdit(r)}>
                      Редагувати
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <PaginationBar page={query.page} totalPages={data.totalPages} onPageChange={(p) => patch({ page: p })} />
        </div>
      )}

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редагування правила</DialogTitle>
          </DialogHeader>
          <RuleFormFields form={editForm} setForm={setEditForm} idPrefix="edit" />
          <Button
            className="mt-4"
            variant="gold"
            type="button"
            disabled={updateMut.isPending || !editRule || !editForm.name.trim()}
            onClick={() => updateMut.mutate()}
          >
            Зберегти
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Нове правило ціноутворення</DialogTitle>
          </DialogHeader>
          <RuleFormFields form={createForm} setForm={setCreateForm} idPrefix="new" />
          <Button
            className="mt-4"
            variant="gold"
            type="button"
            disabled={createMut.isPending || !createForm.name.trim()}
            onClick={() => createMut.mutate()}
          >
            Створити
          </Button>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
