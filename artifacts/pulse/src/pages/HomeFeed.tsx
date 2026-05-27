import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Heart, Clock } from "lucide-react";
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

function FeedCard({ card }: { card: FeedCardData }) {
  return (
    <article className="py-6 sm:py-7 border-b border-border last:border-b-0 group/card">
      {/* Byline */}
      <div className="flex items-center gap-2 mb-3">
        {card.authorHref ? (
          <Link href={card.authorHref}>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 cursor-pointer"
              style={{ backgroundColor: card.authorColor }}
            >
              {card.authorInitials}
            </div>
          </Link>
        ) : (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
            style={{ backgroundColor: card.authorColor }}
          >
            {card.authorInitials}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-xs leading-none min-w-0">
          {card.authorHref ? (
            <Link
              href={card.authorHref}
              className="font-medium text-foreground hover:text-primary transition-colors truncate"
            >
              {card.authorName}
            </Link>
          ) : (
            <span className="font-medium text-foreground truncate">{card.authorName}</span>
          )}
          <span className="text-muted-foreground/50 flex-shrink-0">·</span>
          <span className="text-muted-foreground flex-shrink-0">{card.date}</span>
          {card.isNew && (
            <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full leading-none flex-shrink-0">
              new
            </span>
          )}
        </div>
      </div>

      {/* Title + preview */}
      <Link href={card.href}>
        <div className="cursor-pointer">
          <h2
            className="text-base sm:text-[1.125rem] font-bold text-foreground leading-snug group-hover/card:text-primary transition-colors mb-1.5"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {card.title}
          </h2>
          {card.preview && (
            <p className="text-muted-foreground text-sm sm:text-[0.9375rem] leading-relaxed line-clamp-2">
              {card.preview}
            </p>
          )}
        </div>
      </Link>

      {/* Footer */}
      <div className="mt-3.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 overflow-hidden">
          {card.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[11px] bg-muted text-muted-foreground px-2.5 py-1 rounded-full whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground whitespace-nowrap">
            <Clock size={10} />
            {card.readTime} min
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
          <Heart size={11} className="fill-muted-foreground/60" />
          {card.claps.toLocaleString()}
        </div>
      </div>
    </article>
  );
}

function localToCard(post: LocalPost): FeedCardData {
  return {
    id: post.blobId,
    href: `/post/${post.blobId}`,
    title: post.title,
    preview: post.subtitle || excerpt(post.content),
    authorName: post.authorName,
    authorInitials: post.authorName.charAt(0).toUpperCase(),
    authorColor: "#3d7a5c",
    date: formatDate(post.publishedAt),
    readTime: post.readTime,
    claps: post.claps,
    tags: post.tags,
    isNew: true,
  };
}

function mockToCard(post: Post, author: Author): FeedCardData {
  return {
    id: post.id,
    href: `/post/${post.id}`,
    title: post.title,
    preview: post.subtitle || excerpt(post.content),
    authorName: author.name,
    authorInitials: author.avatarInitials,
    authorColor: author.avatarColor,
    authorHref: `/author/${author.id}`,
    date: post.publishedAt,
    readTime: post.readTime,
    claps: post.claps,
    tags: post.tags,
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
      .map((p) => {
        const author = getAuthorById(p.authorId);
        return author ? mockToCard(p, author) : null;
      })
      .filter((c): c is FeedCardData => c !== null),
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 lg:flex lg:gap-14">
      {/* Main feed */}
      <main className="flex-1 min-w-0">
        {/* Tabs */}
        <div className="flex items-center gap-5 border-b border-border mb-1 overflow-x-auto scrollbar-none -mx-1 px-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px flex-shrink-0 ${
                activeTab === tab
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
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
            <Link href="/write" className="mt-3 inline-block text-sm text-primary hover:underline">
              Write the first one →
            </Link>
          </div>
        ) : (
          allCards.map((card) => <FeedCard key={card.id} card={card} />)
        )}
      </main>

      {/* Sidebar — hidden on mobile/tablet */}
      <aside className="hidden lg:block w-60 flex-shrink-0">
        <div className="sticky top-20 space-y-8 pt-2">
          <div>
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Topics
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {[
                "Writing", "Mindfulness", "Technology", "Design",
                "Creativity", "Productivity", "Culture", "Essays",
                "Food", "Philosophy", "Engineering",
              ].map((topic) => (
                <button
                  key={topic}
                  className="text-xs bg-muted text-muted-foreground hover:bg-muted/70 hover:text-foreground px-2.5 py-1.5 rounded-full transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Who to read
            </h3>
            <div className="space-y-4">
              {[
                { name: "Mara Chen",    bio: "Technology & creativity", initials: "MC", color: "#3d7a5c", id: "author-1" },
                { name: "Nadia Bloom",  bio: "Slow living & essays",    initials: "NB", color: "#b54f2a", id: "author-3" },
                { name: "Theo Park",    bio: "Philosophy & AI",         initials: "TP", color: "#1a6b8a", id: "author-4" },
                { name: "Leila Santos", bio: "Food & memory",           initials: "LS", color: "#8a3a6b", id: "author-5" },
              ].map((person) => (
                <div key={person.id} className="flex items-center gap-2.5">
                  <Link href={`/author/${person.id}`}>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 cursor-pointer"
                      style={{ backgroundColor: person.color }}
                    >
                      {person.initials}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/author/${person.id}`}>
                      <p className="text-xs font-medium text-foreground truncate hover:text-primary transition-colors cursor-pointer">
                        {person.name}
                      </p>
                    </Link>
                    <p className="text-[11px] text-muted-foreground truncate">{person.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              © 2026 Pulse · About · Help · Terms
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
