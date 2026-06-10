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
  // Build post with empty blobId — filled in from the receipt
  const post: LocalPost = {
    blobId: "",
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

  // shelby.put() stores the blob and returns a receipt with the generated blobId
  const receipt = shelby.put<LocalPost>(post, {
    type: "post",
    authorWalletId: params.authorWalletId,
  });

  // Write the blobId back into the stored blob so it's self-contained
  post.blobId = receipt.blobId;
  const stored = shelby.get<LocalPost>(receipt.blobId);
  if (stored) {
    shelby.patchMeta(receipt.blobId, { blobId: receipt.blobId });
    // Update the content field with the correct blobId directly in localStorage
    localStorage.setItem(
      "shelby:blob:" + receipt.blobId,
      JSON.stringify({ ...stored, content: { ...stored.content, blobId: receipt.blobId } })
    );
  }

  clearDraft();
  return post;
}

export function clapPost(blobId: string): void {
  const blob = shelby.get<LocalPost>(blobId);
  if (!blob) return;
  // Write the incremented clap count directly to localStorage
  localStorage.setItem(
    "shelby:blob:" + blobId,
    JSON.stringify({ ...blob, content: { ...blob.content, claps: blob.content.claps + 1 } })
  );
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

// ── Re-export shelby for UI components that need network stats / traces ────────

export { shelby } from "./shelby";
