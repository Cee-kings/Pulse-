import type { IShelbyClient } from "./types";

const API_BASE = "/api";

const adapter: IShelbyClient = {
  async put(key: string, data: Uint8Array, meta?: Record<string, string>) {
    const res = await fetch(`${API_BASE}/blobs/${encodeURIComponent(key)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/octet-stream", ...meta },
      body: data,
    });
    if (!res.ok) throw new Error(`PUT failed: ${res.status}`);
    return res.json();
  },
  async get(key: string) {
    const res = await fetch(`${API_BASE}/blobs/${encodeURIComponent(key)}`);
    if (!res.ok) throw new Error(`GET failed: ${res.status}`);
    return res.json();
  },
  async delete(key: string) {
    const res = await fetch(`${API_BASE}/blobs/${encodeURIComponent(key)}`, { method: "DELETE" });
    if (!res.ok) throw new Error(`DELETE failed: ${res.status}`);
  },
  async list(prefix?: string) {
    const url = prefix ? `${API_BASE}/blobs?prefix=${encodeURIComponent(prefix)}` : `${API_BASE}/blobs`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`LIST failed: ${res.status}`);
    return res.json();
  },
  async exists(key: string) {
    const res = await fetch(`${API_BASE}/blobs/${encodeURIComponent(key)}`, { method: "HEAD" });
    return res.ok;
  },
};

export const shelby: IShelbyClient = adapter;

export type { IShelbyClient } from "./types";
export type {
  ShelbyBlob,
  ShelbyMeta,
  ShelbyPublishReceipt,
  ShelbyRetrievalTrace,
  ShelbyRetrievalStep,
  ShelbyNetworkStats,
  ShelbyQuery,
} from "./types";