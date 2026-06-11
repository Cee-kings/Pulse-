import { useState, type FormEvent, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { AtSign, Sparkles } from "lucide-react";

const USERNAME_RE = /^[a-zA-Z0-9_]{3,20}$/;

export default function UsernamePrompt() {
  const { user, setUsername, skipUsernamePrompt } = useAuth();
  const [value, setValue] = useState(user?.username ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  function validate(v: string): string {
    if (!v.trim()) return "";
    if (v.length < 3) return "At least 3 characters.";
    if (v.length > 20) return "Max 20 characters.";
    if (!USERNAME_RE.test(v)) return "Letters, numbers, and underscores only.";
    return "";
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
    if (error) setError(validate(v));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    const err = validate(trimmed);
    if (err) { setError(err); return; }
    if (!trimmed) { skipUsernamePrompt(); return; }
    setSaving(true);
    setTimeout(() => {
      setUsername(trimmed);
      setSaving(false);
    }, 400);
  }

  const isEditing = !!user?.username;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-7 animate-fade-up"
        style={{
          background: "rgba(12,12,26,0.95)",
          border: "1px solid rgba(167,139,250,0.2)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(167,139,250,0.1)",
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(34,211,238,0.2))", border: "1px solid rgba(167,139,250,0.2)" }}>
            <AtSign size={18} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-foreground leading-tight">
              {isEditing ? "Edit username" : "Choose a username"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isEditing ? "Update how your name appears on Pulse." : "How you'll appear to other writers."}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-sm select-none">@</span>
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="yourname"
                maxLength={20}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/30 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)"}`,
                }}
                onFocus={(e) => {
                  if (!error) {
                    e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)";
                  }
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = error ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>
            {error
              ? <p className="text-xs text-red-400 mt-1.5">{error}</p>
              : value.trim().length > 0 && (
                  <p className="text-[11px] text-muted-foreground/50 mt-1.5">
                    {20 - value.trim().length} characters left
                  </p>
                )
            }
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
            onMouseEnter={(e) => { if (!saving) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,92,246,0.35)"; } }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.boxShadow = ""; }}
          >
            {saving ? (
              <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            ) : (
              <><Sparkles size={14} /> {value.trim() ? "Set username" : "Skip for now"}</>
            )}
          </button>
        </form>

        {!isEditing && (
          <button
            type="button"
            onClick={skipUsernamePrompt}
            className="w-full mt-3 text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors py-1"
          >
            Skip for now — use wallet address as identity
          </button>
        )}

        <p className="mt-4 text-[11px] text-muted-foreground/40 text-center leading-relaxed">
          3–20 characters · letters, numbers, underscores
        </p>
      </div>
    </div>
  );
}
