import { useState } from "react";
import { Link } from "wouter";
import { Heart } from "lucide-react";
import { posts as mockPosts, getAuthorById } from "../data/mockData";
import { getAllPosts, type LocalPost } from "../lib/postStorage";

const TABS = ["For you", "Following", "Technology", "Culture", "Design"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function LocalPostCard({ post }: { post: LocalPost }) {
  return (
    <article className="py-8 border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0">
          {post.authorName.charAt(0).toUpperCase()}
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium text-foreground">{post.authorName}</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{formatDate(post.publishedAt)}</span>
          <span className="text-xs font-mono text-primary/70 bg-primary/8 px-1.5 py-0.5 rounded">
            new
          </span>
        </div>
      </div>

      <Link href={`/post/${post.blobId}`}>
        <div className="cursor-pointer group">
          <h2 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-2">
            {post.title}
          </h2>
          {post.subtitle && (
            <p className="text-muted-foreground leading-relaxed line-clamp-2 text-base">
              {post.subtitle}
            </p>
          )}
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
          <span className="text-xs text-muted-foreground">{post.readTime} min read</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Heart size={14} className="fill-muted-foreground" />
          <span>{post.claps.toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
}

function MockPostCard({ post }: { post: typeof mockPosts[number] }) {
  const author = getAuthorById(post.authorId);
  if (!author) return null;
  return (
    <article className="py-8 border-b border-border last:border-b-0">
      <div className="flex items-center gap-3 mb-4">
        <Link href={`/author/${author.id}`}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold cursor-pointer flex-shrink-0"
            style={{ backgroundColor: author.avatarColor }}
          >
            {author.avatarInitials}
          </div>
        </Link>
        <div className="flex items-center gap-2 text-sm">
          <Link href={`/author/${author.id}`} className="font-medium text-foreground hover:text-primary transition-colors">
            {author.name}
          </Link>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{post.publishedAt}</span>
        </div>
      </div>

      <Link href={`/post/${post.id}`}>
        <div className="cursor-pointer group">
          <h2 className="text-xl font-bold text-foreground leading-snug group-hover:text-primary transition-colors mb-2">
            {post.title}
          </h2>
          <p className="text-muted-foreground leading-relaxed line-clamp-2 text-base">
            {post.subtitle}
          </p>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full">
              {tag}
            </span>
          ))}
          <span className="text-xs text-muted-foreground">{post.readTime} min read</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Heart size={14} className="fill-muted-foreground" />
          <span>{post.claps.toLocaleString()}</span>
        </div>
      </div>
    </article>
  );
}

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState("For you");
  const localPosts = getAllPosts();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 flex gap-16">
      <main className="flex-1 min-w-0">
        <div className="flex items-center gap-6 border-b border-border mb-2 overflow-x-auto">
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

        {localPosts.length === 0 && mockPosts.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No stories yet. Be the first to write one.</p>
          </div>
        )}

        {localPosts.map((post) => (
          <LocalPostCard key={post.blobId} post={post} />
        ))}

        {mockPosts.map((post) => (
          <MockPostCard key={post.id} post={post} />
        ))}
      </main>

      <aside className="w-72 flex-shrink-0 hidden lg:block">
        <div className="sticky top-20">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recommended topics</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {["Writing", "Mindfulness", "Technology", "Design", "Creativity", "Productivity", "Culture", "Essays"].map(
              (topic) => (
                <button
                  key={topic}
                  className="text-sm bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground px-3 py-1.5 rounded-full transition-colors"
                >
                  {topic}
                </button>
              )
            )}
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Who to read</h3>
            <div className="space-y-4">
              {[
                { name: "Mara Chen", bio: "Technology & creativity", initials: "MC", color: "#3d7a5c", id: "author-1" },
                { name: "Jordan Ellis", bio: "Design thinking", initials: "JE", color: "#6b4f9e", id: "author-2" },
                { name: "Nadia Bloom", bio: "Slow living & essays", initials: "NB", color: "#b54f2a", id: "author-3" },
              ].map((person) => (
                <div key={person.name} className="flex items-center gap-3">
                  <Link href={`/author/${person.id}`}>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 cursor-pointer"
                      style={{ backgroundColor: person.color }}
                    >
                      {person.initials}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{person.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{person.bio}</p>
                  </div>
                  <button className="text-xs font-medium text-foreground border border-border hover:border-foreground px-3 py-1 rounded-full transition-colors">
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-6 mt-6">
            <p className="text-xs text-muted-foreground">© 2026 Pulse · About · Help · Terms</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
