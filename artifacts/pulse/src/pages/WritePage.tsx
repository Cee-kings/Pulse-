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

  const [view, setView]             = useState<View>("editor");
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
      const post = publishPost({ title, subtitle, content, tags, authorWalletId: user!.walletId, authorName: user!.name });
      navigate(`/post/${post.blobId}`);
    }, 700);
  }

  const toolbarStyle: React.CSSProperties = {
    background: "rgba(9,9,20,0.8)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
  };

  /* ── Preview ── */
  if (view === "preview") {
    return (
      <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-up">
        <div className="flex items-center justify-between mb-10">
          <button onClick={() => setView("editor")}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5">
            ← Back to editing
          </button>
          <span className="text-sm text-muted-foreground">{readTime} min preview</span>
        </div>
        <h1 className="text-[1.75rem] sm:text-4xl font-bold leading-tight mb-4"
          style={{ fontFamily: "var(--app-font-serif)", color: "hsl(240 20% 94%)" }}>
          {title || "Untitled"}
        </h1>
        {subtitle && (
          <p className="text-lg sm:text-xl leading-relaxed mb-7"
            style={{ fontFamily: "var(--app-font-serif)", color: "hsl(240 8% 62%)" }}>
            {subtitle}
          </p>
        )}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", marginBottom: "2rem" }} />
        {content
          ? content.split("\n\n").map((p, i) => (
            <p key={i}
              className={`text-[1.0625rem] sm:text-[1.125rem] leading-[1.9] mb-6 ${i === 0 ? "drop-cap" : ""}`}
              style={{ fontFamily: "var(--app-font-serif)", color: "hsl(240 15% 85%)" }}>
              {p}
            </p>
          ))
          : <p className="text-muted-foreground italic">Nothing written yet…</p>
        }
      </div>
    );
  }

  /* ── Publish screen ── */
  if (view === "publish") {
    return (
      <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md animate-fade-up">
          <div className="glass-strong rounded-2xl p-6 sm:p-8 gradient-border">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Ready to publish?</h2>
                <p className="text-sm text-muted-foreground mt-1">Review before it goes live.</p>
              </div>
              <button onClick={() => { setView("editor"); setPublishError(""); }}
                className="text-muted-foreground hover:text-foreground p-1 transition-colors rounded-lg hover:bg-white/5">
                <X size={18} />
              </button>
            </div>

            <div className="rounded-xl p-4 mb-5 space-y-3"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Title</p>
                <p className="text-sm font-semibold text-foreground leading-snug" style={{ fontFamily: "var(--app-font-serif)" }}>
                  {title || <span className="italic text-muted-foreground">Untitled</span>}
                </p>
              </div>
              {subtitle && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Subtitle</p>
                  <p className="text-sm text-foreground/80 leading-snug line-clamp-2">{subtitle}</p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-4 pt-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                {[["Words", wordCount.toLocaleString()], ["Read time", `${readTime} min`], ["Author", user?.name ?? "—"]].map(([label, val]) => (
                  <div key={label}>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-foreground">{val}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
                Tags <span className="normal-case text-muted-foreground/50">(optional)</span>
              </p>
              <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                placeholder="writing, culture, ideas"
                className="w-full px-3 py-2 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
              />
            </div>

            <div className="flex items-start gap-2 rounded-xl px-3 py-2.5 mb-5"
              style={{ background: "rgba(34,211,238,0.06)", border: "1px solid rgba(34,211,238,0.12)" }}>
              <BookOpen size={12} className="text-cyan-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs leading-relaxed" style={{ color: "rgba(103,232,249,0.8)" }}>
                A <span className="font-mono">blob_id</span> will be minted with your wallet{" "}
                <span className="font-mono text-[10px]">{user?.walletId}</span> as author.
              </p>
            </div>

            {publishError && <p className="text-xs text-red-400 mb-4">{publishError}</p>}

            <button onClick={handlePublish} disabled={publishing}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
              onMouseEnter={(e) => { if (!publishing) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,92,246,0.4)"; }}}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = ""; }}>
              {publishing
                ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publishing…</>
                : <><Check size={14} />Publish story</>
              }
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Editor ── */
  return (
    <div className="max-w-[680px] mx-auto px-4 sm:px-6 py-8 sm:py-12 animate-fade-up">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-8 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs text-muted-foreground whitespace-nowrap truncate">
            {wordCount > 0 ? `${wordCount} words · ${readTime} min` : "Start writing…"}
          </span>
          {draftStatus === "saved" && (
            <span className="text-xs flex items-center gap-1 whitespace-nowrap" style={{ color: "#a78bfa" }}>
              <Check size={10} /> Saved
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          {(title || content) && (
            <button onClick={handleClear}
              className="p-1.5 text-muted-foreground hover:text-red-400 transition-colors rounded-lg hover:bg-white/5">
              <Trash2 size={13} />
            </button>
          )}
          <button onClick={handleSaveDraft}
            className="hidden sm:block text-sm text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
            Save draft
          </button>
          <button onClick={() => setView("preview")}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground px-2.5 sm:px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
            <Eye size={13} /><span className="hidden sm:inline">Preview</span>
          </button>
          <button onClick={() => { setPublishError(""); setView("publish"); }}
            className="flex items-center gap-1.5 text-sm font-semibold text-white px-3.5 sm:px-4 py-1.5 rounded-full transition-all"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,92,246,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = ""; }}>
            <Send size={12} />Publish
          </button>
        </div>
      </div>

      {/* Editable fields */}
      <div>
        <div ref={titleRef} contentEditable suppressContentEditableWarning
          data-placeholder="Title"
          onInput={(e) => setTitle(e.currentTarget.textContent ?? "")}
          className="w-full text-[1.625rem] sm:text-3xl font-bold leading-tight outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/20 py-2 bg-transparent"
          style={{ fontFamily: "var(--app-font-serif)", color: "hsl(240 20% 92%)" }}
        />
        <div ref={subtitleRef} contentEditable suppressContentEditableWarning
          data-placeholder="Add a subtitle…"
          onInput={(e) => setSubtitle(e.currentTarget.textContent ?? "")}
          className="w-full text-lg sm:text-xl leading-relaxed outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/20 py-2 bg-transparent"
          style={{ fontFamily: "var(--app-font-serif)", color: "hsl(240 8% 62%)" }}
        />
        <div style={{ height: "1px", background: "rgba(255,255,255,0.07)", margin: "1rem 0" }} />
        <div ref={contentRef} contentEditable suppressContentEditableWarning
          data-placeholder="Tell your story…"
          onInput={(e) => setContent(e.currentTarget.textContent ?? "")}
          className="w-full min-h-[24rem] sm:min-h-[28rem] text-base sm:text-lg leading-[1.9] outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/20 py-2 bg-transparent"
          style={{ whiteSpace: "pre-wrap", fontFamily: "var(--app-font-serif)", color: "hsl(240 15% 85%)" }}
        />
      </div>

      <div className="sm:hidden mt-6 pt-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <button onClick={handleSaveDraft}
          className="w-full py-2 text-sm text-muted-foreground rounded-xl transition-colors"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
          Save draft
        </button>
      </div>
    </div>
  );
}
