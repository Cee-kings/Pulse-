import { useParams, Link } from "wouter";
import { ArrowLeft, Heart, Clock } from "lucide-react";
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
        <p className="text-muted-foreground mb-6">This profile doesn't exist.</p>
        <Link href="/" className="text-primary hover:underline text-sm">
          ← Back to home
        </Link>
      </div>
    );
  }

  const totalClaps = authorPosts.reduce((sum, p) => sum + p.claps, 0);

  return (
    <div className="max-w-[680px] mx-auto px-6 py-10">
      <div className="mb-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={14} /> Feed
        </Link>
      </div>

      {/* Header */}
      <header className="mb-10">
        <div className="flex items-start gap-5 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0"
            style={{ backgroundColor: author.avatarColor }}
          >
            {author.avatarInitials}
          </div>
          <div className="flex-1 pt-1">
            <h1 className="text-2xl font-bold text-foreground leading-tight">{author.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">@{author.username}</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-6 max-w-lg">{author.bio}</p>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-6">
          <span>
            <span className="font-semibold text-foreground">{author.followers.toLocaleString()}</span> followers
          </span>
          <span>
            <span className="font-semibold text-foreground">{author.following}</span> following
          </span>
          <span>
            <span className="font-semibold text-foreground">{authorPosts.length}</span>{" "}
            {authorPosts.length === 1 ? "story" : "stories"}
          </span>
          <span>
            <span className="font-semibold text-foreground">{totalClaps.toLocaleString()}</span> total claps
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-5 py-2 rounded-full border border-foreground text-sm font-medium text-foreground hover:bg-foreground hover:text-white transition-colors">
            Follow
          </button>
          <span className="text-xs text-muted-foreground">Member since {author.joinedDate}</span>
        </div>
      </header>

      {/* Posts */}
      <div className="border-t border-border pt-8">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-7">
          All stories
        </h2>

        {authorPosts.length === 0 ? (
          <p className="text-muted-foreground text-sm py-10 text-center">No stories published yet.</p>
        ) : (
          <div>
            {authorPosts.map((post) => (
              <article key={post.id} className="py-7 border-b border-border last:border-b-0 group">
                <Link href={`/post/${post.id}`}>
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
                      <span
                        key={tag}
                        className="text-xs bg-muted text-muted-foreground px-2.5 py-1 rounded-full"
                      >
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

                <p className="mt-3 text-xs text-muted-foreground">{post.publishedAt}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
