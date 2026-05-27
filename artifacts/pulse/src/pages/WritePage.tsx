import { useState } from "react";
import { useLocation } from "wouter";
import { Send, Eye } from "lucide-react";
import shelbyStorage from "../lib/shelbyStorage";

interface DraftPost {
  title: string;
  subtitle: string;
  content: string;
  tags: string;
  savedAt: string;
}

const DRAFT_KEY = "pulse_draft";

export default function WritePage() {
  const [, navigate] = useLocation();
  const [title, setTitle] = useState(
    () => (shelbyStorage.get<DraftPost>(DRAFT_KEY)?.title) ?? ""
  );
  const [subtitle, setSubtitle] = useState(
    () => (shelbyStorage.get<DraftPost>(DRAFT_KEY)?.subtitle) ?? ""
  );
  const [content, setContent] = useState(
    () => (shelbyStorage.get<DraftPost>(DRAFT_KEY)?.content) ?? ""
  );
  const [tags, setTags] = useState(
    () => (shelbyStorage.get<DraftPost>(DRAFT_KEY)?.tags) ?? ""
  );
  const [saved, setSaved] = useState(false);
  const [preview, setPreview] = useState(false);

  function saveDraft() {
    shelbyStorage.set<DraftPost>(DRAFT_KEY, {
      title,
      subtitle,
      content,
      tags,
      savedAt: new Date().toISOString(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  if (preview) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => setPreview(false)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to editing
          </button>
          <span className="text-sm text-muted-foreground">{readTime} min read preview</span>
        </div>
        <article>
          <h1 className="text-3xl font-bold text-foreground leading-tight mb-3" style={{ fontFamily: "var(--app-font-serif)" }}>
            {title || "Untitled"}
          </h1>
          {subtitle && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">
              {subtitle}
            </p>
          )}
          <div className="border-t border-border pt-8">
            <div className="prose-pulse whitespace-pre-wrap">
              {content || <span className="text-muted-foreground">Nothing written yet…</span>}
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            {wordCount > 0 ? `${wordCount} words · ${readTime} min read` : "Start writing"}
          </span>
          {saved && (
            <span className="text-xs text-primary">Draft saved</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={saveDraft}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
          >
            Save draft
          </button>
          <button
            onClick={() => setPreview(true)}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-1.5 rounded-full transition-colors"
          >
            <Send size={13} />
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-0">
        <div
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Title"
          onInput={(e) => setTitle(e.currentTarget.textContent ?? "")}
          className="w-full text-3xl font-bold text-foreground leading-tight outline-none placeholder:text-muted-foreground empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40 py-2 border-none bg-transparent resize-none"
          style={{ fontFamily: "var(--app-font-serif)" }}
        />

        <div
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Add a subtitle…"
          onInput={(e) => setSubtitle(e.currentTarget.textContent ?? "")}
          className="w-full text-xl text-muted-foreground leading-relaxed outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40 py-2 bg-transparent"
        />

        <div className="border-t border-border my-4" />

        <div
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Tell your story…"
          onInput={(e) => setContent(e.currentTarget.textContent ?? "")}
          className="w-full min-h-96 text-lg leading-relaxed outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/40 py-2 bg-transparent prose-pulse"
          style={{ whiteSpace: "pre-wrap" }}
        />

        <div className="border-t border-border mt-8 pt-6">
          <div className="flex items-center gap-3">
            <label className="text-sm text-muted-foreground whitespace-nowrap">Tags:</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="writing, creativity, culture (comma-separated)"
              className="flex-1 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
