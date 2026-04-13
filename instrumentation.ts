/**
 * Node bazen `--localstorage-file` vb. ile bozuk bir `globalThis.localStorage` bırakır:
 * nesne vardır ama `getItem` fonksiyon değildir. Next.js dev overlay (react-dev-overlay)
 * `typeof localStorage !== "undefined"` ile geçip `getItem` çağırır ve çöker.
 * Yalnızca geçersiz depolamayı bellek tabanlı Storage ile değiştiririz.
 */
function createMemoryStorage(): Storage {
  const mem = new Map<string, string>();
  return {
    get length() {
      return mem.size;
    },
    clear: () => {
      mem.clear();
    },
    getItem: (key: string) => mem.get(key) ?? null,
    key: (index: number) => Array.from(mem.keys())[index] ?? null,
    removeItem: (key: string) => {
      mem.delete(key);
    },
    setItem: (key: string, value: string) => {
      mem.set(key, value);
    },
  } as Storage;
}

function patchBrokenLocalStorage(): void {
  if (process.env.NEXT_RUNTIME === "edge") return;

  try {
    if (!("localStorage" in globalThis)) return;

    const current = globalThis.localStorage as Storage | null | undefined;
    if (
      current &&
      typeof current.getItem === "function" &&
      typeof current.setItem === "function"
    ) {
      return;
    }

    Object.defineProperty(globalThis, "localStorage", {
      value: createMemoryStorage(),
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    /* ignore */
  }
}

export function register(): void {
  patchBrokenLocalStorage();
}
