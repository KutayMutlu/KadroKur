"use client";

import { useEffect } from "react";

export function useUndoRedoHotkeys(
  editingId: string | null,
  onUndo: () => void,
  onRedo: () => void
) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (editingId) return;
      const isUndo = (e.ctrlKey || e.metaKey) && !e.shiftKey && e.key.toLowerCase() === "z";
      const isRedo =
        (e.ctrlKey || e.metaKey) &&
        (e.key.toLowerCase() === "y" || (e.shiftKey && e.key.toLowerCase() === "z"));
      if (isUndo) {
        e.preventDefault();
        onUndo();
      } else if (isRedo) {
        e.preventDefault();
        onRedo();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [editingId, onRedo, onUndo]);
}
