import { useParams, Link } from "wouter";
import { ArrowLeft, Heart, Clock, Users } from "lucide-react";
import { getAuthorById, getPostsByAuthor } from "../data/mockData";

function excerpt(text: string, max = 120): string {
  const clean = text.replace(/\n+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

export default function AuthorProfile() {
  const { id } = useParams<{ id: string }>();
  const author = getAuthorById(id);
  const authorPosts = author ? getPostsByAuthor(author.id) : [];

  if (!author) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Author not found</h1>
        <Link href="/" className="text-violet-400 hover:underline text-sm">← Back to home</Link>
      </div>
    );
  }

  const totalClaps = authorPosts.reduce((sum, p) => sum + p.claps, 0);

  return (
    <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-8 animate-fade-up">
      <div className="mb-8">
        <Link href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
          <ArrowLeft size={14} /> Feed
        </Link>
      </div>

      {/* Hero banner */}
      <div className="relative rounded-3xl overflow-hidden mb-0 h-36 sm:h-44"
        style={{
          background: `linear-gradient(135deg, ${author.avatarColor}35 0%, rgba(139,92,246,0.2) 50%, rgba(34,211,238,0.15) 100%)`,
          border: "1px solid rgba(255,255,255,0.07)",
        }}>
        {/* Decorative glow orb */}
        <div className="absolute top-0 left-1/4 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: `radial-gradient(circle, ${author.avatarColor}40, transparent 70%)`, filter: "blur(40px)" }}
        />
        <div className="absolute -top-8 right-1/4 w-32 h-32 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(34,211,238,0.2), transparent 70%)", filter: "blur(30px)" }}
        />
      </div>

      {/* Avatar + header — overlap the banner */}
      <div className="px-4 sm:px-6 -mt-10 mb-6 relative">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0 ring-4"
            style={{
              backgroundColor: author.avatarColor,

              boxShadow: `0 0 0 4px hsl(237 45% 4%), 0 0 20px ${author.avatarColor}50`,
            }}>
            {author.avatarInitials}
          </div>
          <button
            className="mb-2 text-xs font-semibold px-4 py-1.5 rounded-full transition-all"
            style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", color: "hsl(240 8% 70%)" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(139,92,246,0.15)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)"; e.currentTarget.style.color = "#c4b5fd"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "hsl(240 8% 70%)"; }}>
            Follow
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{author.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">@{author.username} · Member since {author.joinedDate}</p>
        <p className="text-base text-foreground/80 leading-relaxed mt-3 max-w-lg">{author.bio}</p>
      </div>

      {/* Stats row */}
      <div className="px-4 sm:px-6 mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Followers",   value: author.followers.toLocaleString() },
            { label: "Following",   value: author.following.toString() },
            { label: "Stories",     value: authorPosts.length.toString() },
            { label: "Total claps", value: totalClaps.toLocaleString() },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-4 py-3 text-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-lg sm:text-xl font-bold gradient-text">{value}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 sm:px-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3">All stories</span>
          <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.07)" }} />
        </div>

        {authorPosts.length === 0 ? (
          <p className="text-muted-foreground text-sm py-10 text-center">No stories published yet.</p>
        ) : (
          <div className="space-y-3">
            {authorPosts.map((post, i) => (
              <article key={post.id}
                className="glass-card rounded-2xl p-5 animate-fade-up"
                style={{ animationDelay: `${i * 70}ms`, opacity: 0 }}>
                <Link href={`/post/${post.id}`}>
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
                <p className="mt-3 text-xs text-muted-foreground/50">{post.publishedAt}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
