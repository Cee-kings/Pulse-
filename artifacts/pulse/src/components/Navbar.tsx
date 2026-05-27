import { Link, useLocation } from "wouter";
import { PenLine } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            Pulse
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm transition-colors ${
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
        </nav>
      </div>
    </header>
  );
}
