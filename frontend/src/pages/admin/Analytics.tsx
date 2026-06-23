import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PageTransition } from "@/components/common/PageTransition";
import { useAdminDashboard, useOccupancyForecast, useRoomSentiment } from "@/hooks/useAdmin";
import { formatCurrency } from "@/lib/formatters";
import { bookingStatusLabelUk } from "@/lib/labels";
import type { OccupancyForecastDto } from "@/types/api";
import { BookingStatus } from "@/types/domain";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  Legend,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statusLabels: Record<string, string> = {
  [BookingStatus.PENDING]: bookingStatusLabelUk(BookingStatus.PENDING),
  [BookingStatus.CONFIRMED]: bookingStatusLabelUk(BookingStatus.CONFIRMED),
  [BookingStatus.CHECKED_IN]: bookingStatusLabelUk(BookingStatus.CHECKED_IN),
  [BookingStatus.CHECKED_OUT]: bookingStatusLabelUk(BookingStatus.CHECKED_OUT),
  [BookingStatus.CANCELLED]: bookingStatusLabelUk(BookingStatus.CANCELLED),
  [BookingStatus.NO_SHOW]: bookingStatusLabelUk(BookingStatus.NO_SHOW),
};

function mergeOccupancyTrend(history: OccupancyForecastDto[], scheduled: OccupancyForecastDto[]) {
  const byDate = new Map<string, { day: string; actual: number | null; pipeline: number | null }>();

  for (const row of history) {
    const rate = Number(row.predictedOccupancyRate) * 100;
    byDate.set(row.date, {
      day: row.date.slice(5),
      actual: rate,
      pipeline: byDate.get(row.date)?.pipeline ?? null,
    });
  }

  for (const row of scheduled) {
    const rate = Number(row.predictedOccupancyRate) * 100;
    const prev = byDate.get(row.date);
    byDate.set(row.date, {
      day: row.date.slice(5),
      actual: prev?.actual ?? null,
      pipeline: rate,
    });
  }

  return [...byDate.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, point]) => point);
}

export function Analytics() {
  const dash = useAdminDashboard();
  const occ = useOccupancyForecast();
  const sent = useRoomSentiment();

  if (dash.isLoading || occ.isLoading) {
    return (
      <div className="flex justify-center py-24">
        <LoadingSpinner />
      </div>
    );
  }
  if (!dash.data) return <p className="text-error">Немає даних</p>;

  const revenueRows = [...dash.data.revenueByMonth]
    .reverse()
    .map((r) => ({
      label: `${r.month}/${r.year}`,
      revenue: Number(r.revenue),
    }));

  const statusRows = Object.entries(dash.data.bookingsByStatus).map(([k, v]) => ({
    name: statusLabels[k] ?? k,
    count: v ?? 0,
  }));

  const forecastRows =
    occ.data != null ? mergeOccupancyTrend(occ.data.history, occ.data.scheduled) : [];

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold text-navy">Аналітика</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-navy/10 bg-navy p-5 text-cream shadow">
          <p className="text-xs uppercase text-gold">Дохід (оплачено)</p>
          <p className="mt-2 font-display text-2xl">{formatCurrency(Number(dash.data.totalRevenue))}</p>
        </div>
        <div className="rounded-xl border border-navy/10 bg-white p-5 shadow">
          <p className="text-xs uppercase text-slate-custom">Зайнятість сьогодні</p>
          <p className="mt-2 font-display text-2xl text-navy">
            {(Number(dash.data.occupancyRate) * 100).toFixed(1)}%
          </p>
        </div>
        <div className="rounded-xl border border-navy/10 bg-white p-5 shadow">
          <p className="text-xs uppercase text-slate-custom">Топ-кімната за доходом</p>
          <p className="mt-2 font-semibold text-navy">{dash.data.topRooms[0]?.roomName ?? "—"}</p>
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="h-72 rounded-xl border border-navy/10 bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm font-semibold text-navy">Дохід по місяцях</p>
          <ResponsiveContainer width="100%" height="90%">
            <AreaChart data={revenueRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(v: number) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke="#C9A96E" fill="#E8D5B0" name="Дохід" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="h-72 rounded-xl border border-navy/10 bg-white p-4 shadow-sm">
          <p className="mb-2 text-sm font-semibold text-navy">Бронювання за статусом</p>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={statusRows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#0D1B2A" name="Кількість" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-10 rounded-xl border border-amber-200/80 bg-amber-50/60 p-4 text-sm text-navy">
        <p className="font-medium">Як читати ці графіки</p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-slate-custom">
          <li>
            <strong>Дохід по місяцях</strong> — уже отримані оплати за бронювання (минуле), не прогноз прибутку.
          </li>
          <li>
            <strong>Зайнятість нижче</strong> — частка номерів (без «На обслуговуванні»), зайнятих у конкретний день.
          </li>
          <li>Золота лінія — <strong>факт</strong> за останні 14 днів (підтверджені/заїхали/виїхали).</li>
          <li>Світла пунктирна — <strong>заплановано</strong> на 14 днів вперед (бронювання, включно з «Очікує»).</li>
          <li>Це не машинне навчання і не відповідь «чи піде прибуток» — лише завантаженість готелю.</li>
        </ul>
      </div>

      <div className="mt-10 h-80 rounded-xl border border-navy/10 bg-navy p-4 text-cream shadow-sm">
        <p className="mb-2 text-sm font-semibold text-gold">Зайнятість: минуле та заплановане</p>
        <p className="mb-2 text-xs text-cream/60">
          Факт (14 днів) і очікувана завантаженість за вже створеними бронюваннями (14 днів вперед).
        </p>
        <ResponsiveContainer width="100%" height="85%">
          <LineChart data={forecastRows}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff33" />
            <XAxis dataKey="day" stroke="#E8D5B0" tick={{ fill: "#E8D5B0", fontSize: 11 }} />
            <YAxis stroke="#E8D5B0" tick={{ fill: "#E8D5B0", fontSize: 11 }} unit="%" domain={[0, 100]} />
            <Tooltip
              contentStyle={{ background: "#0D1B2A", border: "1px solid #C9A96E" }}
              formatter={(v: number) => `${v.toFixed(1)}%`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              name="Фактична зайнятість"
              stroke="#C9A96E"
              strokeWidth={2}
              dot={false}
              connectNulls
            />
            <Line
              type="monotone"
              dataKey="pipeline"
              name="За бронюваннями"
              stroke="#E8D5B0"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {sent.data && sent.data.length > 0 && (
        <div className="mt-10 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
          <h2 className="font-display text-xl font-semibold">Тональність відгуків по кімнатах</h2>
          <ul className="mt-4 space-y-2">
            {sent.data.map((r) => (
              <li key={r.roomId} className="flex justify-between text-sm">
                <span>{r.roomName}</span>
                <span className="font-medium text-gold">{Number(r.averageSentiment).toFixed(3)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PageTransition>
  );
}
