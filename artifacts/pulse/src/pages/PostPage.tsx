import { Link, useParams, useLocation } from "wouter";
import { Heart, ArrowLeft, Share2, Bookmark, Trash2 } from "lucide-react";
import { useState } from "react";
import { getPostById, getAuthorById } from "../data/mockData";
import { getPostByBlobId, clapPost, deletePost } from "../lib/postStorage";
import { useAuth } from "../hooks/useAuth";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [bookmarked, setBookmarked] = useState(false);
  const [clapped, setClapped] = useState(false);
  const [clapCount, setClapCount] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const isBlob = id?.startsWith("blob_");

  const localPost = isBlob ? getPostByBlobId(id) : undefined;
  const mockPost = !isBlob ? getPostById(id) : undefined;
  const mockAuthor = mockPost ? getAuthorById(mockPost.authorId) : undefined;

  if (!localPost && !mockPost) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Post not found</h1>
        <p className="text-muted-foreground mb-6">This story doesn't exist or may have been removed.</p>
        <Link href="/" className="text-primary hover:underline text-sm">← Back to home</Link>
      </div>
    );
  }

  const title = localPost?.title ?? mockPost!.title;
  const subtitle = localPost?.subtitle ?? mockPost!.subtitle;
  const content = localPost?.content ?? mockPost!.content;
  const publishedAt = localPost ? formatDate(localPost.publishedAt) : mockPost!.publishedAt;
  const readTime = localPost?.readTime ?? mockPost!.readTime;
  const tags = localPost?.tags ?? mockPost!.tags;
  const authorName = localPost?.authorName ?? mockAuthor!.name;
  const authorInitials = localPost
    ? localPost.authorName.charAt(0).toUpperCase()
    : mockAuthor!.avatarInitials;
  const authorColor = localPost ? undefined : mockAuthor!.avatarColor;
  const authorHref = localPost ? `/author/wallet/${localPost.authorWalletId}` : `/author/${mockAuthor!.id}`;
  const isOwner = localPost && user?.walletId === localPost.authorWalletId;
  const displayClaps = clapCount ?? (localPost?.claps ?? mockPost!.claps);

  function handleClap() {
    if (clapped) return;
    if (localPost) clapPost(localPost.blobId);
    setClapCount(displayClaps + 1);
    setClapped(true);
  }

  function handleDelete() {
    if (localPost) {
      deletePost(localPost.blobId);
      navigate("/");
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} /> Back
        </Link>

        {isOwner && (
          <div className="flex items-center gap-1">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Delete this post?</span>
                <button onClick={handleDelete} className="text-xs font-medium text-destructive hover:underline">Yes, delete</button>
                <button onClick={() => setConfirmDelete(false)} className="text-xs text-muted-foreground hover:underline">Cancel</button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"
                title="Delete post"
              >
                <Trash2 size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      <article>
        <h1
          className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          {title}
        </h1>

        {subtitle && (
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">{subtitle}</p>
        )}

        <div className="flex items-center justify-between border-y border-border py-4 mb-10">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0"
              style={{ backgroundColor: authorColor ?? "var(--color-primary)" }}
            >
              {authorInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{authorName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{readTime} min read</span>
                <span>·</span>
                <span>{publishedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {localPost && (
              <div className="flex items-center gap-1.5 mr-2">
                <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {localPost.blobId}
                </span>
              </div>
            )}
            <button
              onClick={() => setBookmarked((b) => !b)}
              className={`p-2 rounded-md hover:bg-muted transition-colors ${bookmarked ? "text-primary" : "text-muted-foreground"}`}
            >
              <Bookmark size={18} className={bookmarked ? "fill-primary" : ""} />
            </button>
            <button className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground">
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {content.split("\n\n").map((paragraph, i) => (
            <p key={i} className="text-lg leading-[1.85] text-foreground" style={{ fontFamily: "var(--app-font-serif)" }}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClap}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                clapped
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              <Heart size={16} className={clapped ? "fill-primary text-primary" : ""} />
              <span className="text-sm font-medium">{displayClaps.toLocaleString()}</span>
            </button>
            <span className="text-sm text-muted-foreground">
              {clapped ? "Thanks for reading!" : "Did this resonate?"}
            </span>
          </div>
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-border">
        <div className="flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-lg"
            style={{ backgroundColor: authorColor ?? "var(--color-primary)" }}
          >
            {authorInitials}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Written by</p>
            <p className="font-semibold text-foreground">{authorName}</p>
            {localPost && (
              <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{localPost.authorWalletId}</p>
            )}
            {mockAuthor && (
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{mockAuthor.bio}</p>
            )}
          </div>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="text-sm bg-muted text-muted-foreground px-4 py-1.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

