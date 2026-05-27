import { Link } from "wouter";
import { Heart, Clock, PenLine, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPostsByWallet, loadDraft, type LocalPost } from "../lib/postStorage";

function excerpt(text: string, max = 120): string {
  const clean = text.replace(/\n+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function PostRow({ post }: { post: LocalPost }) {
  return (
    <article className="py-7 border-b border-border last:border-b-0 group">
      <Link href={`/post/${post.blobId}`}>
        <div className="cursor-pointer">
          <h3
            className="text-[1.15rem] font-bold text-foreground group-hover:text-primary transition-colors leading-snug mb-2"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {post.title}
          </h3>
          <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
            {excerpt(post.subtitle || post.content)}
          </p>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} />
            {post.readTime} min
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart size={12} className="fill-muted-foreground/70" />
          {post.claps.toLocaleString()}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{formatDate(post.publishedAt)}</p>
        <span className="text-[10px] font-mono text-muted-foreground/60">{post.blobId}</span>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const posts = getPostsByWallet(user.walletId);
  const draft = loadDraft();
  const hasDraft = !!(draft?.title || draft?.content);
  const totalClaps = posts.reduce((sum, p) => sum + p.claps, 0);

  function copyWalletId() {
    navigator.clipboard.writeText(user.walletId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-[680px] mx-auto px-6 py-10">
      {/* Header */}
      <header className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-full bg-primary/15 flex items-center justify-center text-primary text-2xl font-bold flex-shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="pt-1">
              <h1 className="text-2xl font-bold text-foreground leading-tight">{user.name}</h1>
              <button
                onClick={copyWalletId}
                className="mt-1.5 flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors group"
                title="Copy wallet ID"
              >
                <span>{user.walletId}</span>
                {copied ? (
                  <Check size={11} className="text-primary" />
                ) : (
                  <Copy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>
          </div>

          <Link
            href="/write"
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-2 rounded-full transition-colors whitespace-nowrap flex-shrink-0"
          >
            <PenLine size={14} />
            Write
          </Link>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{posts.length}</span>{" "}
            {posts.length === 1 ? "story" : "stories"} published
          </span>
          {posts.length > 0 && (
            <span>
              <span className="font-semibold text-foreground">{totalClaps.toLocaleString()}</span> total claps
            </span>
          )}
          {hasDraft && (
            <Link
              href="/write"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
              Draft in progress
            </Link>
          )}
        </div>
      </header>

      {/* Stories section */}
      <div className="border-t border-border pt-8">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-7">
          Your stories
        </h2>

        {posts.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-muted-foreground text-sm mb-4">
              You haven't published anything yet.
            </p>
            <Link
              href="/write"
              className="inline-flex items-center gap-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-5 py-2.5 rounded-full transition-colors"
            >
              <PenLine size={14} />
              Write your first story
            </Link>
          </div>
        ) : (
          <div>
            {posts.map((post) => (
              <PostRow key={post.blobId} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
