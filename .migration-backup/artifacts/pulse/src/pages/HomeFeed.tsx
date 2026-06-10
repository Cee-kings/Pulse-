import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, Clock, TrendingUp } from "lucide-react";
import { posts as mockPosts, getAuthorById, type Post, type Author } from "../data/mockData";
import { getAllPosts, type LocalPost } from "../lib/postStorage";
import { FeedSkeleton } from "../components/Skeleton";

const TABS = ["For you", "Following", "Technology", "Culture", "Design"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function excerpt(text: string, max = 140): string {
  if (!text) return "";
  const clean = text.replace(/\n+/g, " ").trim();
  return clean.length > max ? clean.slice(0, max).trimEnd() + "…" : clean;
}

interface FeedCardData {
  id: string;
  href: string;
  title: string;
  preview: string;
  authorName: string;
  authorInitials: string;
  authorColor: string;
  authorHref?: string;
  date: string;
  readTime: number;
  claps: number;
  tags: string[];
  isNew?: boolean;
}

function FeedCard({ card, index }: { card: FeedCardData; index: number }) {
  return (
    <article
      className="glass-card rounded-2xl p-5 sm:p-6 animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, opacity: 0 }}
    >
      {/* Byline */}
      <div className="flex items-center gap-2 mb-4">
        {card.authorHref ? (
          <Link href={card.authorHref}>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
              style={{ backgroundColor: card.authorColor }}
            />
          </Link>
        ) : (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ backgroundColor: card.authorColor }}
          >
            {card.authorInitials}
          </div>
        )}
        {card.authorHref ? (
          <Link href={card.authorHref}>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 cursor-pointer transition-transform hover:scale-110 -ml-8"
              style={{ backgroundColor: card.authorColor }}
            >
              {card.authorInitials}
            </div>
          </Link>
        ) : null}

        <div className="flex items-center gap-1.5 text-xs leading-none min-w-0 ml-0">
          {card.authorHref ? (
            <Link href={card.authorHref} className="font-medium text-foreground hover:text-violet-400 transition-colors truncate">
              {card.authorName}
            </Link>
          ) : (
            <span className="font-medium text-foreground truncate">{card.authorName}</span>
          )}
          <span className="text-muted-foreground/40 flex-shrink-0">·</span>
          <span className="text-muted-foreground flex-shrink-0">{card.date}</span>
          {card.isNew && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none flex-shrink-0"
              style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd", border: "1px solid rgba(167,139,250,0.2)" }}>
              new
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      <Link href={card.href}>
        <div className="cursor-pointer mb-3">
          <h2
            className="text-[1.05rem] sm:text-[1.125rem] font-bold text-foreground leading-snug mb-2 transition-all group-hover:text-violet-300"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {card.title}
          </h2>
          {card.preview && (
            <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">{card.preview}</p>
          )}
        </div>
      </Link>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0 overflow-hidden flex-wrap">
          {card.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag-pill">{tag}</span>
          ))}
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground/70 whitespace-nowrap">
            <Clock size={10} />{card.readTime} min
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground/70 whitespace-nowrap flex-shrink-0">
          <Heart size={11} style={{ fill: "rgba(167,139,250,0.5)", color: "rgba(167,139,250,0.5)" }} />
          {card.claps.toLocaleString()}
        </div>
      </div>
    </article>
  );
}

function localToCard(post: LocalPost): FeedCardData {
  return {
    id: post.blobId, href: `/post/${post.blobId}`,
    title: post.title, preview: post.subtitle || excerpt(post.content),
    authorName: post.authorName,
    authorInitials: post.authorName.charAt(0).toUpperCase(),
    authorColor: "#8b5cf6",
    date: formatDate(post.publishedAt),
    readTime: post.readTime, claps: post.claps, tags: post.tags, isNew: true,
  };
}

