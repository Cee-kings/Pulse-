import { Link } from "wouter";
import { Heart, Clock, ArrowRight, Sparkles, Users, TrendingUp, BookOpen } from "lucide-react";
import { posts, authors, getAuthorById, getPostsByAuthor } from "../data/mockData";

/* ── helpers ────────────────────────────────────────────────── */
function excerpt(text: string, max = 130): string {
  const clean = text.replace(/\n+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

/* Sort by claps */
const byClaps = [...posts].sort((a, b) => b.claps - a.claps);
const heroPost    = byClaps[0];
const heroAuthor  = getAuthorById(heroPost.authorId)!;
const staffPicks  = byClaps.slice(1, 4);
const latestPosts = [...posts].slice(-4).reverse();

const spotlightAuthors = [
  authors.find((a) => a.id === "author-3")!,
  authors.find((a) => a.id === "author-4")!,
  authors.find((a) => a.id === "author-1")!,
];

const TOPICS: { label: string; count: number; color: string }[] = [
  { label: "Writing",       count: 4, color: "rgba(167,139,250,0.25)" },
  { label: "Philosophy",    count: 3, color: "rgba(34,211,238,0.2)"   },
  { label: "Technology",    count: 2, color: "rgba(52,211,153,0.2)"   },
  { label: "Mindfulness",   count: 2, color: "rgba(251,146,60,0.2)"   },
  { label: "Food",          count: 2, color: "rgba(244,114,182,0.2)"  },
  { label: "Design",        count: 1, color: "rgba(129,140,248,0.2)"  },
  { label: "Culture",       count: 2, color: "rgba(250,204,21,0.18)"  },
  { label: "Engineering",   count: 1, color: "rgba(34,211,238,0.2)"   },
  { label: "AI",            count: 1, color: "rgba(167,139,250,0.25)" },
  { label: "Creativity",    count: 2, color: "rgba(251,146,60,0.2)"   },
];

/* ── sub-components ─────────────────────────────────────────── */

function SectionLabel({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <span style={{ color: "#a78bfa" }}>{icon}</span>
      <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </h2>
      <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
    </div>
  );
}

function StaffPickCard({
  index,
  postId,
  title,
  preview,
  authorName,
  authorInitials,
  authorColor,
  authorId,
  tags,
  readTime,
  claps,
  delay,
}: {
  index: number;
  postId: string;
  title: string;
  preview: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  authorId: string;
  tags: string[];
  readTime: number;
  claps: number;
  delay: number;
}) {
  return (
    <Link href={`/post/${postId}`}>
      <div
        className="glass-card rounded-2xl p-5 h-full cursor-pointer animate-fade-up"
        style={{ animationDelay: `${delay}ms`, opacity: 0 }}
      >
        {/* Number badge */}
        <div
          className="inline-flex items-center justify-center w-8 h-8 rounded-xl mb-4 text-xs font-bold"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2))",
            border: "1px solid rgba(139,92,246,0.25)",
            color: "#c4b5fd",
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </div>

        <h3
          className="text-[1rem] font-bold text-foreground leading-snug mb-2"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-4">{preview}</p>

        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/author/${authorId}`} onClick={(e) => e.stopPropagation()}>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
              style={{ backgroundColor: authorColor }}
            >
              {authorInitials}
            </div>
          </Link>
          <span className="text-xs text-muted-foreground">{authorName}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-1.5 flex-wrap">
            {tags.slice(0, 2).map((t) => (
              <span key={t} className="tag-pill">{t}</span>
            ))}
          </div>
          <div className="flex items-center gap-2.5 text-[11px] text-muted-foreground/60 flex-shrink-0">
            <span className="flex items-center gap-0.5">
              <Clock size={9} /> {readTime}m
            </span>
            <span className="flex items-center gap-0.5">
              <Heart size={9} style={{ fill: "rgba(167,139,250,0.5)", color: "rgba(167,139,250,0.5)" }} />
              {claps.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ── page ───────────────────────────────────────────────────── */

export default function DiscoverPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14">

      {/* ── Page title ── */}
      <div className="text-center animate-fade-up" style={{ opacity: 0 }}>
        <div
          className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
          style={{
            background: "rgba(139,92,246,0.12)",
            border: "1px solid rgba(139,92,246,0.2)",
            color: "#c4b5fd",
          }}
        >
          <Sparkles size={12} />
          Curated by Pulse
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold gradient-text mb-3" style={{ fontFamily: "var(--app-font-serif)" }}>
          Discover
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto leading-relaxed">
          The best of what's being written right now.
        </p>
      </div>

      {/* ── Hero feature ── */}
      <section className="animate-fade-up delay-100" style={{ opacity: 0 }}>
        <SectionLabel icon={<TrendingUp size={13} />} label="Featured story" />
        <Link href={`/post/${heroPost.id}`}>
          <div
            className="relative rounded-3xl overflow-hidden p-6 sm:p-10 cursor-pointer group transition-all duration-300"
            style={{
              background: `linear-gradient(135deg, ${heroAuthor.avatarColor}30 0%, rgba(139,92,246,0.2) 40%, rgba(34,211,238,0.12) 100%)`,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.3)";
              e.currentTarget.style.boxShadow = "0 0 0 1px rgba(139,92,246,0.15), 0 30px 80px rgba(0,0,0,0.4), 0 0 80px rgba(139,92,246,0.08)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.boxShadow = "";
              e.currentTarget.style.transform = "";
            }}
          >
            {/* Background orbs */}
            <div
              className="absolute top-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: `radial-gradient(circle, ${heroAuthor.avatarColor}30, transparent 70%)`,
                filter: "blur(50px)",
              }}
            />
            <div
              className="absolute bottom-0 left-1/3 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(34,211,238,0.15), transparent 70%)", filter: "blur(40px)" }}
            />

            <div className="relative z-10 max-w-2xl">
              {/* Label */}
              <div
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full mb-5"
                style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "linear-gradient(135deg, #a78bfa, #22d3ee)" }}
                />
                Most loved this week
              </div>

              <h2
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-[1.15] mb-4 tracking-tight"
                style={{ fontFamily: "var(--app-font-serif)" }}
              >
                {heroPost.title}
              </h2>

              <p
                className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-6 max-w-lg"
                style={{ fontFamily: "var(--app-font-serif)" }}
              >
                {heroPost.subtitle}
              </p>

              {/* Author row */}
              <div className="flex flex-wrap items-center gap-4">
                <Link href={`/author/${heroAuthor.id}`} onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2.5 cursor-pointer">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 transition-transform hover:scale-110"
                      style={{ backgroundColor: heroAuthor.avatarColor }}
                    >
                      {heroAuthor.avatarInitials}
                    </div>
                    <span className="text-sm font-medium text-foreground hover:text-violet-300 transition-colors">
                      {heroAuthor.name}
                    </span>
                  </div>
                </Link>

                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{heroPost.publishedAt}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {heroPost.readTime} min</span>
                  <span className="flex items-center gap-1">
                    <Heart size={10} style={{ fill: "rgba(167,139,250,0.6)", color: "rgba(167,139,250,0.6)" }} />
                    {heroPost.claps.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6">
                <span
                  className="inline-flex items-center gap-2 text-sm font-semibold text-white px-5 py-2.5 rounded-full transition-all group-hover:gap-3"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)", boxShadow: "0 4px 20px rgba(139,92,246,0.3)" }}
                >
                  Read story <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* ── Staff picks ── */}
      <section className="animate-fade-up delay-200" style={{ opacity: 0 }}>
        <SectionLabel icon={<Sparkles size={13} />} label="Staff picks" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffPicks.map((post, i) => {
            const author = getAuthorById(post.authorId)!;
            return (
              <StaffPickCard
                key={post.id}
                index={i}
                postId={post.id}
                title={post.title}
                preview={excerpt(post.subtitle || post.content)}
                authorName={author.name}
                authorInitials={author.avatarInitials}
                authorColor={author.avatarColor}
                authorId={author.id}
                tags={post.tags}
                readTime={post.readTime}
                claps={post.claps}
                delay={i * 80}
              />
            );
          })}
        </div>
      </section>

      {/* ── Author spotlights ── */}
      <section className="animate-fade-up delay-200" style={{ opacity: 0 }}>
        <SectionLabel icon={<Users size={13} />} label="Author spotlights" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {spotlightAuthors.map((author) => {
            const authorPosts = getPostsByAuthor(author.id);
            const totalClaps = authorPosts.reduce((s, p) => s + p.claps, 0);
            const topPost = [...authorPosts].sort((a, b) => b.claps - a.claps)[0];
            return (
              <div
                key={author.id}
                className="glass-card rounded-2xl p-5 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start gap-3 mb-4">
                  <Link href={`/author/${author.id}`}>
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-base font-bold flex-shrink-0 cursor-pointer transition-transform hover:scale-105"
                      style={{
                        backgroundColor: author.avatarColor,
                        boxShadow: `0 0 16px ${author.avatarColor}40`,
                      }}
                    >
                      {author.avatarInitials}
                    </div>
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/author/${author.id}`}>
                      <p className="text-sm font-bold text-foreground hover:text-violet-300 transition-colors cursor-pointer truncate">
                        {author.name}
                      </p>
                    </Link>
                    <p className="text-[11px] text-muted-foreground mt-0.5">@{author.username}</p>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
                  {author.bio}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-3 mb-4 text-[11px] text-muted-foreground/70">
                  <span>
                    <span className="font-semibold gradient-text">{author.followers.toLocaleString()}</span> followers
                  </span>
                  <span>
                    <span className="font-semibold gradient-text">{authorPosts.length}</span> stories
                  </span>
                  <span>
                    <span className="font-semibold gradient-text">{totalClaps.toLocaleString()}</span> claps
                  </span>
                </div>

                {/* Top post teaser */}
                {topPost && (
                  <Link href={`/post/${topPost.id}`}>
                    <div
                      className="rounded-xl px-3 py-2.5 mb-4 cursor-pointer transition-all"
                      style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)"; e.currentTarget.style.background = "rgba(139,92,246,0.06)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    >
                      <p className="text-[10px] text-muted-foreground/60 uppercase tracking-wider mb-1">Top story</p>
                      <p
                        className="text-xs font-semibold text-foreground/90 line-clamp-2 leading-snug"
                        style={{ fontFamily: "var(--app-font-serif)" }}
                      >
                        {topPost.title}
                      </p>
                    </div>
                  </Link>
                )}

                <Link href={`/author/${author.id}`}>
                  <span
                    className="text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    style={{ color: "#a78bfa" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c4b5fd"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#a78bfa"; }}
                  >
                    View profile <ArrowRight size={11} />
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Browse by topic ── */}
      <section className="animate-fade-up delay-300" style={{ opacity: 0 }}>
        <SectionLabel icon={<BookOpen size={13} />} label="Browse by topic" />
        <div className="flex flex-wrap gap-2.5">
          {TOPICS.map((topic) => (
            <button
              key={topic.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: topic.color,
                border: "1px solid rgba(255,255,255,0.08)",
                color: "hsl(240 15% 80%)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.3)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              }}
            >
              {topic.label}
              <span
                className="text-[10px] px-1.5 py-0.5 rounded-full font-bold"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.5)" }}
              >
                {topic.count}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Latest from the community ── */}
      <section className="animate-fade-up delay-300" style={{ opacity: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span style={{ color: "#a78bfa" }}><BookOpen size={13} /></span>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
              Latest from the community
            </h2>
          </div>
          <Link href="/" className="text-xs font-semibold flex items-center gap-1 transition-colors"
            style={{ color: "#a78bfa" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#c4b5fd"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "#a78bfa"; }}>
            All stories <ArrowRight size={11} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {latestPosts.map((post, i) => {
            const author = getAuthorById(post.authorId)!;
            return (
              <Link key={post.id} href={`/post/${post.id}`}>
                <div
                  className="glass-card rounded-2xl p-4 cursor-pointer h-full animate-fade-up"
                  style={{ animationDelay: `${i * 60}ms`, opacity: 0 }}
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0"
                      style={{ backgroundColor: author.avatarColor }}
                    >
                      {author.avatarInitials}
                    </div>
                    <span className="text-xs text-muted-foreground">{author.name}</span>
                    <span className="text-muted-foreground/30">·</span>
                    <span className="text-xs text-muted-foreground/60">{post.publishedAt}</span>
                  </div>

                  <h3
                    className="text-[0.9375rem] font-bold text-foreground leading-snug mb-2 line-clamp-2"
                    style={{ fontFamily: "var(--app-font-serif)" }}
                  >
                    {post.title}
                  </h3>

                  <div className="flex items-center justify-between gap-2 mt-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {post.tags.slice(0, 1).map((t) => (
                        <span key={t} className="tag-pill">{t}</span>
                      ))}
                      <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground/50">
                        <Clock size={9} /> {post.readTime}m
                      </span>
                    </div>
                    <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground/50 flex-shrink-0">
                      <Heart size={9} style={{ fill: "rgba(167,139,250,0.4)", color: "rgba(167,139,250,0.4)" }} />
                      {post.claps.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="animate-fade-up delay-400 pb-4" style={{ opacity: 0 }}>
        <div
          className="rounded-3xl p-8 sm:p-10 text-center relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(34,211,238,0.1), rgba(249,115,22,0.08))",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.25), transparent 70%)", filter: "blur(30px)" }}
          />
          <div className="relative z-10">
            <h2
              className="text-xl sm:text-2xl font-bold text-foreground mb-2"
              style={{ fontFamily: "var(--app-font-serif)" }}
            >
              Something to say?
            </h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xs mx-auto leading-relaxed">
              Every great piece of writing starts with a single sentence. Yours is waiting.
            </p>
            <Link href="/write">
              <span
                className="inline-flex items-center gap-2 text-sm font-semibold text-white px-6 py-2.5 rounded-full transition-all"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)", boxShadow: "0 4px 24px rgba(139,92,246,0.35)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(139,92,246,0.5)"; (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(139,92,246,0.35)"; (e.currentTarget as HTMLElement).style.transform = ""; }}
              >
                Start writing <ArrowRight size={14} />
              </span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
