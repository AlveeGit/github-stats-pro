"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ENV_VARS,
  getDeployUrl,
  HOSTING_STEPS,
  SELF_HOST_BENEFITS,
  TECH_STACK,
  TOKEN_SCOPES,
} from "@/lib/self-host-data";
import { Server, ExternalLink, Terminal } from "lucide-react";

const GITHUB_REPO =
  process.env.NEXT_PUBLIC_GITHUB_REPO_URL ??
  "https://github.com/alveegit/github-stats-pro";

export function SelfHostContent() {
  const deployUrl = getDeployUrl(GITHUB_REPO);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionHeading
        icon={Server}
        title="Self-Hosting"
        subtitle="Deploy your own instance on Vercel with your GitHub token — optional, but gives you full control."
      />

      {/* Why self-host */}
      <div className="max-w-3xl mx-auto mb-12">
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed text-center mb-6">
          The hosted builder works instantly with zero setup. Self-hosting is
          optional — use it when you want your own domain, dedicated rate limits,
          and full control over caching.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SELF_HOST_BENEFITS.map((benefit) => (
            <li
              key={benefit}
              className="flex items-start gap-2 text-sm text-slate-300 rounded-lg border border-slate-800/80 bg-[#151b27] px-4 py-3"
            >
              <span className="text-blue-400 mt-0.5">✓</span>
              {benefit}
            </li>
          ))}
        </ul>
      </div>

      {/* Deploy button */}
      <div className="max-w-xl mx-auto text-center mb-14">
        <a
          href={deployUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-opacity hover:opacity-90"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://vercel.com/button"
            alt="Deploy with Vercel"
            width={114}
            height={32}
          />
        </a>
        <p className="mt-3 text-xs text-slate-500">
          Fork{" "}
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            the repository
          </a>{" "}
          first, then update the deploy URL to point at your fork if needed.
        </p>
      </div>

      {/* Steps */}
      <section className="mb-14">
        <h2 className="text-lg font-semibold text-white text-center mb-6">
          Setup guide
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {HOSTING_STEPS.map((s) => (
            <Card
              key={s.step}
              className="bg-[#151b27] border-slate-800/80 ring-slate-800/60"
            >
              <CardContent className="pt-5">
                <span className="inline-flex items-center justify-center size-7 rounded-full bg-blue-500/15 text-blue-400 text-sm font-bold mb-3">
                  {s.step}
                </span>
                <h3 className="font-semibold text-slate-100 text-sm mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  {s.body}
                </p>
                {"link" in s && s.link && (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs text-blue-400 hover:text-blue-300"
                  >
                    {s.linkLabel}
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Environment variables */}
      <section className="mb-14 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4">
          Environment variables
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-800/80">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/80 bg-[#151b27]">
                <th className="text-left px-4 py-3 text-slate-400 font-medium">
                  Variable
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium">
                  Required
                </th>
                <th className="text-left px-4 py-3 text-slate-400 font-medium hidden sm:table-cell">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {ENV_VARS.map((v) => (
                <tr
                  key={v.name}
                  className="border-b border-slate-800/60 last:border-0 bg-[#0f1419]"
                >
                  <td className="px-4 py-3 font-mono text-xs text-emerald-400/90">
                    {v.name}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {v.required ? (
                      <span className="text-amber-400/90">Yes</span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs hidden sm:table-cell">
                    {v.description}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Token scopes */}
      <section className="mb-14 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recommended GitHub token scopes
        </h2>
        <div className="space-y-3">
          {TOKEN_SCOPES.map((row) => (
            <div
              key={row.useCase}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 rounded-lg border border-slate-800/80 bg-[#151b27] px-4 py-3"
            >
              <span className="text-sm text-slate-300">{row.useCase}</span>
              <code className="text-xs font-mono text-blue-300/90 bg-[#0a0e17] px-2 py-1 rounded">
                {row.scopes}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Local development */}
      <section className="mb-14 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Terminal className="size-5 text-blue-400" />
          Local development
        </h2>
        <div className="rounded-xl border border-slate-800/80 bg-[#151b27] p-5 sm:p-6 space-y-4">
          <pre className="rounded-lg bg-[#0a0e17] border border-slate-700/60 p-4 text-xs font-mono text-slate-300 overflow-x-auto">
            {`pnpm install\npnpm dev`}
          </pre>
          <p className="text-sm text-slate-400">
            Create a <code className="font-mono text-slate-300">.env.local</code>{" "}
            file in the project root:
          </p>
          <pre className="rounded-lg bg-[#0a0e17] border border-slate-700/60 p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto">
            {`GITHUB_PAT=your_token_here\nUPSTASH_REDIS_URL=\nUPSTASH_REDIS_TOKEN=`}
          </pre>
          <p className="text-xs text-slate-500">
            Open{" "}
            <code className="font-mono text-slate-400">http://localhost:3000</code>{" "}
            after starting the dev server.
          </p>
        </div>
      </section>

      {/* Tech stack */}
      <section className="mb-10 max-w-3xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4">Tech stack</h2>
        <div className="flex flex-wrap gap-2">
          {TECH_STACK.map((t) => (
            <a
              key={t.name}
              href={t.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full border border-slate-700/60 bg-[#151b27] text-slate-400 hover:text-slate-200 hover:border-slate-600 transition-colors"
            >
              {t.name}
            </a>
          ))}
        </div>
      </section>

      <div className="text-center">
        <p className="text-sm text-slate-500 mb-4">
          Already deployed? Use the builder with your own domain.
        </p>
        <Button asChild className="bg-blue-600 hover:bg-blue-500">
          <Link href="/builder">Open Card Builder</Link>
        </Button>
      </div>
    </div>
  );
}
