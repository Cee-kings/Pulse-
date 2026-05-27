import { Link, useParams, useLocation } from "wouter";
import { Heart, ArrowLeft, Share2, Bookmark, Trash2, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getPostById, getAuthorById, posts as allMockPosts } from "../data/mockData";
import { getPostByBlobId, clapPost, deletePost } from "../lib/postStorage";
import { useAuth } from "../hooks/useAuth";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-border">
      <div
        className="h-full bg-primary transition-all duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ArticleBody({ content }: { content: string }) {
  const paragraphs = content
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="mt-10 space-y-7">
      {paragraphs.map((para, i) => (
        <p
          key={i}
          className={`text-[1.125rem] leading-[1.9] text-foreground tracking-[0.01em] ${
            i === 0
              ? "first-letter:text-[3.5rem] first-letter:font-bold first-letter:float-left first-letter:leading-[0.85] first-letter:mr-2 first-letter:mt-1"
              : ""
          }`}
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          {para}
        </p>
      ))}
    </div>
  );
}

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [bookmarked, setBookmarked] = useState(false);
  const [clapped, setClapped] = useState(false);
  const [clapCount, setClapCount] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLElement>(null);

  const isBlob = id?.startsWith("blob_");
  const localPost = isBlob ? getPostByBlobId(id) : undefined;
  const mockPost = !isBlob ? getPostById(id) : undefined;
  const mockAuthor = mockPost ? getAuthorById(mockPost.authorId) : undefined;

  const relatedCards = mockPost
    ? allMockPosts.filter((p) => p.id !== mockPost.id).slice(0, 2)
    : [];

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
  const authorInitials = localPost ? localPost.authorName.charAt(0).toUpperCase() : mockAuthor!.avatarInitials;
  const authorColor = localPost ? "#3d7a5c" : mockAuthor!.avatarColor;
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

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <>
      <ReadingProgress />

      <div className="max-w-[680px] mx-auto px-6 py-10">
        {/* Top nav bar */}
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={14} /> Feed
          </Link>

          <div className="flex items-center gap-1.5">
            {isOwner && !confirmDelete && (
              <button
                onClick={() => setConfirmDelete(true)}
                className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"
                title="Delete post"
              >
                <Trash2 size={15} />
              </button>
            )}
            {confirmDelete && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground text-xs">Delete?</span>
                <button onClick={handleDelete} className="text-xs font-medium text-destructive hover:underline">Yes</button>
                <button onClick={() => setConfirmDelete(false)} className="text-xs text-muted-foreground hover:underline">No</button>
              </div>
            )}
            <button
              onClick={() => setBookmarked((b) => !b)}
              className={`p-1.5 rounded-md hover:bg-muted transition-colors ${bookmarked ? "text-primary" : "text-muted-foreground"}`}
            >
              <Bookmark size={16} className={bookmarked ? "fill-primary" : ""} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground"
              title={copied ? "Link copied!" : "Copy link"}
            >
              <Share2 size={16} className={copied ? "text-primary" : ""} />
            </button>
          </div>
        </div>

        {/* Article header */}
        <header className="mb-8">
          <h1
            className="text-4xl sm:text-[2.625rem] font-bold text-foreground leading-[1.15] tracking-tight mb-5"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="text-xl text-muted-foreground leading-relaxed mb-7"
              style={{ fontFamily: "var(--app-font-serif)" }}
            >
              {subtitle}
            </p>
          )}

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: authorColor }}
            >
              {authorInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground leading-snug">{authorName}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{publishedAt}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock size={11} />
                  {readTime} min read
                </span>
              </div>
            </div>
          </div>
        </header>

        <div className="border-t border-border" />

        {/* Article body */}
        <article ref={articleRef}>
          <ArticleBody content={content} />
        </article>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="text-sm bg-muted text-muted-foreground px-3 py-1.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Reaction bar */}
        <div className="mt-12 pt-8 border-t border-border flex items-center gap-4">
          <button
            onClick={handleClap}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-medium transition-all ${
              clapped
                ? "bg-primary/10 border-primary/20 text-primary"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            }`}
          >
            <Heart size={15} className={clapped ? "fill-primary" : ""} />
            {displayClaps.toLocaleString()}
          </button>
          <span className="text-sm text-muted-foreground">
            {clapped ? "Thanks for reading." : "Did this resonate with you?"}
          </span>
        </div>

        {/* Blob ID chip for local posts */}
        {localPost && (
          <div className="mt-4">
            <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md">
              {localPost.blobId}
            </span>
          </div>
        )}

        {/* Author card */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
              style={{ backgroundColor: authorColor }}
            >
              {authorInitials}
            </div>
            <div className="flex-1">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-1">Written by</p>
              {mockAuthor ? (
                <Link href={`/author/${mockAuthor.id}`} className="font-semibold text-foreground hover:text-primary transition-colors">
                  {authorName}
                </Link>
              ) : (
                <p className="font-semibold text-foreground">{authorName}</p>
              )}
              {localPost && (
                <p className="text-[11px] font-mono text-muted-foreground mt-0.5">{localPost.authorWalletId}</p>
              )}
              {mockAuthor && (
                <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{mockAuthor.bio}</p>
              )}
              {mockAuthor && (
                <button className="mt-3 text-xs font-medium border border-foreground text-foreground hover:bg-foreground hover:text-white px-4 py-1.5 rounded-full transition-colors">
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>

        {/* More to read */}
        {relatedCards.length > 0 && (
          <div className="mt-12 pt-8 border-t border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5">
              More to read
            </h3>
            <div className="space-y-6">
              {relatedCards.map((related: any) => {
                const relAuthor = getAuthorById(related.authorId);
                if (!relAuthor) return null;
                return (
                  <Link key={related.id} href={`/post/${related.id}`}>
                    <div className="group cursor-pointer">
                      <div className="flex items-center gap-2 mb-1.5">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                          style={{ backgroundColor: relAuthor.avatarColor }}
                        >
                          {relAuthor.avatarInitials}
                        </div>
                        <span className="text-xs text-muted-foreground">{relAuthor.name}</span>
                      </div>
                      <p
                        className="font-semibold text-foreground group-hover:text-primary transition-colors leading-snug"
                        style={{ fontFamily: "var(--app-font-serif)" }}
                      >
                        {related.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{related.readTime} min read</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
