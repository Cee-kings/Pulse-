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
    } catch {
      return null;
    }
  },

  set<T>(key: StorageKey, value: T): void {
    try {
      const existing = localStorage.getItem(key);
      const createdAt = existing
        ? (JSON.parse(existing) as StorageItem<T>).createdAt
        : now();
      const item: StorageItem<T> = {
        key,
        value,
        createdAt,
        updatedAt: now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch {
      console.warn(`[shelbyStorage] Failed to set key "${key}"`);
    }
  },

  remove(key: StorageKey): void {
    try {
      localStorage.removeItem(key);
    } catch {
      console.warn(`[shelbyStorage] Failed to remove key "${key}"`);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch {
      console.warn("[shelbyStorage] Failed to clear storage");
    }
  },

  keys(): StorageKey[] {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  },
};

export default shelbyStorage;
