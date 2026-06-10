/**
 * shelbyStorage — legacy raw key/value store.
 *
 * ⚠️  This module is now superseded by src/lib/shelby/ (the Shelby client layer).
 *
 * It is kept only as the low-level persistence primitive used by LocalShelbyAdapter
 * and for any code that hasn't been migrated yet.  New code should import from
 * src/lib/shelby/index.ts and use the IShelbyClient interface instead.
 */

export type StorageKey = string;

export interface StorageItem<T = unknown> {
  key: StorageKey;
  value: T;
  createdAt: string;
  updatedAt: string;
}

function now(): string {
  return new Date().toISOString();
}

export const shelbyStorage = {
  get<T>(key: StorageKey): T | null {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const item = JSON.parse(raw) as StorageItem<T>;
      return item.value;
    } catch { return null; }
  },

  set<T>(key: StorageKey, value: T): void {
    try {
      const existing = localStorage.getItem(key);
      const createdAt = existing
        ? (JSON.parse(existing) as StorageItem<T>).createdAt
        : now();
      localStorage.setItem(key, JSON.stringify({ key, value, createdAt, updatedAt: now() }));
    } catch { console.warn(`[shelbyStorage] Failed to set "${key}"`); }
  },

  remove(key: StorageKey): void {
    try { localStorage.removeItem(key); }
    catch { console.warn(`[shelbyStorage] Failed to remove "${key}"`); }
  },

  keys(): StorageKey[] {
    try { return Object.keys(localStorage); }
    catch { return []; }
  },
};

export default shelbyStorage;
