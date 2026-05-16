import { useEffect, useRef, useState } from "react";
import { useUpdateNote } from "./useNote";

export function useAutoSave(id: string, delay: number = 1500) {
  const updateNote = useUpdateNote();
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const isFirstRender = useRef(true);

  const save = async (data: any) => {
    setSaveStatus("saving");
    try {
      await updateNote.mutateAsync({ id, data });
      setSaveStatus("saved");
      setTimeout(() => {
        setSaveStatus((current) => (current === "saved" ? "idle" : current));
      }, 2000);
    } catch (error) {
      setSaveStatus("error");
    }
  };

  return { save, saveStatus, isFirstRender };
}
