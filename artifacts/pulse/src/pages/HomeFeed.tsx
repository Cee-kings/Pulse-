import { useState } from "react";
import PostCard from "../components/PostCard";
import { posts, getAuthorById } from "../data/mockData";

const TABS = ["For you", "Following", "Technology", "Culture", "Design"];

export default function HomeFeed() {
  const [activeTab, setActiveTab] = useState("For you");

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

        <div>
          {posts.map((post) => {
            const author = getAuthorById(post.authorId);
            if (!author) return null;
            return <PostCard key={post.id} post={post} author={author} />;
          })}
        </div>
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
                { name: "Mara Chen", bio: "Technology & creativity", initials: "MC", color: "#3d7a5c" },
                { name: "Jordan Ellis", bio: "Design thinking", initials: "JE", color: "#6b4f9e" },
                { name: "Nadia Bloom", bio: "Slow living & essays", initials: "NB", color: "#b54f2a" },
              ].map((person) => (
                <div key={person.name} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                    style={{ backgroundColor: person.color }}
                  >
                    {person.initials}
                  </div>
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
            <p className="text-xs text-muted-foreground">
              © 2026 Pulse · About · Help · Terms
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
