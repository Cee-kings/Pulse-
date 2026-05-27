/**
 * LocalShelbyAdapter
 *
 * Simulates the Shelby distributed blob-storage SDK using:
 *   • localStorage  — persistent blob store (survives page refresh)
 *   • Map<>         — in-memory LRU-like cache with TTL
 *
 * Replace this file (and the import in index.ts) to use the real Shelby SDK.
 */

import type {
  IShelbyClient,
  ShelbyBlob,
  ShelbyMeta,
  ShelbyNetworkStats,
  ShelbyPublishReceipt,
  ShelbyQuery,
  ShelbyRetrievalTrace,
} from "./types";

// ── Constants ─────────────────────────────────────────────────────────────────

const BLOB_PREFIX  = "shelby:blob:";
const INDEX_KEY    = "shelby:index";
const DRAFT_PREFIX = "shelby:draft:";
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/** Simulated stable node ID for this browser session */
const LOCAL_NODE_ID = (() => {
  const stored = localStorage.getItem("shelby:nodeId");
  if (stored) return stored;
  const id = "node-" + randomHex(8);
  localStorage.setItem("shelby:nodeId", id);
  return id;
})();

// ── Helpers ───────────────────────────────────────────────────────────────────

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function generateBlobId(): string {
  return "blob_" + randomHex(8);
}

/** Deterministic-looking hash from a string */
function hashContent(str: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  // Extend to 40-char hex-like string
  const base = h.toString(16).padStart(8, "0");
  return (base + base + base + base + base).slice(0, 40);
}

function byteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

// ── Cache Entry ───────────────────────────────────────────────────────────────

interface CacheEntry<T> {
  blob: ShelbyBlob<T>;
  expiresAt: number;
}

// ── Adapter ───────────────────────────────────────────────────────────────────

export class LocalShelbyAdapter implements IShelbyClient {
  private cache = new Map<string, CacheEntry<unknown>>();

  // ── Index ────────────────────────────────────────────────────────

