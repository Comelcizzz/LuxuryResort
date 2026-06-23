import {
  createRoom,
  deleteRoom,
  updateRoom,
  type RoomWriteBody,
} from "@/api/endpoints/rooms.api";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRooms } from "@/hooks/useRooms";
import { formatCurrency } from "@/lib/formatters";
import { roomTypeLabelUk, roomStatusLabelUk } from "@/lib/labels";
import { useListQuery } from "@/lib/listQuery";
import { canDeleteRoomsAndServices } from "@/lib/roles";
import type { RoomResponse } from "@/types/api";
import type { RoomStatus, RoomType } from "@/types/domain";
import { RoomStatus as RS, RoomType as RT } from "@/types/domain";
import { useAuthStore } from "@/store/authStore";
import { PaginationBar } from "@/components/common/PaginationBar";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";

const roomTypes = Object.values(RT) as RoomType[];
const roomStatuses = Object.values(RS) as RoomStatus[];

function linesToList(s: string): string[] {
  return s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
}

function roomToForm(r: RoomResponse): RoomWriteBody {
  return {
    name: r.name,
    description: r.description,
    basePricePerNight: r.basePricePerNight,
    roomType: r.roomType,
    maxOccupancy: r.maxOccupancy,
    sizeSqm: r.sizeSqm,
    floor: r.floor,
    roomNumber: r.roomNumber,
    status: r.status as RoomStatus,
    amenities: [...r.amenities],
    images: [...r.images],
  };
}

const emptyRoom = (): RoomWriteBody => ({
  name: "",
  description: "",
  basePricePerNight: "2500",
  roomType: RT.STANDARD,
  maxOccupancy: 2,
  sizeSqm: null,
  floor: null,
  roomNumber: "",
  status: RS.AVAILABLE,
  amenities: [],
  images: [],
});

type RoomDlg = { kind: "none" } | { kind: "new" } | { kind: "edit"; row: RoomResponse };

export function RoomsManage() {
  const role = useAuthStore((s) => s.user?.role);
  const { query, patch } = useListQuery({ sort: "createdAt,desc", size: 6 });
  const { data, isLoading } = useRooms({ page: query.page, size: query.size, sort: query.sort, q: query.q || undefined });
  const qc = useQueryClient();
  const [dlg, setDlg] = useState<RoomDlg>({ kind: "none" });
  const [form, setForm] = useState<RoomWriteBody>(emptyRoom());
  const [amenitiesLines, setAmenitiesLines] = useState("");
  const [imagesLines, setImagesLines] = useState("");

  function applyBody(body: RoomWriteBody) {
    setForm(body);
    setAmenitiesLines(body.amenities.join("\n"));
    setImagesLines(body.images.join("\n"));
  }

  const createMut = useMutation({
    mutationFn: () =>
      createRoom({
        ...form,
        amenities: linesToList(amenitiesLines),
        images: linesToList(imagesLines),
      }),
    onSuccess: async () => {
      setDlg({ kind: "none" });
      await qc.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const updateMut = useMutation({
    mutationFn: (id: string) =>
      updateRoom(id, {
        ...form,
        amenities: linesToList(amenitiesLines),
        images: linesToList(imagesLines),
      }),
    onSuccess: async () => {
      setDlg({ kind: "none" });
      await qc.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  const delMut = useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["rooms"] });
    },
  });

  return (
    <PageTransition>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-bold text-navy">Керування номерами</h1>
        <Button
          variant="gold"
          type="button"
          onClick={() => {
            applyBody(emptyRoom());
            setDlg({ kind: "new" });
          }}
        >
          Додати номер
        </Button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Input value={query.q} onChange={(e) => patch({ q: e.target.value, page: 0 })} placeholder="Пошук: назва/№" />
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={query.sort} onChange={(e) => patch({ sort: e.target.value, page: 0 })}>
          <option value="createdAt,desc">Новіші</option>
          <option value="basePricePerNight,asc">Ціна зростання</option>
          <option value="basePricePerNight,desc">Ціна спадання</option>
        </select>
      </div>
      {isLoading && <p className="mt-8">…</p>}
      {data && (
        <>
        <div className="mt-8 overflow-x-auto rounded-xl border border-navy/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy text-cream">
              <tr>
                <th className="p-3">Номер</th>
                <th className="p-3">Назва</th>
                <th className="p-3">Тип</th>
                <th className="p-3">Ціна / ніч</th>
                <th className="p-3">Статус</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {data.content.map((room) => (
                <tr key={room.id} className="border-t border-navy/10">
                  <td className="p-3 font-mono text-xs">{room.roomNumber}</td>
                  <td className="p-3 font-medium">{room.name}</td>
                  <td className="p-3">{roomTypeLabelUk(room.roomType)}</td>
                  <td className="p-3">{formatCurrency(Number(room.basePricePerNight))}</td>
                  <td className="p-3">{roomStatusLabelUk(room.status)}</td>
                  <td className="p-3 space-x-2">
                    <Button variant="outline" size="sm" type="button" asChild>
                      <Link to={`/rooms/${room.id}`}>На сайті</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => {
                        applyBody(roomToForm(room));
                        setDlg({ kind: "edit", row: room });
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
                          if (window.confirm("Видалити номер?")) delMut.mutate(room.id);
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
            <DialogTitle>{dlg.kind === "new" ? "Новий номер" : "Редагування номера"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Назва</Label>
              <Input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <Label>Номер кімнати</Label>
              <Input
                value={form.roomNumber}
                onChange={(e) => setForm((f) => ({ ...f, roomNumber: e.target.value }))}
              />
            </div>
            <div className="sm:col-span-2">
              <Label>Опис</Label>
              <Textarea
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <Label>Базова ціна за ніч (UAH)</Label>
              <Input
                value={form.basePricePerNight}
                onChange={(e) => setForm((f) => ({ ...f, basePricePerNight: e.target.value }))}
              />
            </div>
            <div>
              <Label>Тип</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-md border border-navy/15 bg-white px-3 text-sm"
                value={form.roomType}
                onChange={(e) => setForm((f) => ({ ...f, roomType: e.target.value as RoomType }))}
              >
                {roomTypes.map((t) => (
                  <option key={t} value={t}>
                    {roomTypeLabelUk(t)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Макс. гостей</Label>
              <Input
                type="number"
                min={1}
                max={50}
                value={form.maxOccupancy}
                onChange={(e) => setForm((f) => ({ ...f, maxOccupancy: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Площа м² (необовʼязково)</Label>
              <Input
                value={form.sizeSqm ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    sizeSqm: e.target.value === "" ? null : e.target.value,
                  }))
                }
              />
            </div>
            <div>
              <Label>Поверх (необовʼязково)</Label>
              <Input
                type="number"
                value={form.floor ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    floor: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <Label>Статус</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-md border border-navy/15 bg-white px-3 text-sm"
                value={form.status}
                onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as RoomStatus }))}
              >
                {roomStatuses.map((s) => (
                  <option key={s} value={s}>
                    {roomStatusLabelUk(s)}
                  </option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Label>Зручності (по рядку)</Label>
              <Textarea rows={3} value={amenitiesLines} onChange={(e) => setAmenitiesLines(e.target.value)} />
            </div>
            <div className="sm:col-span-2">
              <Label>Зображення URL (по рядку)</Label>
              <Textarea rows={3} value={imagesLines} onChange={(e) => setImagesLines(e.target.value)} />
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
