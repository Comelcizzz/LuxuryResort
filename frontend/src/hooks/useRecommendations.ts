import { fetchRecommendations } from "@/api/endpoints/services.api";
import { useQuery } from "@tanstack/react-query";

export function useRecommendations(enabled = true) {
  return useQuery({
    queryKey: ["recommendations"],
    queryFn: () => fetchRecommendations(),
    enabled,
  });
}
