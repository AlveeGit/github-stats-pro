"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Menu, X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/guide", label: "How to Use" },
  { href: "/cards", label: "Card Types" },
  { href: "/examples", label: "Examples" },
  { href: "/builder", label: "Builder" },
] as const;

export function SiteNavbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0f1419]/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 text-white font-bold text-sm sm:text-base"
            onClick={() => setOpen(false)}
          >
            <span className="flex items-center justify-center size-7 rounded-md bg-blue-500/15 text-blue-400">
              <Wand2 className="size-3.5" />
            </span>
            <span className="hidden min-[400px]:inline">GitHub Stats Pro</span>
            <span className="min-[400px]:hidden">GSP</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  pathname === link.href
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button
              asChild
              size="sm"
              className="hidden sm:inline-flex bg-blue-600 hover:bg-blue-500 text-white"
            >
              <Link href="/builder">Open Builder</Link>
            </Button>

            <button
              type="button"
              className="md:hidden flex items-center justify-center size-9 rounded-md border border-slate-700/60 text-slate-300 hover:bg-slate-800"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <nav className="md:hidden border-t border-slate-800/80 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "block px-3 py-2.5 rounded-md text-sm transition-colors",
                  pathname === link.href
                    ? "bg-slate-800 text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50",
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/builder"
              onClick={() => setOpen(false)}
              className="block px-3 py-2.5 rounded-md text-sm font-medium text-blue-400 hover:bg-slate-800/50 sm:hidden"
            >
              Open Builder →
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
