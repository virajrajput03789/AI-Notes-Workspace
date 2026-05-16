import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Note } from "./useNotes";

export function useNote(id: string) {
  const queryKey = ["note", id];

  const query = useQuery({
    queryKey,
    queryFn: () => api.get<{ note: Note }>(`/notes/${id}`),
    enabled: !!id,
  });

  return { ...query, queryKey };
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Note> }) =>
      api.patch<{ note: Note }>(`/notes/${id}`, data),
    onSuccess: (data, variables) => {
      queryClient.setQueryData(["note", variables.id], data);
      queryClient.invalidateQueries({ queryKey: ["notes"] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ message: string }>(`/notes/${id}`),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ["note", id] });
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      queryClient.invalidateQueries({ queryKey: ["insights"] });
    },
  });
}

export function useGenerateSummary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.post<{ note: Note; ai: any }>(`/notes/${id}/generate-summary`),
    onSuccess: (data, id) => {
      queryClient.setQueryData(["note", id], { note: data.note });
    },
  });
}
