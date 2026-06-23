import { describe, expect, it } from "vitest";
import { nextListSearchParams, parseListQuery, type ListQuery } from "./listQuery";

describe("listQuery helpers", () => {
  it("parses defaults when params absent", () => {
    const sp = new URLSearchParams();
    const q = parseListQuery(sp, { size: 12, sort: "name,asc" });
    expect(q).toEqual({ page: 0, size: 12, q: "", sort: "name,asc" });
  });

  it("builds next search params and removes defaults", () => {
    const current: ListQuery = { page: 0, size: 20, q: "", sort: "createdAt,desc" };
    const next = nextListSearchParams(new URLSearchParams(), current, { page: 2, q: "spa" }, { size: 20 });
    expect(next.get("page")).toBe("2");
    expect(next.get("q")).toBe("spa");
    expect(next.get("size")).toBeNull();
    expect(next.get("sort")).toBeNull();
  });
});
