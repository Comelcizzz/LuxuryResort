import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecommendedServiceDto } from "@/types/api";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type Props = {
  authenticated: boolean;
  items: RecommendedServiceDto[] | undefined;
  isLoading: boolean;
};

export function RecommendedServices({ authenticated, items, isLoading }: Props) {
  const reduceMotion = useReducedMotion();

  if (!authenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <p className="mt-10 text-sm text-slate-custom" data-testid="rec-loading">
        Завантаження рекомендацій…
      </p>
    );
  }

  const list = items ?? [];

  if (list.length === 0) {
    return (
      <Card className="mt-10" data-testid="rec-empty">
        <CardHeader>
          <CardTitle>Рекомендовані послуги</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-custom">Поки немає персональних рекомендацій.</p>
        </CardContent>
      </Card>
    );
  }

  const wrap = (node: ReactNode) =>
    reduceMotion ? (
      node
    ) : (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      >
        {node}
      </motion.div>
    );

  return wrap(
    <Card className="mt-10" data-testid="rec-list">
      <CardHeader>
        <CardTitle>Рекомендовані послуги</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {list.map((r) => (
          <Button key={r.id} variant="outline" size="sm" asChild>
            <Link to={`/services/${r.id}`}>{r.name}</Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
