import { useState, type FormEvent } from "react";
import { useAuth } from "../hooks/useAuth";

export default function LoginScreen() {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    if (trimmed.length < 2) {
      setError("Name must be at least 2 characters.");
      return;
    }
    setError("");
    setLoading(true);
    setTimeout(() => {
      login(trimmed);
      setLoading(false);
    }, 600);
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-2">Pulse</h1>
          <p className="text-muted-foreground text-sm">
            A place for thoughtful writing.
          </p>
        </div>

        <div className="border border-border rounded-2xl p-8">
          <h2 className="text-lg font-semibold text-foreground mb-1">Create your writer identity</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your name and we'll generate a unique wallet ID for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="author-name" className="block text-sm font-medium text-foreground mb-1.5">
                Your name
              </label>
              <input
                id="author-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError("");
                }}
                placeholder="e.g. Alex Rivera"
                autoFocus
                className="w-full px-4 py-2.5 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-white"
              />
              {error && (
                <p className="text-xs text-destructive mt-1.5">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? "Generating wallet…" : "Enter Pulse"}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-border">
            <p className="text-xs text-muted-foreground text-center leading-relaxed">
              Your wallet ID is generated locally and stored in your browser.
              No account or password required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