function mockToCard(post: Post, author: Author): FeedCardData {
  return {
    id: post.id, href: `/post/${post.id}`,
    title: post.title, preview: post.subtitle || excerpt(post.content),
    authorName: author.name, authorInitials: author.avatarInitials, authorColor: author.avatarColor,
    authorHref: `/author/${author.id}`,
    date: post.publishedAt, readTime: post.readTime, claps: post.claps, tags: post.tags,
  };
}

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState("For you");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, []);

  const localPosts = getAllPosts();
  const allCards: FeedCardData[] = [
    ...localPosts.map(localToCard),
    ...mockPosts
      .map((p) => { const a = getAuthorById(p.authorId); return a ? mockToCard(p, a) : null; })
      .filter((c): c is FeedCardData => c !== null),
  ];

  // Top posts for sidebar
  const topPosts = [...mockPosts].sort((a, b) => b.claps - a.claps).slice(0, 3);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:flex lg:gap-12">
      {/* Main feed */}
      <main className="flex-1 min-w-0">
        {/* Tabs */}
        <div
          className="flex items-center gap-1 mb-6 overflow-x-auto scrollbar-none p-1 rounded-xl"
          style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="pb-0 text-sm whitespace-nowrap transition-all px-3 py-2 rounded-lg flex-shrink-0 font-medium"
              style={
                activeTab === tab
                  ? { background: "rgba(139,92,246,0.2)", color: "#c4b5fd", border: "1px solid rgba(139,92,246,0.25)" }
                  : { color: "hsl(240 8% 52%)", border: "1px solid transparent" }
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {loading ? (
          <FeedSkeleton />
        ) : allCards.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-muted-foreground text-sm">No stories yet.</p>
            <Link href="/write" className="mt-3 inline-block text-sm text-violet-400 hover:underline">
              Write the first one →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {allCards.map((card, i) => <FeedCard key={card.id} card={card} index={i} />)}
          </div>
        )}
      </main>

      {/* Sidebar — desktop only */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="sticky top-20 space-y-5">
          {/* Topics */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">Topics</h3>
            <div className="flex flex-wrap gap-1.5">
              {["Writing", "Mindfulness", "Technology", "Design", "Creativity", "Culture", "Food", "Philosophy", "Engineering", "AI"].map((topic) => (
                <button key={topic} className="tag-pill cursor-pointer">{topic}</button>
              ))}
            </div>
          </div>

          {/* Trending */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center gap-1.5 mb-4">
              <TrendingUp size={13} className="text-violet-400" />
              <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">Trending</h3>
            </div>
            <div className="space-y-4">
              {topPosts.map((post, i) => {
                const author = getAuthorById(post.authorId);
                if (!author) return null;
                return (
                  <Link href={`/post/${post.id}`} key={post.id}>
                    <div className="group cursor-pointer">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[11px] font-bold gradient-text">0{i + 1}</span>
                        <div className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: author.avatarColor }} />
                        <span className="text-xs text-muted-foreground truncate">{author.name}</span>
                      </div>
                      <p className="text-xs font-semibold text-foreground leading-snug group-hover:text-violet-300 transition-colors line-clamp-2"
                        style={{ fontFamily: "var(--app-font-serif)" }}>
                        {post.title}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-muted-foreground/60">
                        <Heart size={9} style={{ fill: "rgba(167,139,250,0.5)", color: "rgba(167,139,250,0.5)" }} />
                        {post.claps.toLocaleString()}
                        <span className="mx-1">·</span>
                        <Clock size={9} />
                        {post.readTime} min
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Who to read */}
          <div
            className="rounded-2xl p-4"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">Who to read</h3>
            <div className="space-y-3.5">
              {[
                { name: "Nadia Bloom",  bio: "Slow living & essays", initials: "NB", color: "#b54f2a", id: "author-3" },
                { name: "Theo Park",    bio: "Philosophy & AI",      initials: "TP", color: "#1a6b8a", id: "author-4" },
                { name: "Leila Santos", bio: "Food & memory",        initials: "LS", color: "#8a3a6b", id: "author-5" },
              ].map((person) => (
                <div key={person.id} className="flex items-center gap-2.5">
                  <Link href={`/author/${person.id}`}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 cursor-pointer transition-transform hover:scale-110"
                      style={{ backgroundColor: person.color }}>
                      {person.initials}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/author/${person.id}`}>
                      <p className="text-xs font-medium text-foreground truncate hover:text-violet-300 transition-colors cursor-pointer">{person.name}</p>
                    </Link>
                    <p className="text-[11px] text-muted-foreground truncate">{person.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/40 leading-relaxed px-1">
            © 2026 Pulse · About · Help · Terms
          </p>
        </div>
      </aside>
    </div>
  );
}
