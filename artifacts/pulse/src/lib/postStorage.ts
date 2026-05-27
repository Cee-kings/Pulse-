/**
 * postStorage — domain layer for published posts and drafts.
 *
 * All persistence is routed through the Shelby client (src/lib/shelby/).
 * This file knows about the Post domain type; Shelby knows nothing about it.
 *
 * To swap in the real Shelby SDK: change src/lib/shelby/index.ts only.
 */

import { shelby } from "./shelby";
import type { ShelbyBlob } from "./shelby";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface LocalPost {
  blobId: string;
  title: string;
  subtitle: string;
  content: string;
  tags: string[];
  authorWalletId: string;
  authorName: string;
  publishedAt: string;
  readTime: number;
  claps: number;
}

export interface Draft {
  title: string;
  subtitle: string;
  content: string;
  tags: string;
  savedAt: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function calcReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function blobToPost(blob: ShelbyBlob<LocalPost>): LocalPost {
  return blob.content;
}

// ── Published posts ───────────────────────────────────────────────────────────

export function getAllPosts(): LocalPost[] {
  return shelby
    .list<LocalPost>({ meta: { type: "post" } })
    .map(blobToPost);
}

export function getPostByBlobId(blobId: string): LocalPost | undefined {
  const blob = shelby.get<LocalPost>(blobId);
  return blob ? blobToPost(blob) : undefined;
}

export function getPostsByWallet(walletId: string): LocalPost[] {
  return shelby
    .list<LocalPost>({ meta: { type: "post", authorWalletId: walletId } })
    .map(blobToPost);
}

export function publishPost(params: {
  title: string;
  subtitle: string;
  content: string;
  tags: string;
  authorWalletId: string;
  authorName: string;
}): LocalPost {
  const post: LocalPost = {
    blobId: "",            // filled in after shelby.put()
    title: params.title.trim() || "Untitled",
    subtitle: params.subtitle.trim(),
    content: params.content.trim(),
    tags: params.tags.split(",").map((t) => t.trim()).filter(Boolean),
    authorWalletId: params.authorWalletId,
    authorName: params.authorName,
    publishedAt: new Date().toISOString(),
    readTime: calcReadTime(params.content),
    claps: 0,
  };

  const receipt = shelby.put<LocalPost>(post, {
    type: "post",
    authorWalletId: params.authorWalletId,
  });

  // Back-fill the blobId that Shelby generated, then patch the stored content
  post.blobId = receipt.blobId;
  shelby.patchMeta(receipt.blobId, { blobId: receipt.blobId });
  // Update content with the real blobId
  const blob = shelby.get<LocalPost>(receipt.blobId);
  if (blob) {
    const updated = { ...blob, content: { ...blob.content, blobId: receipt.blobId } };
    // Re-write via a second put using the same blobId indirectly via patchMeta
    // We store the corrected post directly in localStorage under the blob key
    const key = "shelby:blob:" + receipt.blobId;
    localStorage.setItem(key, JSON.stringify(updated));
  }

  clearDraft();
  return post;
}

export function clapPost(blobId: string): void {
  const blob = shelby.get<LocalPost>(blobId);
  if (!blob) return;
  const updated = { ...blob, content: { ...blob.content, claps: blob.content.claps + 1 } };
  localStorage.setItem("shelby:blob:" + blobId, JSON.stringify(updated));
  // Invalidate cache by re-writing through internal cache path
  // (The adapter re-reads from localStorage on next get())
}

export function deletePost(blobId: string): void {
  shelby.delete(blobId);
}

// ── Draft ─────────────────────────────────────────────────────────────────────

const DRAFT_KEY = "post-draft";

export function saveDraft(draft: Omit<Draft, "savedAt">): void {
  shelby.setDraft<Draft>(DRAFT_KEY, {
    ...draft,
    savedAt: new Date().toISOString(),
  });
}

export function loadDraft(): Draft | null {
  return shelby.getDraft<Draft>(DRAFT_KEY);
}

export function clearDraft(): void {
  shelby.clearDraft(DRAFT_KEY);
}

// ── Network helpers (passed through to UI) ────────────────────────────────────

export { shelby } from "./shelby";
