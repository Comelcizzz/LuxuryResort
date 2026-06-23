import { useSearchParams } from "react-router-dom";

export type ListQuery = {
  page: number;
  size: number;
  q: string;
  sort: string;
};

function readInt(raw: string | null, fallback: number, min = 0): number {
  if (raw === null || raw.trim() === "") return fallback;
  const n = Number(raw);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.trunc(n));
}

export function useListQuery(defaults?: Partial<ListQuery>) {
  const [sp, setSp] = useSearchParams();
  const query = parseListQuery(sp, defaults);

  function patch(next: Partial<ListQuery>) {
    setSp((prev) => {
      return nextListSearchParams(prev, query, next, defaults);
    });
  }

  return { query, patch };
}

export function parseListQuery(sp: URLSearchParams, defaults?: Partial<ListQuery>): ListQuery {
  return {
    page: readInt(sp.get("page"), defaults?.page ?? 0, 0),
    size: readInt(sp.get("size"), defaults?.size ?? 6, 6),
    q: sp.get("q") ?? defaults?.q ?? "",
    sort: sp.get("sort") ?? defaults?.sort ?? "createdAt,desc",
  };
}

export function nextListSearchParams(
  prev: URLSearchParams,
  current: ListQuery,
  next: Partial<ListQuery>,
  defaults?: Partial<ListQuery>
): URLSearchParams {
  const out = new URLSearchParams(prev);
  const merged = { ...current, ...next };
  if (merged.page > 0) out.set("page", String(merged.page));
  else out.delete("page");
  if (merged.size !== (defaults?.size ?? 6)) out.set("size", String(merged.size));
  else out.delete("size");
  if (merged.q.trim()) out.set("q", merged.q.trim());
  else out.delete("q");
  if (merged.sort && merged.sort !== (defaults?.sort ?? "createdAt,desc")) out.set("sort", merged.sort);
  else out.delete("sort");
  return out;
}
