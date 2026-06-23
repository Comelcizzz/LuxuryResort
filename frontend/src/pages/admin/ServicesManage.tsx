import {
  createService,
  deleteService,
  updateService,
  type ServiceWriteBody,
} from "@/api/endpoints/services.api";
import { PaginationBar } from "@/components/common/PaginationBar";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useServices } from "@/hooks/useServices";
import { formatCurrency } from "@/lib/formatters";
import { serviceCategoryLabelUk } from "@/lib/labels";
import { useListQuery } from "@/lib/listQuery";
import { canDeleteRoomsAndServices } from "@/lib/roles";
import type { ServiceResponse } from "@/types/api";
import type { ServiceCategory } from "@/types/domain";
import { ServiceCategory as SC } from "@/types/domain";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

const categories = Object.values(SC) as ServiceCategory[];

function linesToList(s: string): string[] {
  return s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

function serviceToForm(s: ServiceResponse): ServiceWriteBody {
  return {
    name: s.name,
    description: s.description,
    category: s.category as ServiceCategory,
    price: s.price,
    durationMinutes: s.durationMinutes,
    maxParticipants: s.maxParticipants,
    images: [...s.images],
    available: s.available,
  };
}

const emptyService = (): ServiceWriteBody => ({
  name: "",
  description: "",
  category: SC.SPA,
  price: "500",
  durationMinutes: 60,
  maxParticipants: 1,
  images: [],
  available: true,
});

type ServiceDlg = { kind: "none" } | { kind: "new" } | { kind: "edit"; row: ServiceResponse };

export function ServicesManage() {
  const role = useAuthStore((s) => s.user?.role);
  const { query, patch } = useListQuery({ sort: "name,asc", size: 6 });
  const { data, isLoading } = useServices({
    page: query.page,
    size: query.size,
    sort: query.sort,
    q: query.q || undefined,
  });
  const qc = useQueryClient();
  const [dlg, setDlg] = useState<ServiceDlg>({ kind: "none" });
  const [form, setForm] = useState<ServiceWriteBody>(emptyService());
  const [imagesLines, setImagesLines] = useState("");

  function applyBody(body: ServiceWriteBody) {
    setForm(body);
    setImagesLines(body.images.join("\n"));
  }

  const createMut = useMutation({
    mutationFn: () => createService({ ...form, images: linesToList(imagesLines) }),
    onSuccess: async () => {
      setDlg({ kind: "none" });
      await qc.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const updateMut = useMutation({
    mutationFn: (id: string) => updateService(id, { ...form, images: linesToList(imagesLines) }),
    onSuccess: async () => {
      setDlg({ kind: "none" });
      await qc.invalidateQueries({ queryKey: ["services"] });
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteService(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["services"] });
    },
  });

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-navy">Каталог послуг (адмін)</h1>
        <Button
          variant="gold"
          type="button"
          onClick={() => {
            applyBody(emptyService());
            setDlg({ kind: "new" });
          }}
        >
          Додати послугу
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Input value={query.q} onChange={(e) => patch({ q: e.target.value, page: 0 })} placeholder="Пошук послуг" />
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={query.sort} onChange={(e) => patch({ sort: e.target.value, page: 0 })}>
          <option value="name,asc">Назва А-Я</option>
          <option value="price,asc">Ціна зростання</option>
          <option value="price,desc">Ціна спадання</option>
          <option value="createdAt,desc">Новіші</option>
        </select>
      </div>
      {isLoading && <p className="mt-8">…</p>}
      {data && (
        <>
        <div className="mt-8 overflow-x-auto rounded-xl border border-navy/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy text-cream">
              <tr>
                <th className="p-3">Назва</th>
                <th className="p-3">Категорія</th>
                <th className="p-3">Ціна</th>
                <th className="p-3">Активна</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {data.content.map((s) => (
                <tr key={s.id} className="border-t border-navy/10">
                  <td className="p-3 font-medium">{s.name}</td>
                  <td className="p-3">{serviceCategoryLabelUk(s.category as ServiceCategory)}</td>
                  <td className="p-3">{formatCurrency(Number(s.price))}</td>
                  <td className="p-3">{s.available ? "так" : "ні"}</td>
                  <td className="p-3 space-x-2">
                    <Button variant="outline" size="sm" type="button" asChild>
                      <Link to={`/services/${s.id}`}>На сайті</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => {
                        applyBody(serviceToForm(s));
                        setDlg({ kind: "edit", row: s });
                      }}
                    >
                      Редагувати
                    </Button>
                    {canDeleteRoomsAndServices(role) && (
                      <Button
                        variant="danger"
                        size="sm"
                        type="button"
                        disabled={delMut.isPending}
                        onClick={() => {
                          if (window.confirm("Видалити послугу?")) delMut.mutate(s.id);
                        }}
                      >
                        Видалити
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar page={query.page} totalPages={data.totalPages} onPageChange={(p) => patch({ page: p })} />
        </>
      )}

      <Dialog open={dlg.kind !== "none"} onOpenChange={(o) => !o && setDlg({ kind: "none" })}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dlg.kind === "new" ? "Нова послуга" : "Редагування послуги"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Назва</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <Label>Опис</Label>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <Label>Категорія</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-md border border-navy/15 bg-white px-3 text-sm"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as ServiceCategory }))}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {serviceCategoryLabelUk(c)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Ціна (UAH)</Label>
              <Input value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
            </div>
            <div>
              <Label>Тривалість (хв), опційно</Label>
              <Input
                type="number"
                value={form.durationMinutes ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    durationMinutes: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Макс. учасників</Label>
              <Input
                type="number"
                min={1}
                value={form.maxParticipants}
                onChange={(e) => setForm((f) => ({ ...f, maxParticipants: Number(e.target.value) }))}
              />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                id="av"
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm((f) => ({ ...f, available: e.target.checked }))}
              />
              <Label htmlFor="av">Доступна</Label>
            </div>
            <div className="sm:col-span-2">
              <Label>Зображення (URL, по рядку)</Label>
              <Textarea rows={4} value={imagesLines} onChange={(e) => setImagesLines(e.target.value)} />
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            {dlg.kind === "new" ? (
              <Button variant="gold" type="button" disabled={createMut.isPending} onClick={() => createMut.mutate()}>
                Створити
              </Button>
            ) : (
              <Button
                variant="gold"
                type="button"
                disabled={updateMut.isPending || dlg.kind !== "edit"}
                onClick={() => dlg.kind === "edit" && updateMut.mutate(dlg.row.id)}
              >
                Зберегти
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
}
