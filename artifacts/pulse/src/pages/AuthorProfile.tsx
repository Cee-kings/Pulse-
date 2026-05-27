import { useParams, Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { getAuthorById, getPostsByAuthor } from "../data/mockData";
import PostCard from "../components/PostCard";

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

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>

      <div className="mb-10">
        <div className="flex items-start gap-5 mb-6">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-semibold flex-shrink-0"
            style={{ backgroundColor: author.avatarColor }}
          >
            {author.avatarInitials}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{author.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">@{author.username}</p>
          </div>
        </div>

        <p className="text-base text-foreground leading-relaxed mb-6">{author.bio}</p>

        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-6">
          <div>
            <span className="font-semibold text-foreground">
              {author.followers.toLocaleString()}
            </span>{" "}
            followers
          </div>
          <div>
            <span className="font-semibold text-foreground">{author.following}</span> following
          </div>
          <div>Member since {author.joinedDate}</div>
        </div>

        <button
          className="px-5 py-2 rounded-full border border-foreground text-sm font-medium text-foreground hover:bg-foreground hover:text-white transition-colors"
        >
          Follow
        </button>
      </div>

      <div className="border-t border-border pt-8">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-6">
          {authorPosts.length} {authorPosts.length === 1 ? "story" : "stories"}
        </h2>

        {authorPosts.length === 0 ? (
          <p className="text-muted-foreground text-sm">No stories published yet.</p>
        ) : (
          <div>
            {authorPosts.map((post) => (
              <PostCard key={post.id} post={post} author={author} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
