import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Send, Eye, Check, Trash2, X, BookOpen } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { saveDraft, loadDraft, publishPost, clearDraft } from "../lib/postStorage";

type View = "editor" | "preview" | "publish";

export default function WritePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  const draft = loadDraft();
  const [title, setTitle]       = useState(draft?.title    ?? "");
  const [subtitle, setSubtitle] = useState(draft?.subtitle ?? "");
  const [content, setContent]   = useState(draft?.content  ?? "");
  const [tags, setTags]         = useState(draft?.tags     ?? "");

  const [view, setView]               = useState<View>("editor");
  const [draftStatus, setDraftStatus] = useState<"idle" | "saved">("idle");
  const [publishing, setPublishing]   = useState(false);
  const [publishError, setPublishError] = useState("");

  const titleRef    = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const contentRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current    && draft?.title)    titleRef.current.textContent    = draft.title;
    if (subtitleRef.current && draft?.subtitle) subtitleRef.current.textContent = draft.subtitle;
    if (contentRef.current  && draft?.content)  contentRef.current.textContent  = draft.content;
  }, []);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readTime  = Math.max(1, Math.round(wordCount / 200));

  function handleSaveDraft() {
    saveDraft({ title, subtitle, content, tags });
    setDraftStatus("saved");
    setTimeout(() => setDraftStatus("idle"), 2000);
  }

  function handleClear() {
    clearDraft();
    setTitle(""); setSubtitle(""); setContent(""); setTags("");
    if (titleRef.current)    titleRef.current.textContent    = "";
    if (subtitleRef.current) subtitleRef.current.textContent = "";
    if (contentRef.current)  contentRef.current.textContent  = "";
  }

  function handlePublish() {
    if (!title.trim())   { setPublishError("Please add a title."); return; }
    if (!content.trim()) { setPublishError("Please write something first."); return; }
    setPublishError("");
    setPublishing(true);
    setTimeout(() => {
      const post = publishPost({
        title, subtitle, content, tags,
        authorWalletId: user!.walletId,
        authorName:     user!.name,
      });
      navigate(`/post/${post.blobId}`);
    }, 700);
  }

  /* ── Preview ── */
  if (view === "preview") {
    return (
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <button
            onClick={() => setView("editor")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to editing
          </button>
          <span className="text-sm text-muted-foreground">{readTime} min preview</span>
        </div>
        <article>
          <h1
            className="text-[1.75rem] sm:text-4xl font-bold text-foreground leading-tight mb-4"
            style={{ fontFamily: "var(--app-font-serif)" }}
          >
            {title || "Untitled"}
          </h1>
          {subtitle && (
            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed mb-7"
               style={{ fontFamily: "var(--app-font-serif)" }}>
              {subtitle}
            </p>
          )}
          <div className="border-t border-border pt-8">
            {content ? (
              content.split("\n\n").map((p, i) => (
                <p
                  key={i}
                  className={`text-[1.0625rem] sm:text-[1.125rem] leading-[1.88] text-foreground mb-6 ${i === 0 ? "drop-cap" : ""}`}
                  style={{ fontFamily: "var(--app-font-serif)" }}
                >
                  {p}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground italic">Nothing written yet…</p>
            )}
          </div>
        </article>
      </div>
    );
  }

  /* ── Publish screen ── */
  if (view === "publish") {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="border border-border rounded-2xl p-6 sm:p-8 bg-white">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Ready to publish?</h2>
                <p className="text-sm text-muted-foreground mt-1">Review before it goes live.</p>
              </div>
              <button
                onClick={() => { setView("editor"); setPublishError(""); }}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Summary card */}
            <div className="bg-muted rounded-xl p-4 mb-5 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">Title</p>
                <p className="text-sm font-semibold text-foreground leading-snug">
                  {title || <span className="italic text-muted-foreground">Untitled</span>}
                </p>
              </div>
              {subtitle && (
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Subtitle</p>
                  <p className="text-sm text-foreground leading-snug line-clamp-2">{subtitle}</p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4 pt-1 border-t border-border/60">
                {[
                  ["Words", wordCount.toLocaleString()],
                  ["Read time", `${readTime} min`],
                  ["Author", user?.name ?? "—"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="mb-5">
              <p className="text-xs text-muted-foreground mb-2">Tags <span className="text-muted-foreground/60">(optional)</span></p>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="writing, culture, ideas"
                className="w-full px-3 py-2 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-white"
              />
            </div>

            {/* Blob note */}
            <div className="flex items-start gap-2 bg-muted/60 rounded-lg px-3 py-2.5 mb-5">
              <BookOpen size={12} className="text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                A <span className="font-mono">blob_id</span> will be generated and your wallet{" "}
                <span className="font-mono text-[10px]">{user?.walletId}</span> attached as author.
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
                  <Check size={14} /> Publish story
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Editor ── */
  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 sm:mb-8 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-muted-foreground whitespace-nowrap truncate">
            {wordCount > 0 ? `${wordCount} words · ${readTime} min` : "Start writing…"}
          </span>
          {draftStatus === "saved" && (
            <span className="text-xs text-primary flex items-center gap-1 whitespace-nowrap">
              <Check size={10} /> Saved
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {(title || content) && (
            <button
              onClick={handleClear}
              className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-md hover:bg-muted"
              title="Clear draft"
            >
              <Trash2 size={13} />
            </button>
          )}
          <button
            onClick={handleSaveDraft}
            className="hidden sm:block text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            Save draft
          </button>
          <button
            onClick={() => setView("preview")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground px-2.5 sm:px-3 py-1.5 rounded-md hover:bg-muted transition-colors"
          >
            <Eye size={13} />
            <span className="hidden sm:inline">Preview</span>
          </button>
          <button
            onClick={() => { setPublishError(""); setView("publish"); }}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-3 sm:px-4 py-1.5 rounded-full transition-colors"
          >
            <Send size={12} />
            Publish
          </button>
        </div>
      </div>

      {/* Editable fields */}
      <div>
        <div
          ref={titleRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Title"
          onInput={(e) => setTitle(e.currentTarget.textContent ?? "")}
          className="w-full text-[1.625rem] sm:text-3xl font-bold text-foreground leading-tight outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 py-2 bg-transparent"
          style={{ fontFamily: "var(--app-font-serif)" }}
        />
        <div
          ref={subtitleRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Add a subtitle…"
          onInput={(e) => setSubtitle(e.currentTarget.textContent ?? "")}
          className="w-full text-lg sm:text-xl text-muted-foreground leading-relaxed outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 py-2 bg-transparent"
          style={{ fontFamily: "var(--app-font-serif)" }}
        />
        <div className="border-t border-border my-4" />
        <div
          ref={contentRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Tell your story…"
          onInput={(e) => setContent(e.currentTarget.textContent ?? "")}
          className="w-full min-h-[24rem] sm:min-h-[28rem] text-base sm:text-lg leading-[1.85] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/30 py-2 bg-transparent"
          style={{ whiteSpace: "pre-wrap", fontFamily: "var(--app-font-serif)" }}
        />
      </div>

      {/* Mobile save button */}
      <div className="sm:hidden mt-6 pt-4 border-t border-border">
        <button
          onClick={handleSaveDraft}
          className="w-full py-2 text-sm text-muted-foreground border border-border rounded-lg hover:border-foreground transition-colors"
        >
          Save draft
        </button>
      </div>
    </div>
  );
}
