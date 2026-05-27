import { useState } from "react";
import { Link } from "wouter";
import { Heart, Clock } from "lucide-react";
import { posts as mockPosts, getAuthorById, type Post, type Author } from "../data/mockData";
import { getAllPosts, type LocalPost } from "../lib/postStorage";

const TABS = ["For you", "Following", "Technology", "Culture", "Design"];

function formatDate(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function excerpt(text: string, max = 130): string {
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
    <article className="py-7 border-b border-border last:border-b-0 group/card">
      <div className="flex items-center gap-2.5 mb-3.5">
        {card.authorHref ? (
          <Link href={card.authorHref}>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0 cursor-pointer"
              style={{ backgroundColor: card.authorColor }}
            >
              {card.authorInitials}
            </div>
          </Link>
        ) : (
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold flex-shrink-0"
            style={{ backgroundColor: card.authorColor }}
          >
            {card.authorInitials}
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm leading-none">
          {card.authorHref ? (
            <Link href={card.authorHref} className="font-medium text-foreground hover:text-primary transition-colors">
              {card.authorName}
            </Link>
          ) : (
            <span className="font-medium text-foreground">{card.authorName}</span>
          )}
          <span className="text-muted-foreground/60">·</span>
          <span className="text-muted-foreground text-xs">{card.date}</span>
          {card.isNew && (
            <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded-full leading-none">
              new
            </span>
          )}
        </div>
      </div>

      <Link href={card.href}>
        <div className="cursor-pointer">
          <h2
            className="text-[1.15rem] font-bold text-foreground leading-snug group-hover/card:text-primary transition-colors mb-2"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {card.title}
          </h2>
          {card.preview && (
            <p className="text-muted-foreground text-[0.9375rem] leading-relaxed">
              {card.preview}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {card.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} />
            {card.readTime} min
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Heart size={12} className="fill-muted-foreground/70" />
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
    <div className="max-w-5xl mx-auto px-6 py-10 flex gap-16">
      <main className="flex-1 min-w-0">
        <div className="flex items-center gap-6 border-b border-border mb-1 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm whitespace-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-foreground text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {allCards.length === 0 ? (
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

      <aside className="w-64 flex-shrink-0 hidden lg:block">
        <div className="sticky top-20 space-y-8">
          <div>
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {["Writing", "Mindfulness", "Technology", "Design", "Creativity", "Productivity", "Culture", "Essays"].map(
                (topic) => (
                  <button
                    key={topic}
                    className="text-xs bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground px-3 py-1.5 rounded-full transition-colors"
                  >
                    {topic}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4">
              Who to read
            </h3>
            <div className="space-y-4">
              {[
                { name: "Mara Chen", bio: "Technology & creativity", initials: "MC", color: "#3d7a5c", id: "author-1" },
                { name: "Jordan Ellis", bio: "Design thinking", initials: "JE", color: "#6b4f9e", id: "author-2" },
                { name: "Nadia Bloom", bio: "Slow living & essays", initials: "NB", color: "#b54f2a", id: "author-3" },
              ].map((person) => (
                <div key={person.name} className="flex items-center gap-3">
                  <Link href={`/author/${person.id}`}>
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-semibold flex-shrink-0 cursor-pointer"
                      style={{ backgroundColor: person.color }}
                    >
                      {person.initials}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground truncate">{person.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{person.bio}</p>
                  </div>
                  <button className="text-[11px] font-medium text-foreground border border-border hover:border-foreground px-2.5 py-1 rounded-full transition-colors whitespace-nowrap">
                    Follow
                  </button>
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
