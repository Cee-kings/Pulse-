import { useState } from "react";
import { Link, useLocation } from "wouter";
import { PenLine, ChevronDown, LogOut, User, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-40"
      style={{
        background: "rgba(9,9,20,0.75)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center transition-all group-hover:scale-110"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}>
            <Sparkles size={13} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight gradient-text">Pulse</span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className={`text-sm transition-colors hidden md:block px-3 py-1.5 rounded-lg ${
              location === "/"
                ? "text-foreground font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
            }`}
          >
            Home
          </Link>

          <Link
            href="/write"
            className="flex items-center gap-1.5 text-sm font-semibold text-white px-3.5 sm:px-4 py-1.5 rounded-full transition-all"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #22d3ee)" }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 24px rgba(139,92,246,0.35)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
          >
            <PenLine size={13} />
            <span>Write</span>
          </Link>

          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 sm:gap-2 pl-1 pr-1.5 sm:pr-2 py-1 rounded-full transition-all hover:bg-white/5"
                aria-label="Account menu"
                aria-expanded={menuOpen}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 transition-all"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #22d3ee)",
                    boxShadow: menuOpen ? "0 0 0 2px rgba(167,139,250,0.4)" : undefined,
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none max-w-[110px]">
                  <span className="text-xs font-medium text-foreground truncate w-full">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground font-mono mt-0.5 truncate w-full">{user.walletId}</span>
                </div>
                <ChevronDown
                  size={12}
                  className={`text-muted-foreground hidden sm:block transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                  <div
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl z-50 overflow-hidden py-2"
                    style={{
                      background: "rgba(12,12,25,0.92)",
                      backdropFilter: "blur(30px)",
                      WebkitBackdropFilter: "blur(30px)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.1)",
                    }}
                  >
                    <div className="px-4 py-2.5 mb-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] font-mono text-muted-foreground mt-0.5 truncate">{user.walletId}</p>
                    </div>

                    {[
                      { href: "/profile", icon: <User size={14} />, label: "My profile" },
                      { href: "/write", icon: <PenLine size={14} />, label: "New story" },
                    ].map(({ href, icon, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        style={{ transition: "background 0.15s" }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}
                      >
                        {icon}{label}
                      </Link>
                    ))}

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", marginTop: "4px", paddingTop: "4px" }}>
                      <button
                        onClick={() => { setMenuOpen(false); logout(); }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-muted-foreground hover:text-red-400 transition-colors"
                        onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = ""; }}
                      >
                        <LogOut size={14} /> Sign out
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
