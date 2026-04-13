import type { CanvasState } from "@/types/tactic";

const STORAGE_KEY = "kadrokur_tactics_v1";

export interface StoredTactic {
  id: string;
  title: string;
  share_id: string;
  canvas_state: CanvasState;
  updated_at: string;
}

/** SSR veya Node’un deneysel/bozuk localStorage’ında getItem fonksiyon olmayabiliyor. */
function getBrowserLocalStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  try {
    const ls = window.localStorage;
    if (
      !ls ||
      typeof ls.getItem !== "function" ||
      typeof ls.setItem !== "function"
    ) {
      return null;
    }
    return ls;
  } catch {
    return null;
  }
}

function readAll(): StoredTactic[] {
  const ls = getBrowserLocalStorage();
  if (!ls) return [];
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredTactic[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(items: StoredTactic[]) {
  const ls = getBrowserLocalStorage();
  if (!ls) return;
  try {
    ls.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota / private mode */
  }
}

export function listLocalTactics(): StoredTactic[] {
  return readAll().sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  );
}

export function getLocalTacticById(id: string): StoredTactic | undefined {
  return readAll().find((t) => t.id === id);
}

export function getLocalTacticByShareId(
  shareId: string
): StoredTactic | undefined {
  return readAll().find((t) => t.share_id === shareId);
}

export function upsertLocalTactic(tactic: StoredTactic): void {
  const all = readAll();
  const i = all.findIndex((t) => t.id === tactic.id);
  if (i >= 0) all[i] = tactic;
  else all.push(tactic);
  writeAll(all);
}
