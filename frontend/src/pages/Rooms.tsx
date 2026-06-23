import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PaginationBar } from "@/components/common/PaginationBar";
import { PageTransition } from "@/components/common/PageTransition";
import { RoomCard } from "@/components/rooms/RoomCard";
import { Input } from "@/components/ui/input";
import { useRooms } from "@/hooks/useRooms";
import { useListQuery } from "@/lib/listQuery";
import { roomTypeLabelUk } from "@/lib/labels";
import { RoomType as RT, type RoomType } from "@/types/domain";
import { useSearchParams } from "react-router-dom";

export function Rooms() {
  const { query, patch } = useListQuery({ sort: "basePricePerNight,asc", size: 6 });
  const [sp, setSp] = useSearchParams();
  const type = (sp.get("type") as RoomType | null) ?? "";
  const available = sp.get("available") ?? "";
  const { data, isLoading, isError } = useRooms({
    page: query.page,
    size: query.size,
    q: query.q || undefined,
    sort: query.sort,
    type: (type || undefined) as RoomType | undefined,
    available: available === "" ? undefined : available === "true",
  });

  const setExtra = (key: string, value: string) => {
    setSp((prev) => {
      const out = new URLSearchParams(prev);
      if (value) out.set(key, value);
      else out.delete(key);
      out.delete("page");
      return out;
    });
  };

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Номери</h1>
      <p className="mt-2 text-slate-custom">Оберіть категорію та дати бронювання у картці номера.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Input
          value={query.q}
          onChange={(e) => patch({ q: e.target.value, page: 0 })}
          placeholder="Пошук: назва/№"
          aria-label="Пошук номерів"
        />
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={type} onChange={(e) => setExtra("type", e.target.value)}>
          <option value="">Усі типи</option>
          {Object.values(RT).map((x) => (
            <option key={x} value={x}>{roomTypeLabelUk(x)}</option>
          ))}
        </select>
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={available} onChange={(e) => setExtra("available", e.target.value)}>
          <option value="">Будь-яка доступність</option>
          <option value="true">Лише доступні</option>
          <option value="false">Лише недоступні</option>
        </select>
        <select className="rounded-md border border-navy/15 bg-white px-3 py-2 text-sm" value={query.sort} onChange={(e) => patch({ sort: e.target.value, page: 0 })}>
          <option value="createdAt,desc">Новіші</option>
          <option value="basePricePerNight,asc">Ціна зростання</option>
          <option value="basePricePerNight,desc">Ціна спадання</option>
          <option value="avgRating,desc">Рейтинг</option>
        </select>
      </div>
      {isLoading && (
        <div className="mt-16 flex justify-center">
          <LoadingSpinner />
        </div>
      )}
      {isError && <p className="mt-8 text-error">Не вдалося завантажити номери.</p>}
      {data && (
        <>
          <div className="mt-10 grid auto-rows-fr gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {data.content.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
            {data.content.length === 0 && <p className="text-slate-custom">За цим запитом номерів не знайдено.</p>}
          </div>
          <PaginationBar page={query.page} totalPages={data.totalPages} onPageChange={(p) => patch({ page: p })} />
        </>
      )}
    </PageTransition>
  );
}
