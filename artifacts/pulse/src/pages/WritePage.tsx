import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Send, Eye, BookOpen, X, Check, Trash2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { saveDraft, loadDraft, publishPost, clearDraft } from "../lib/postStorage";

type View = "editor" | "preview" | "publish";

export default function WritePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const draft = loadDraft();
  const [title, setTitle] = useState(draft?.title ?? "");
  const [subtitle, setSubtitle] = useState(draft?.subtitle ?? "");
  const [content, setContent] = useState(draft?.content ?? "");
  const [tags, setTags] = useState(draft?.tags ?? "");

  const [view, setView] = useState<View>("editor");
  const [draftStatus, setDraftStatus] = useState<"idle" | "saved">("idle");
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current && draft?.title) titleRef.current.textContent = draft.title;
    if (subtitleRef.current && draft?.subtitle) subtitleRef.current.textContent = draft.subtitle;
    if (contentRef.current && draft?.content) contentRef.current.textContent = draft.content;
  }, []);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  function handleSaveDraft() {
    saveDraft({ title, subtitle, content, tags });
    setDraftStatus("saved");
    setTimeout(() => setDraftStatus("idle"), 2000);
  }

  function handleClearDraft() {
    clearDraft();
    setTitle("");
    setSubtitle("");
    setContent("");
    setTags("");
    if (titleRef.current) titleRef.current.textContent = "";
    if (subtitleRef.current) subtitleRef.current.textContent = "";
    if (contentRef.current) contentRef.current.textContent = "";
  }

  function handlePublish() {
    if (!title.trim()) {
      setPublishError("Please add a title before publishing.");
      return;
    }
    if (!content.trim()) {
      setPublishError("Please write something before publishing.");
      return;
    }
    setPublishError("");
    setPublishing(true);

    setTimeout(() => {
      const post = publishPost({
        title,
        subtitle,
        content,
        tags,
        authorWalletId: user!.walletId,
        authorName: user!.name,
      });
      setPublishing(false);
      navigate(`/post/${post.blobId}`);
    }, 700);
  }

  if (view === "preview") {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => setView("editor")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to editing
          </button>
          <span className="text-sm text-muted-foreground">{readTime} min read</span>
        </div>
        <article>
          <h1
            className="text-4xl font-bold text-foreground leading-tight mb-4"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {title || "Untitled"}
          </h1>
          {subtitle && (
            <p className="text-xl text-muted-foreground leading-relaxed mb-8">{subtitle}</p>
          )}
          <div className="border-t border-border pt-8">
            {content ? (
              <div className="prose-pulse">
                {content.split("\n\n").map((p, i) => (
                  <p key={i} className="mb-6 text-foreground leading-[1.85] text-lg">
                    {p}
                  </p>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground italic">Nothing written yet…</p>
            )}
          </div>
        </article>
      </div>
    );
  }

  if (view === "publish") {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border border-border rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Ready to publish?</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review your story before it goes live.
                </p>
              </div>
              <button
                onClick={() => { setView("editor"); setPublishError(""); }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-muted rounded-xl p-4 mb-6 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Title</p>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {title || <span className="text-muted-foreground italic">Untitled</span>}
                </p>
              </div>
              {subtitle && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Subtitle</p>
                  <p className="text-sm text-foreground leading-snug line-clamp-2">{subtitle}</p>
                </div>
              )}
              <div className="flex items-center gap-4 pt-1 border-t border-border/60">
                <div>
                  <p className="text-xs text-muted-foreground">Words</p>
                  <p className="text-sm font-medium text-foreground">{wordCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Read time</p>
                  <p className="text-sm font-medium text-foreground">{readTime} min</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Author</p>
                  <p className="text-sm font-medium text-foreground">{user?.name}</p>
                </div>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs text-muted-foreground mb-2">Tags (optional)</p>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="writing, creativity, culture"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-white"
              />
            </div>

            <div className="bg-muted/60 rounded-lg px-3 py-2.5 mb-5 flex items-start gap-2">
              <div className="mt-0.5 flex-shrink-0">
                <BookOpen size={13} className="text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                A unique <span className="font-mono">blob_id</span> will be generated and your wallet ID{" "}
                <span className="font-mono">{user?.walletId}</span> will be attached as the author.
              </p>
            </div>

            {publishError && (
              <p className="text-xs text-destructive mb-4">{publishError}</p>
            )}

            <button
              onClick={handlePublish}
              disabled={publishing}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              {publishing ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Publishing…
                </>
              ) : (
                <>
                  <Check size={15} />
                  Publish story
                </>
              )}
            </button>
          </div>
        </div>
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
          {draftStatus === "saved" && (
            <span className="text-xs text-primary flex items-center gap-1">
              <Check size={11} /> Draft saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {(title || content) && (
            <button
              onClick={handleClearDraft}
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"
              title="Clear draft"
            >
              <Trash2 size={14} />
            </button>
          )}
          <button
            onClick={handleSaveDraft}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
          >
            Save draft
          </button>
          <button
            onClick={() => setView("preview")}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-md hover:bg-muted"
          >
            <Eye size={14} />
            Preview
          </button>
          <button
            onClick={() => { setPublishError(""); setView("publish"); }}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-1.5 rounded-full transition-colors"
          >
            <Send size={13} />
            Publish
          </button>
        </div>
      </div>

      <div>
        <div
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Title"
          onInput={(e) => setTitle(e.currentTarget.textContent ?? "")}
          className="w-full text-3xl font-bold text-foreground leading-tight outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 py-2 bg-transparent"
          style={{ fontFamily: "var(--app-font-serif)" }}
        />

        <div
          ref={subtitleRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Add a subtitle…"
          onInput={(e) => setSubtitle(e.currentTarget.textContent ?? "")}
          className="w-full text-xl text-muted-foreground leading-relaxed outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 py-2 bg-transparent"
        />

        <div className="border-t border-border my-4" />

        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Tell your story…"
          onInput={(e) => setContent(e.currentTarget.textContent ?? "")}
          className="w-full min-h-[28rem] text-lg leading-relaxed outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 py-2 bg-transparent"
          style={{ whiteSpace: "pre-wrap", fontFamily: "var(--app-font-serif)" }}
        />
      </div>
    </div>
  );
}
