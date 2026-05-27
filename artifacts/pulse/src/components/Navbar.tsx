import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PenLine, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-13 sm:h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 group">
          <span className="text-lg sm:text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Pulse
          </span>
        </Link>

        {/* Right side */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className={`text-sm transition-colors hidden md:block ${
              location === "/"
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Home
          </Link>

          <Link
            href="/write"
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 px-3 sm:px-4 py-1.5 rounded-full transition-colors"
          >
            <PenLine size={13} />
            <span>Write</span>
          </Link>

          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 sm:gap-2 pl-1 pr-1.5 sm:pr-2 py-1 rounded-full hover:bg-muted transition-colors"
                aria-label="Account menu"
                aria-expanded={menuOpen}
              >
                <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary text-xs font-bold select-none flex-shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none max-w-[120px]">
                  <span className="text-xs font-medium text-foreground truncate w-full">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate w-full">
                    {user.walletId}
                  </span>
                </div>
                <ChevronDown
                  size={12}
                  className={`text-muted-foreground hidden sm:block transition-transform duration-150 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-border rounded-xl shadow-md z-50 overflow-hidden py-1">
                    {/* Identity */}
                    <div className="px-4 py-2.5 border-b border-border mb-1">
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">
                        {user.walletId}
                      </p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <User size={14} />
                      My profile
                    </Link>

                    <Link
                      href="/write"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <PenLine size={14} />
                      New story
                    </Link>

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => { setMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <LogOut size={14} />
                        Sign out
                      </button>
                    </div>
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
