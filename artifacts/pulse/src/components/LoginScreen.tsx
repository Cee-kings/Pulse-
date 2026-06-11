import { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Ed25519PublicKey, Ed25519Signature } from "@aptos-labs/ts-sdk";
import { useAuth, saveDisplayName, saveSession } from "../hooks/useAuth";
import { Sparkles, Wallet, ShieldCheck, AlertCircle } from "lucide-react";

type Phase = "idle" | "connecting" | "sign" | "signing" | "verifying" | "error";

function generateNonce(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function verifyEd25519(
  publicKeyHex: string,
  signatureHex: string,
  fullMessage: string
): boolean {
  const pubKey = new Ed25519PublicKey(publicKeyHex);
  const sig = new Ed25519Signature(signatureHex);
  const msgBytes = new TextEncoder().encode(fullMessage);
  return pubKey.verifySignature({ message: msgBytes, signature: sig });
}

export default function LoginScreen() {
  const { connect, connected, account, signMessage, disconnect } = useWallet();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (connected && phase === "connecting") {
      setPhase("sign");
    }
  }, [connected, phase]);

  async function handleConnect() {
    setPhase("connecting");
    setErrorMsg("");
    try {
      await connect("Petra" as any);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "Failed to connect. Make sure the Petra extension is installed.");
      setPhase("error");
    }
  }

  async function handleSign() {
    if (!account?.address || !account?.publicKey) {
      setErrorMsg("Wallet account not available. Please reconnect.");
      setPhase("error");
      return;
    }

    setPhase("signing");
    setErrorMsg("");

    const nonce = generateNonce();

    try {
      const output = await signMessage({
        message: "Sign in to Pulse",
        nonce,
      });

      setPhase("verifying");

      const address = account.address.toString();
      const pubKeyStr = typeof account.publicKey === "string"
        ? account.publicKey
        : account.publicKey.toString();

      const sigStr = typeof output.signature === "string"
        ? output.signature
        : (output.signature as any).toString();

      let valid = false;
      try {
        valid = verifyEd25519(pubKeyStr, sigStr, output.fullMessage);
      } catch {
        valid = false;
      }

      if (!valid) {
        setErrorMsg("Signature verification failed. The signature did not match the wallet address.");
        setPhase("error");
        return;
      }

      const displayName = name.trim() || undefined;
      if (displayName) {
        saveDisplayName(displayName);
      }

      saveSession(address, displayName);
      login(address, displayName);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg || "Signing was rejected or failed.");
      setPhase("error");
    }
  }

  function handleRetry() {
    disconnect();
    setPhase("idle");
    setErrorMsg("");
  }

  const isLoading = phase === "connecting" || phase === "signing" || phase === "verifying";

  const phaseLabel: Record<Phase, string> = {
    idle: "Connect Petra Wallet",
    connecting: "Connecting…",
    sign: "Connect Petra Wallet",
    signing: "Waiting for signature…",
    verifying: "Verifying…",
    error: "Connect Petra Wallet",
  };

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
          {phase === "sign" ? (
            <>
              <div className="flex items-center gap-2 mb-1">
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                <h2 className="text-base font-semibold text-foreground">Verify ownership</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                Wallet connected. Sign a message to cryptographically prove you own this address — nothing is sent on-chain.
              </p>
              <div
                className="rounded-xl px-4 py-3 mb-5 text-xs font-mono leading-relaxed break-all"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span className="text-muted-foreground/60 block mb-1 uppercase tracking-wider text-[10px] font-sans">Connected address</span>
                <span className="text-violet-300">{account?.address?.toString()}</span>
              </div>
              <button
                type="button"
                onClick={handleSign}
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
                onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,92,246,0.4)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
              >
                <ShieldCheck size={15} />
                Sign to verify
              </button>
              <button
                type="button"
                onClick={handleRetry}
                className="w-full mt-2 py-2 rounded-xl text-xs text-muted-foreground/70 hover:text-muted-foreground transition-colors"
              >
                Use a different wallet
              </button>
            </>
          ) : phase === "verifying" || phase === "signing" ? (
            <>
              <h2 className="text-base font-semibold text-foreground mb-1">
                {phase === "signing" ? "Waiting for signature…" : "Verifying signature…"}
              </h2>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {phase === "signing"
                  ? "Check your Petra extension and approve the sign request."
                  : "Checking the cryptographic proof — this takes just a moment."}
              </p>
              <div className="flex justify-center py-4">
                <span className="w-8 h-8 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
              </div>
            </>
          ) : (
            <>
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
                    onChange={(e) => { setName(e.target.value); if (errorMsg) setErrorMsg(""); }}
                    placeholder="e.g. Alex Rivera"
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = "rgba(167,139,250,0.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.1)"; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.boxShadow = "none"; }}
                  />
                </div>

                {phase === "error" && errorMsg && (
                  <div className="flex items-start gap-2 rounded-xl px-3.5 py-3 text-xs text-red-300 leading-relaxed"
                    style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <AlertCircle size={14} className="shrink-0 mt-0.5 text-red-400" />
                    {errorMsg}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleConnect}
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
                  onMouseEnter={(e) => { if (!isLoading) { e.currentTarget.style.opacity = "0.9"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,92,246,0.4)"; } }}
                  onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
                >
                  {isLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {phaseLabel[phase]}
                    </>
                  ) : (
                    <>
                      <Wallet size={15} />
                      {phaseLabel[phase]}
                    </>
                  )}
                </button>
              </div>

              <p className="mt-6 text-xs text-muted-foreground/60 text-center leading-relaxed">
                Requires the{" "}
                <a href="https://petra.app" target="_blank" rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
                  Petra browser extension
                </a>
                . No password needed.
              </p>
            </>
          )}
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
