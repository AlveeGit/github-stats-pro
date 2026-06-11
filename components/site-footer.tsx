import Link from "next/link";

const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL ??
  "https://github.com/YOUR_USERNAME/github-stats-pro";

const FOOTER_LINKS = [
  { href: "/", label: "Home" },
  { href: "/guide", label: "How to Use" },
  { href: "/cards", label: "Card Types" },
  { href: "/examples", label: "Examples" },
  { href: "/self-host", label: "Self-Host" },
  { href: "/builder", label: "Builder" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-[#0c1019] mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <p className="font-semibold text-slate-100 text-sm">
              GitHub Stats Pro
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xs">
              Self-hosted SVG cards for your GitHub README. Free to deploy on
              Vercel with your own API token.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
              Pages
            </p>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">
              API Endpoints
            </p>
            <ul className="space-y-2 text-sm font-mono text-slate-500">
              <li>/api/stats</li>
              <li>/api/langs</li>
              <li>/api/streak</li>
              <li>/api/repo</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600">
          <p>© {new Date().getFullYear()} GitHub Stats Pro. MIT License.</p>
          <p>Built with ❤️ by <a href="https://github.com/alveegit" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors">Alvee Kabir</a></p>
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-slate-300 transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </div>
    </footer>
  );
}