  private readIndex(): string[] {
    try {
      const raw = localStorage.getItem(INDEX_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  }

  private writeIndex(ids: string[]): void {
    localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
  }

  private addToIndex(blobId: string): void {
    const ids = this.readIndex();
    if (!ids.includes(blobId)) {
      this.writeIndex([blobId, ...ids]);
    }
  }

  private removeFromIndex(blobId: string): void {
    this.writeIndex(this.readIndex().filter((id) => id !== blobId));
  }

  // ── Raw localStorage blob I/O ────────────────────────────────────

  private readBlob<T>(blobId: string): ShelbyBlob<T> | null {
    try {
      const raw = localStorage.getItem(BLOB_PREFIX + blobId);
      return raw ? (JSON.parse(raw) as ShelbyBlob<T>) : null;
    } catch {
      return null;
    }
  }

  private writeBlob<T>(blob: ShelbyBlob<T>): void {
    localStorage.setItem(BLOB_PREFIX + blob.blobId, JSON.stringify(blob));
  }

  // ── Cache helpers ────────────────────────────────────────────────

  private fromCache<T>(blobId: string): ShelbyBlob<T> | null {
    const entry = this.cache.get(blobId) as CacheEntry<T> | undefined;
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(blobId);
      return null;
    }
    return entry.blob;
  }

  private toCache<T>(blob: ShelbyBlob<T>): void {
    this.cache.set(blob.blobId, {
      blob: blob as ShelbyBlob<unknown>,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
  }

  // ── IShelbyClient: Core ──────────────────────────────────────────

  put<T>(content: T, meta: ShelbyMeta = {}): ShelbyPublishReceipt {
    const now      = new Date().toISOString();
    const blobId   = generateBlobId();
    const serial   = JSON.stringify(content);
    const hash     = hashContent(serial);
    const size     = byteSize(serial);

    const blob: ShelbyBlob<T> = {
      blobId,
      content,
      meta,
      createdAt: now,
      updatedAt: now,
      nodeId: LOCAL_NODE_ID,
      contentHash: hash,
      size,
    };

    this.writeBlob(blob);
    this.addToIndex(blobId);
    this.toCache(blob);

    return { blobId, contentHash: hash, nodeId: LOCAL_NODE_ID, publishedAt: now, size, acknowledged: true };
  }

  get<T>(blobId: string): ShelbyBlob<T> | null {
    const cached = this.fromCache<T>(blobId);
    if (cached) return cached;
    const blob = this.readBlob<T>(blobId);
    if (blob) this.toCache(blob);
    return blob;
  }

  list<T>(query?: ShelbyQuery): ShelbyBlob<T>[] {
    const ids = this.readIndex();
    const limit = query?.limit ?? ids.length;
    const results: ShelbyBlob<T>[] = [];

    for (const id of ids) {
      if (results.length >= limit) break;
      const blob = this.get<T>(id);
      if (!blob) continue;
      if (query?.meta) {
        const match = Object.entries(query.meta).every(
          ([k, v]) => blob.meta[k] === v
        );
        if (!match) continue;
      }
      results.push(blob);
    }
    return results;
  }

  delete(blobId: string): void {
    localStorage.removeItem(BLOB_PREFIX + blobId);
    this.removeFromIndex(blobId);
    this.cache.delete(blobId);
  }

  patchMeta(blobId: string, meta: ShelbyMeta): void {
    const blob = this.readBlob(blobId);
    if (!blob) return;
    const updated = {
      ...blob,
      meta: { ...blob.meta, ...meta },
      updatedAt: new Date().toISOString(),
    };
    this.writeBlob(updated);
    this.toCache(updated);
  }

  // ── IShelbyClient: Draft ─────────────────────────────────────────

  setDraft<T>(key: string, value: T): void {
    const now = new Date().toISOString();
    localStorage.setItem(
      DRAFT_PREFIX + key,
      JSON.stringify({ value, savedAt: now })
    );
  }

  getDraft<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(DRAFT_PREFIX + key);
      if (!raw) return null;
      return (JSON.parse(raw) as { value: T }).value;
    } catch {
      return null;
    }
  }

  clearDraft(key: string): void {
    localStorage.removeItem(DRAFT_PREFIX + key);
  }

  // ── IShelbyClient: Network simulation ───────────────────────────

  getNetworkStats(): ShelbyNetworkStats {
    const blobs  = this.readIndex().length;
    // Stable-ish numbers seeded from the nodeId so they feel "real"
    const seed   = parseInt(LOCAL_NODE_ID.slice(-4), 16);
    return {
      nodes:        12 + (seed % 7),
      blobs:        blobs + 128 + (seed % 40),
      peers:        3 + (seed % 4),
      latencyMs:    8 + (seed % 24),
      cacheHitRate: Math.min(0.98, 0.72 + blobs * 0.04),
      uptime:       "99.94%",
    };
  }

  buildRetrievalTrace(blobId: string, fromCache: boolean): ShelbyRetrievalTrace {
    const seed = parseInt(blobId.slice(-4), 16) || 0;
    const respondingNode = "node-" + blobId.slice(5, 13);

    const steps = fromCache
      ? [
          { label: "Memory cache hit",          ms: 0,          status: "ok" as const },
          { label: "Content hash verified",      ms: 1,          status: "ok" as const },
          { label: "Serving from local cache",   ms: 0,          status: "ok" as const },
        ]
      : [
          { label: "Broadcasting to peer network",             ms: 40 + (seed % 30), status: "ok" as const },
          { label: `${respondingNode} responded`,              ms: 12 + (seed % 20), status: "ok" as const },
          { label: "Verifying content hash",                   ms: 3  + (seed % 8),  status: "ok" as const },
          { label: "Decrypting blob payload",                  ms: 6  + (seed % 12), status: "ok" as const },
          { label: "Integrity confirmed",                      ms: 1,                status: "ok" as const },
        ];

    const totalMs = steps.reduce((s, step) => s + step.ms, 0);
    return { blobId, steps, totalMs, fromCache, nodeId: fromCache ? LOCAL_NODE_ID : respondingNode };
  }
}

// ── Legacy migration ───────────────────────────────────────────────────────────
/**
 * One-time migration: if old pulse_published_posts key exists, import each
 * post as a proper Shelby blob so the new adapter sees them.
 */
export function migrateFromLegacyStorage(adapter: LocalShelbyAdapter): void {
  const LEGACY_KEY = "pulse_published_posts";
  try {
    const raw = localStorage.getItem(LEGACY_KEY);
    if (!raw) return;
    const wrapper = JSON.parse(raw) as { value?: unknown };
    const posts = (wrapper.value ?? JSON.parse(raw)) as Array<Record<string, unknown>>;
    if (!Array.isArray(posts) || posts.length === 0) return;
    // Only migrate if we don't already have blobs (avoid double-import)
    const existing = adapter.list({ meta: { type: "post" } });
    if (existing.length > 0) return;
    for (const post of posts) {
      const blobId = (post.blobId as string) || "blob_" + Math.random().toString(16).slice(2, 10);
      // Manually inject to keep original blobId
      const serial = JSON.stringify(post);
      const blob = {
        blobId,
        content: post,
        meta: {
          type: "post",
          authorWalletId: (post.authorWalletId as string) ?? "",
        },
        createdAt: (post.publishedAt as string) ?? new Date().toISOString(),
        updatedAt: (post.publishedAt as string) ?? new Date().toISOString(),
        nodeId: "node-migrated",
        contentHash: blobId.slice(5),
        size: serial.length,
      };
      localStorage.setItem("shelby:blob:" + blobId, JSON.stringify(blob));
    }
    // Rebuild index
    const existingIds = (() => {
      try {
        const idx = localStorage.getItem("shelby:index");
        return idx ? (JSON.parse(idx) as string[]) : [];
      } catch { return []; }
    })();
    const migratedIds = posts.map((p) => (p.blobId as string) || "").filter(Boolean);
    const merged = [...new Set([...migratedIds, ...existingIds])];
    localStorage.setItem("shelby:index", JSON.stringify(merged));
    // Remove legacy key after successful migration
    localStorage.removeItem(LEGACY_KEY);
    console.info(`[Shelby] Migrated ${posts.length} legacy post(s) to blob store.`);
  } catch (e) {
    console.warn("[Shelby] Legacy migration failed silently", e);
  }
}
