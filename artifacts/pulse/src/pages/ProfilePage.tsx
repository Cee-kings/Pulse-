import { Link } from "wouter";
import { Heart, Clock, PenLine, Copy, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getPostsByWallet, loadDraft, type LocalPost } from "../lib/postStorage";

function excerpt(text: string, max = 120): string {
  const clean = text.replace(/\n+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function PostRow({ post, index }: { post: LocalPost; index: number }) {
  return (
    <article
      className="glass-card rounded-2xl p-5 animate-fade-up"
      style={{ animationDelay: `${index * 70}ms`, opacity: 0 }}>
      <Link href={`/post/${post.blobId}`}>
        <div className="cursor-pointer mb-3">
          <h3 className="text-[1.05rem] font-bold text-foreground leading-snug mb-2 hover:text-violet-300 transition-colors"
            style={{ fontFamily: "var(--app-font-serif)" }}>
            {post.title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
            {excerpt(post.subtitle || post.content)}
          </p>
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/60">
            <Clock size={10} />{post.readTime} min
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground/60 flex-shrink-0">
          <Heart size={11} style={{ fill: "rgba(167,139,250,0.5)", color: "rgba(167,139,250,0.5)" }} />
          {post.claps.toLocaleString()}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground/50">{formatDate(post.publishedAt)}</p>
        <span className="text-[10px] font-mono" style={{ color: "hsl(240 8% 30%)" }}>{post.blobId}</span>
      </div>
    </article>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  const walletId = user.walletId;
  const posts = getPostsByWallet(walletId);
  const draft = loadDraft();
  const hasDraft = !!(draft?.title || draft?.content);
  const totalClaps = posts.reduce((sum, p) => sum + p.claps, 0);

  function copyWalletId() {
    navigator.clipboard.writeText(walletId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-8 animate-fade-up">

      {/* Hero banner */}
      <div className="relative rounded-3xl overflow-hidden h-36 sm:h-44 mb-0"
        style={{
          background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.15), rgba(249,115,22,0.12))",
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
          <Sparkles size={80} className="text-violet-400" />
        </div>
        <div className="absolute top-0 left-1/3 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)", filter: "blur(40px)" }} />
        <div className="absolute -top-6 right-1/4 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.25), transparent 70%)", filter: "blur(30px)" }} />
      </div>

      {/* Avatar + actions */}
      <div className="px-4 sm:px-6 -mt-10 mb-6 relative">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
              boxShadow: "0 0 0 4px hsl(237 45% 4%), 0 0 30px rgba(139,92,246,0.4)",
            }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <Link href="/write"
            className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-white px-4 py-1.5 rounded-full transition-all"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
            onMouseEnter={(e: any) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,92,246,0.4)"; }}
            onMouseLeave={(e: any) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = ""; }}>
            <PenLine size={13} /> Write
          </Link>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{user.name}</h1>
        <button onClick={copyWalletId}
          className="mt-2 flex items-center gap-1.5 text-xs font-mono text-muted-foreground hover:text-foreground transition-colors group"
          title="Copy wallet ID">
          <span>{user.walletId}</span>
          {copied
            ? <Check size={11} style={{ color: "#a78bfa" }} />
            : <Copy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          }
        </button>
      </div>

      {/* Stats */}
      <div className="px-4 sm:px-6 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Stories published", value: posts.length.toString() },
            { label: "Total claps",       value: totalClaps > 0 ? totalClaps.toLocaleString() : "—" },
            { label: "Wallet chain",      value: "local" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-4 py-3 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-lg sm:text-xl font-bold gradient-text">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {hasDraft && (
          <Link href="/write"
            className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all"
            style={{ background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.15)" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#a78bfa" }} />
            <span style={{ color: "#c4b5fd" }}>Draft in progress — continue writing</span>
          </Link>
        )}
      </div>

      {/* Stories */}
      <div className="px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3">Your stories</span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>

        {posts.length === 0 ? (
          <div className="py-16 text-center glass-card rounded-2xl">
            <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.2)" }}>
              <PenLine size={22} className="text-violet-400" />
            </div>
            <p className="text-muted-foreground text-sm mb-5">You haven't published anything yet.</p>
            <Link href="/write"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-2.5 rounded-full transition-all"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
              onMouseEnter={(e: any) => { e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,92,246,0.4)"; }}
              onMouseLeave={(e: any) => { e.currentTarget.style.boxShadow = ""; }}>
              <PenLine size={14} /> Write your first story
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {posts.map((post, i) => <PostRow key={post.blobId} post={post} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
