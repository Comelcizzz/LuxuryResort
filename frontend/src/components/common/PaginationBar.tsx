import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  /** Нульова сторінка */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

export function PaginationBar({ page, totalPages, onPageChange, className }: Props) {
  if (totalPages <= 1) return null;
  const start = Math.max(0, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  const pages = Array.from({ length: end - start + 1 }, (_, idx) => start + idx);
  return (
    <div className={cn("mt-6 flex flex-wrap items-center justify-center gap-3", className)}>
      <Button variant="outline" size="sm" type="button" disabled={page <= 0} onClick={() => onPageChange(page - 1)}>
        Назад
      </Button>
      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? "gold" : "outline"}
          size="sm"
          type="button"
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </Button>
      ))}
      <span className="text-sm text-slate-custom">
        Сторінка {page + 1} з {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        type="button"
        disabled={page >= totalPages - 1}
        onClick={() => onPageChange(page + 1)}
      >
        Далі
      </Button>
    </div>
  );
}
