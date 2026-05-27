import { Link } from "wouter";
import { Heart } from "lucide-react";
import type { Post, Author } from "../data/mockData";

interface PostCardProps {
  post: Post;
  author: Author;
  variant?: "default" | "compact";
}

export default function PostCard({ post, author, variant = "default" }: PostCardProps) {
  if (variant === "compact") {
    return (
      <article className="flex gap-4 py-4 border-b border-border last:border-b-0">
        <div className="flex-1 min-w-0">
          <Link href={`/post/${post.id}`}>
            <h3 className="font-semibold text-foreground leading-snug hover:text-primary transition-colors line-clamp-2 cursor-pointer">
              {post.title}
            </h3>
          </Link>
          <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
            <span>{post.publishedAt}</span>
            <span>{post.readTime} min read</span>
            <span className="flex items-center gap-1">
              <Heart size={11} className="fill-muted-foreground" />
              {post.claps.toLocaleString()}
            </span>
          </div>
        </div>
      </article>
    );
  }

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
          <Link
            href={`/author/${author.id}`}
            className="font-medium text-foreground hover:text-primary transition-colors"
          >
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
            <span
              key={tag}
              className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full"
            >
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
