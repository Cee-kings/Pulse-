import { Link, useParams, useLocation } from "wouter";
import { Heart, ArrowLeft, Share2, Bookmark, Trash2, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { getPostById, getAuthorById, posts as allMockPosts } from "../data/mockData";
import { getPostByBlobId, clapPost, deletePost } from "../lib/postStorage";
import { useAuth } from "../hooks/useAuth";
import { PostSkeleton } from "../components/Skeleton";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    function onScroll() {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      setProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-[2px]" style={{ background: "rgba(255,255,255,0.05)" }}>
      <div
        className="h-full transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%`, background: "linear-gradient(90deg, #8b5cf6, #22d3ee)" }}
      />
    </div>
  );
}

function ArticleBody({ content }: { content: string }) {
  const paragraphs = content.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="mt-8 sm:mt-10">
      {paragraphs.map((para, i) => (
        <p key={i}
          className={`text-[1.0625rem] sm:text-[1.125rem] leading-[1.9] mb-6 sm:mb-7 tracking-[0.012em] ${i === 0 ? "drop-cap" : ""}`}
          style={{ fontFamily: "var(--app-font-serif)", color: "hsl(240 15% 85%)" }}
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
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [clapped, setClapped] = useState(false);
  const [clapCount, setClapCount] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, [id]);

  const isBlob = id?.startsWith("blob_");
  const localPost = isBlob ? getPostByBlobId(id) : undefined;
  const mockPost = !isBlob ? getPostById(id) : undefined;
  const mockAuthor = mockPost ? getAuthorById(mockPost.authorId) : undefined;
  const relatedCards = mockPost ? allMockPosts.filter((p) => p.id !== mockPost.id).slice(0, 2) : [];

  if (loading) return <><ReadingProgress /><PostSkeleton /></>;
  if (!localPost && !mockPost) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Post not found</h1>
        <Link href="/" className="text-violet-400 hover:underline text-sm">← Back to home</Link>
      </div>
    );
  }

  const title       = localPost?.title      ?? mockPost!.title;
  const subtitle    = localPost?.subtitle   ?? mockPost!.subtitle;
  const content     = localPost?.content    ?? mockPost!.content;
  const publishedAt = localPost ? formatDate(localPost.publishedAt) : mockPost!.publishedAt;
  const readTime    = localPost?.readTime   ?? mockPost!.readTime;
  const tags        = localPost?.tags       ?? mockPost!.tags;
  const authorName  = localPost?.authorName ?? mockAuthor!.name;
  const authorInitials = localPost ? localPost.authorName.charAt(0).toUpperCase() : mockAuthor!.avatarInitials;
  const authorColor    = localPost ? "#8b5cf6" : mockAuthor!.avatarColor;
  const isOwner        = localPost && user?.walletId === localPost.authorWalletId;
  const displayClaps   = clapCount ?? (localPost?.claps ?? mockPost!.claps);

  function handleClap() {
    if (clapped) return;
    if (localPost) clapPost(localPost.blobId);
    setClapCount(displayClaps + 1);
    setClapped(true);
  }

  function handleDelete() {
    if (localPost) { deletePost(localPost.blobId); navigate("/"); }
  }

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }

  return (
    <>
      <ReadingProgress />
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-10 animate-fade-up">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <Link href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            <ArrowLeft size={14} /> Feed
          </Link>
          <div className="flex items-center gap-0.5">
            {isOwner && !confirmDelete && (
              <button onClick={() => setConfirmDelete(true)}
                className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground hover:text-red-400">
                <Trash2 size={15} />
              </button>
            )}
            {confirmDelete && (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">Delete?</span>
                <button onClick={handleDelete} className="font-medium text-red-400 hover:underline">Yes</button>
                <button onClick={() => setConfirmDelete(false)} className="text-muted-foreground hover:underline">No</button>
              </div>
            )}
            <button onClick={() => setBookmarked((b) => !b)}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: bookmarked ? "#a78bfa" : "hsl(240 8% 52%)" }}>
              <Bookmark size={16} style={bookmarked ? { fill: "#a78bfa" } : {}} />
            </button>
            <button onClick={handleShare}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
              style={{ color: copied ? "#a78bfa" : "hsl(240 8% 52%)" }}>
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-[1.75rem] sm:text-[2.25rem] md:text-[2.625rem] font-bold leading-[1.15] tracking-tight mb-4 sm:mb-5"
            style={{ fontFamily: "var(--app-font-serif)", color: "hsl(240 20% 94%)" }}>
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl leading-relaxed mb-6 sm:mb-7"
              style={{ fontFamily: "var(--app-font-serif)", color: "hsl(240 8% 62%)" }}>
              {subtitle}
            </p>
          )}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: authorColor }}>
              {authorInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-foreground leading-snug">{authorName}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground mt-0.5">
                <span>{publishedAt}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={10} />{readTime} min read</span>
              </div>
            </div>
          </div>
        </header>

        <div style={{ height: "1px", background: "rgba(255,255,255,0.07)" }} />

        <article><ArticleBody content={content} /></article>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {tags.map((tag) => <span key={tag} className="tag-pill">{tag}</span>)}
          </div>
        )}

        {/* Reaction */}
        <div className="mt-10 pt-8 flex flex-wrap items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
          <button onClick={handleClap}
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-sm font-semibold transition-all"
            style={clapped
              ? { background: "rgba(139,92,246,0.2)", border: "1px solid rgba(139,92,246,0.4)", color: "#c4b5fd", boxShadow: "0 0 20px rgba(139,92,246,0.2)" }
              : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "hsl(240 8% 52%)" }}>
            <Heart size={15} style={clapped ? { fill: "#a78bfa", color: "#a78bfa" } : {}} />
            {displayClaps.toLocaleString()}
          </button>
          <span className="text-sm text-muted-foreground">
            {clapped ? "Thanks for reading." : "Did this resonate with you?"}
          </span>
        </div>

        {localPost && (
          <div className="mt-3">
            <span className="text-[10px] font-mono px-2 py-1 rounded" style={{ background: "rgba(255,255,255,0.04)", color: "hsl(240 8% 35%)" }}>
              {localPost.blobId}
            </span>
          </div>
        )}

        {/* Author card */}
        <div className="mt-10 pt-8 glass-card rounded-2xl p-5 sm:p-6" style={{ marginTop: "2.5rem" }}>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white text-lg font-bold flex-shrink-0"
              style={{ backgroundColor: authorColor }}>
              {authorInitials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Written by</p>
              {mockAuthor ? (
                <Link href={`/author/${mockAuthor.id}`} className="font-semibold text-foreground hover:text-violet-300 transition-colors">
                  {authorName}
                </Link>
              ) : (
                <p className="font-semibold text-foreground">{authorName}</p>
              )}
              {localPost && (
                <p className="text-[10px] font-mono text-muted-foreground mt-0.5 truncate">{localPost.authorWalletId}</p>
              )}
              {mockAuthor && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{mockAuthor.bio}</p>
              )}
              {mockAuthor && (
                <button className="mt-3 text-xs font-semibold px-4 py-1.5 rounded-full transition-all"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "hsl(240 8% 70%)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,92,246,0.15)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; e.currentTarget.style.color = "#c4b5fd"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "hsl(240 8% 70%)"; }}>
                  Follow
                </button>
              )}
            </div>
          </div>
        </div>

        {/* More to read */}
        {relatedCards.length > 0 && (
          <div className="mt-8 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-5">More to read</h3>
            <div className="space-y-3">
              {relatedCards.map((related) => {
                const relAuthor = getAuthorById(related.authorId);
                if (!relAuthor) return null;
                return (
                  <Link key={related.id} href={`/post/${related.id}`}>
                    <div className="glass-card rounded-xl p-4 group cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: relAuthor.avatarColor }} />
                        <span className="text-xs text-muted-foreground">{relAuthor.name}</span>
                      </div>
                      <p className="font-semibold text-foreground group-hover:text-violet-300 transition-colors leading-snug text-sm"
                        style={{ fontFamily: "var(--app-font-serif)" }}>
                        {related.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                        <Clock size={9} />{related.readTime} min read
                      </p>
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
