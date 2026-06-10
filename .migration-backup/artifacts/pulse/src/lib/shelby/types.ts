/**
 * Shelby SDK Type Definitions
 *
 * This file defines the public interface for the Shelby distributed storage SDK.
 * The local-adapter.ts provides a localStorage simulation of this interface.
 *
 * To swap in the real Shelby SDK:
 *   1. Implement IShelbyClient against the real SDK
 *   2. Change the import in src/lib/shelby/index.ts
 *   3. Everything above this layer is unchanged
 *
 * NOTE: All IShelbyClient methods are sync in the local simulation.
 *       The real SDK will make them async — update postStorage.ts accordingly.
 */

// ── Blob ───────────────────────────────────────────────────────────────────────

/** Arbitrary key/value metadata stored alongside a blob. */
export type ShelbyMeta = Record<string, string | number | boolean>;

/** A content blob as stored and retrieved from the Shelby network. */
export interface ShelbyBlob<T = unknown> {
  /** Globally unique content-addressed identifier, e.g. `blob_a3f7c2...` */
  blobId: string;
  /** The serialisable payload */
  content: T;
  /** Caller-supplied metadata (queryable) */
  meta: ShelbyMeta;
  /** ISO timestamp of first publication */
  createdAt: string;
  /** ISO timestamp of last metadata update */
  updatedAt: string;
  // ── Simulated distributed-network fields ──────────────────────────────────
  /** ID of the node that first accepted this blob */
  nodeId: string;
  /** SHA-256-like hex fingerprint of the serialised content */
  contentHash: string;
  /** Payload size in bytes */
  size: number;
}

// ── Receipts & Events ─────────────────────────────────────────────────────────

/** Returned by shelby.put() after a blob is successfully persisted. */
export interface ShelbyPublishReceipt {
  blobId: string;
  contentHash: string;
  nodeId: string;
  publishedAt: string;
  size: number;
  /** True once at least one peer has acknowledged the blob */
  acknowledged: boolean;
}

/** One step in a simulated distributed retrieval trace. */
export interface ShelbyRetrievalStep {
  label: string;
  /** Simulated duration in milliseconds */
  ms: number;
  status: "pending" | "ok" | "error";
}

/** Full trace of a blob retrieval from the network. */
export interface ShelbyRetrievalTrace {
  blobId: string;
  steps: ShelbyRetrievalStep[];
  totalMs: number;
  /** True if the blob was served from the memory cache */
  fromCache: boolean;
  /** Node that served the blob */
  nodeId: string;
}

// ── Network Stats ─────────────────────────────────────────────────────────────

/** Live statistics from the Shelby network (simulated). */
export interface ShelbyNetworkStats {
  nodes: number;
  blobs: number;
  peers: number;
  latencyMs: number;
  cacheHitRate: number;
  uptime: string;
}

// ── Query ─────────────────────────────────────────────────────────────────────

export interface ShelbyQuery {
  /** Filter blobs whose meta contains all provided key/value pairs */
  meta?: ShelbyMeta;
  limit?: number;
}

// ── Client Interface ──────────────────────────────────────────────────────────

/**
 * IShelbyClient — the contract every Shelby adapter must satisfy.
 *
 * SWAP POINT: Replace LocalShelbyAdapter with a class that implements this
 * interface using the real Shelby SDK.
 */
export interface IShelbyClient {
  // ── Core blob operations ─────────────────────────────────────────
  /** Serialise and store content; returns a publish receipt. */
  put<T>(content: T, meta?: ShelbyMeta): ShelbyPublishReceipt;
  /** Retrieve a blob by ID (cache-first). Returns null if not found. */
  get<T>(blobId: string): ShelbyBlob<T> | null;
  /** List all blobs matching an optional query. */
  list<T>(query?: ShelbyQuery): ShelbyBlob<T>[];
  /** Permanently delete a blob. */
  delete(blobId: string): void;
  /** Merge additional metadata onto an existing blob (non-destructive). */
  patchMeta(blobId: string, meta: ShelbyMeta): void;

  // ── Draft / staging ──────────────────────────────────────────────
  /** Store a mutable draft value (not a blob — no ID, fully replaceable). */
  setDraft<T>(key: string, value: T): void;
  getDraft<T>(key: string): T | null;
  clearDraft(key: string): void;

  // ── Network simulation ───────────────────────────────────────────
  getNetworkStats(): ShelbyNetworkStats;
  /**
   * Build a simulated retrieval trace for display purposes.
   * In the real SDK this would return actual peer-routing metadata.
   */
  buildRetrievalTrace(blobId: string, fromCache: boolean): ShelbyRetrievalTrace;
}
