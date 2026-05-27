import { Link, useParams } from "wouter";
import { Heart, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import { getPostById, getAuthorById } from "../data/mockData";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const post = getPostById(id);
  const author = post ? getAuthorById(post.authorId) : undefined;
  const [clapped, setClapped] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [clapCount, setClapCount] = useState(post?.claps ?? 0);

  if (!post || !author) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-3">Post not found</h1>
        <p className="text-muted-foreground mb-6">This story doesn't exist or may have been removed.</p>
        <Link href="/" className="text-primary hover:underline text-sm">
          ← Back to home
        </Link>
      </div>
    );
  }

  function handleClap() {
    if (!clapped) {
      setClapCount((c) => c + 1);
      setClapped(true);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>

      <article>
        <h1
          className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4"
          style={{ fontFamily: "var(--app-font-serif)" }}
        >
          {post.title}
        </h1>

        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
          {post.subtitle}
        </p>

        <div className="flex items-center justify-between border-y border-border py-4 mb-10">
          <div className="flex items-center gap-3">
            <Link href={`/author/${author.id}`}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold flex-shrink-0 cursor-pointer"
                style={{ backgroundColor: author.avatarColor }}
              >
                {author.avatarInitials}
              </div>
            </Link>
            <div>
              <Link
                href={`/author/${author.id}`}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {author.name}
              </Link>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{post.readTime} min read</span>
                <span>·</span>
                <span>{post.publishedAt}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBookmarked((b) => !b)}
              className={`p-2 rounded-md hover:bg-muted transition-colors ${bookmarked ? "text-primary" : "text-muted-foreground"}`}
              aria-label="Bookmark"
            >
              <Bookmark size={18} className={bookmarked ? "fill-primary" : ""} />
            </button>
            <button
              className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground"
              aria-label="Share"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        <div className="prose-pulse whitespace-pre-line text-foreground leading-[1.85] text-lg space-y-6">
          {post.content.split("\n\n").map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex items-center gap-4">
            <button
              onClick={handleClap}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
                clapped
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
              }`}
            >
              <Heart size={16} className={clapped ? "fill-primary text-primary" : ""} />
              <span className="text-sm font-medium">{clapCount.toLocaleString()}</span>
            </button>
            <span className="text-sm text-muted-foreground">
              {clapped ? "Thanks for reading!" : "Did this resonate?"}
            </span>
          </div>
        </div>
      </article>

      <div className="mt-12 pt-8 border-t border-border">
        <Link href={`/author/${author.id}`} className="group flex items-start gap-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
            style={{ backgroundColor: author.avatarColor }}
          >
            {author.avatarInitials}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Written by</p>
            <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {author.name}
            </p>
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{author.bio}</p>
          </div>
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-sm bg-muted text-muted-foreground px-4 py-1.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
