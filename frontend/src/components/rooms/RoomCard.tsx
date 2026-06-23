import { formatCurrency } from "@/lib/formatters";
import { roomStatusLabelUk } from "@/lib/labels";
import type { RoomResponse } from "@/types/api";
import type { RoomStatus } from "@/types/domain";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const STATUS_BADGE: Record<RoomStatus, string> = {
  AVAILABLE: "bg-emerald-500/90 text-white",
  OCCUPIED: "bg-amber-500/90 text-navy",
  MAINTENANCE: "bg-slate-500/90 text-white",
  RESERVED: "bg-blue-500/90 text-white",
};

export function RoomCard({ room }: { room: RoomResponse }) {
  const img = room.images[0] ?? "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";
  const status = room.status as RoomStatus;
  const statusBadge = STATUS_BADGE[status] ?? "bg-navy/70 text-white";

  return (
    <motion.div
      className="h-full"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
    >
      <Link
        to={`/rooms/${room.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-md"
      >
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden">
          <img
            src={img}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
          <div className="absolute bottom-4 left-4 rounded-md bg-gold px-3 py-1 text-sm font-semibold text-navy shadow">
            {formatCurrency(Number(room.basePricePerNight))} / ніч
          </div>
          <div className="absolute right-4 top-4 flex flex-col items-end gap-1">
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide shadow ${statusBadge}`}
            >
              {roomStatusLabelUk(status)}
            </span>
            <span className="rounded-full bg-white/90 px-2 py-1 text-xs font-medium text-navy shadow">
              ★ {room.avgRating}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 min-h-[3.25rem] font-display text-xl font-semibold leading-snug">
            {room.name}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[2.75rem] flex-1 text-sm text-slate-custom">
            {room.description ?? ""}
          </p>
          <span className="mt-3 inline-flex text-sm font-medium text-gold">Детальніше →</span>
        </div>
      </Link>
    </motion.div>
  );
}
