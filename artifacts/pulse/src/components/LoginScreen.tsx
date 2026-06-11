import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { saveDisplayName } from "../hooks/useAuth";
import { Sparkles, Wallet } from "lucide-react";

export default function LoginScreen() {
  const { connect, connecting } = useWallet();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  async function handleConnect() {
    setError("");
    if (name.trim()) {
      saveDisplayName(name.trim());
    }
    try {
      await connect("Petra" as any);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Could not connect. Make sure the Petra extension is installed.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 relative">
      <div
        className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full animate-float opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.5), transparent 70%)", filter: "blur(40px)" }}
      />
      <div
        className="absolute bottom-1/3 right-1/4 w-36 h-36 rounded-full animate-float delay-400 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.5), transparent 70%)", filter: "blur(40px)" }}
      />

      <div className="w-full max-w-sm animate-fade-up">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl glass-strong mb-5 glow-sm">
            <Sparkles size={24} className="text-violet-400" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 gradient-text">Pulse</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            A modern creative ecosystem for writers.
          </p>
        </div>

        <div className="glass-strong rounded-2xl p-7 gradient-border">
          <h2 className="text-base font-semibold text-foreground mb-1">Connect your wallet</h2>
          <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
            Use your Petra wallet to sign in. Your Aptos address becomes your Pulse identity.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="display-name" className="block text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Display name <span className="normal-case opacity-60">(optional)</span>
              </label>
              <input
                id="display-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
                placeholder="e.g. Alex Rivera"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 leading-relaxed">{error}</p>
            )}

            <button
              type="button"
              onClick={handleConnect}
              disabled={connecting}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 relative overflow-hidden flex items-center justify-center gap-2"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
              onMouseEnter={(e) => {
                if (!connecting) {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,92,246,0.4)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = "1";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              {connecting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting…
                </>
              ) : (
                <>
                  <Wallet size={15} />
                  Connect Petra Wallet
                </>
              )}
            </button>
          </div>

          <p className="mt-6 text-xs text-muted-foreground/60 text-center leading-relaxed">
            Requires the{" "}
            <a
              href="https://petra.app"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              Petra browser extension
            </a>
            . No password needed.
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-5 text-xs text-muted-foreground/50">
          <span>6 authors</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>9 stories</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/30" />
          <span>Open platform</span>
        </div>
      </div>
    </div>
  );
}
