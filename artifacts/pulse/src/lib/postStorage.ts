import shelbyStorage from "./shelbyStorage";

const POSTS_KEY = "pulse_published_posts";
const DRAFT_KEY = "pulse_draft";

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

function generateBlobId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `blob_${hex}`;
}

function calcReadTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function getAllPosts(): LocalPost[] {
  return shelbyStorage.get<LocalPost[]>(POSTS_KEY) ?? [];
}

export function getPostByBlobId(blobId: string): LocalPost | undefined {
  return getAllPosts().find((p) => p.blobId === blobId);
}

export function getPostsByWallet(walletId: string): LocalPost[] {
  return getAllPosts().filter((p) => p.authorWalletId === walletId);
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
    blobId: generateBlobId(),
    title: params.title.trim() || "Untitled",
    subtitle: params.subtitle.trim(),
    content: params.content.trim(),
    tags: params.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    authorWalletId: params.authorWalletId,
    authorName: params.authorName,
    publishedAt: new Date().toISOString(),
    readTime: calcReadTime(params.content),
    claps: 0,
  };

  const existing = getAllPosts();
  shelbyStorage.set<LocalPost[]>(POSTS_KEY, [post, ...existing]);
  clearDraft();
  return post;
}

export function clapPost(blobId: string): void {
  const posts = getAllPosts().map((p) =>
    p.blobId === blobId ? { ...p, claps: p.claps + 1 } : p
  );
  shelbyStorage.set<LocalPost[]>(POSTS_KEY, posts);
}

export function deletePost(blobId: string): void {
  const posts = getAllPosts().filter((p) => p.blobId !== blobId);
  shelbyStorage.set<LocalPost[]>(POSTS_KEY, posts);
}

export function saveDraft(draft: Omit<Draft, "savedAt">): void {
  shelbyStorage.set<Draft>(DRAFT_KEY, {
    ...draft,
    savedAt: new Date().toISOString(),
  });
}

export function loadDraft(): Draft | null {
  return shelbyStorage.get<Draft>(DRAFT_KEY);
}

export function clearDraft(): void {
  shelbyStorage.remove(DRAFT_KEY);
}
