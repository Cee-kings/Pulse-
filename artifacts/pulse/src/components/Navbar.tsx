import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PenLine, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Pulse
          </span>
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className={`text-sm transition-colors hidden sm:block ${
              location === "/"
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </Link>

          <Link
            href="/write"
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-4 py-1.5 rounded-full transition-colors"
          >
            <PenLine size={14} />
            Write
          </Link>

          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-muted transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold select-none">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none">
                  <span className="text-xs font-medium text-foreground">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono mt-0.5">
                    {user.walletId}
                  </span>
                </div>
                <ChevronDown size={13} className="text-muted-foreground hidden sm:block" />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                    {/* Identity block */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
                        {user.walletId}
                      </p>
                    </div>

                    {/* Profile link */}
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <User size={14} />
                      My profile
                    </Link>

                    {/* Sign out */}
                    <button
                      onClick={() => { setMenuOpen(false); logout(); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border-t border-border"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
