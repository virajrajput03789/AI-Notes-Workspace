import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface Note {
  _id: string;
  userId: string;
  title: string;
  content: string;
  tags: string[];
  category: string;
  isArchived: boolean;
  isPublic: boolean;
  shareId?: string;
  aiSummary?: string;
  aiActionItems?: string[];
  aiSuggestedTitle?: string;
  aiGeneratedAt?: string;
  createdAt: string;
  updatedAt: string;
}

interface FetchNotesParams {
  search?: string;
  tag?: string;
  sort?: string;
  archived?: boolean;
}

export function useNotes(params: FetchNotesParams = {}) {
  const queryParams = new URLSearchParams();
  if (params.search) queryParams.append("search", params.search);
  if (params.tag) queryParams.append("tag", params.tag);
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.archived !== undefined) queryParams.append("archived", String(params.archived));

  const queryKey = ["notes", params];

  const query = useQuery({
    queryKey,
    queryFn: () => api.get<{ notes: Note[] }>(`/notes?${queryParams.toString()}`),
  });

  return { ...query, queryKey };
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Note>) => api.post<{ note: Note }>("/notes", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}
