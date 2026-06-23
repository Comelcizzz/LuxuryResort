import { fetchReviews } from "@/api/endpoints/services.api";
import { useQuery } from "@tanstack/react-query";

export function useReviewsList(params: {
  roomId?: string;
  approved?: boolean;
  q?: string;
  ratingMin?: number;
  ratingMax?: number;
  from?: string;
  to?: string;
  sort?: string;
  page?: number;
  size?: number;
}) {
  return useQuery({
    queryKey: ["reviews", "list", params],
    queryFn: () =>
      fetchReviews({
        roomId: params.roomId,
        approved: params.approved,
        q: params.q,
        ratingMin: params.ratingMin,
        ratingMax: params.ratingMax,
        from: params.from,
        to: params.to,
        sort: params.sort,
        page: params.page ?? 0,
        size: params.size ?? 20,
      }),
  });
}
