import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface InsightData {
  totalNotes: number;
  archivedNotes: number;
  recentNotes: { _id: string; title: string; updatedAt: string }[];
  topTags: { tag: string; count: number }[];
  aiUsage: number;
  weeklyActivity: { date: string; count: number }[];
}

export function useInsights() {
  return useQuery({
    queryKey: ["insights"],
    queryFn: () => api.get<InsightData>("/insights"),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
