"use client";

import Link from "next/link";
import { SectionHeading } from "@/components/section-heading";
import { STEPS } from "@/lib/guide-data";
import { useOrigin } from "@/components/use-origin";
import { BookOpen, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GuideContent() {
  const baseUrl = useOrigin();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionHeading
        icon={BookOpen}
        title="How to Use"
        subtitle="Four simple steps from zero to embedded card."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {STEPS.map((s) => (
          <div
            key={s.step}
            className="rounded-xl border border-slate-800/80 bg-[#151b27] p-5"
          >
            <span className="inline-flex items-center justify-center size-7 rounded-full bg-blue-500/15 text-blue-400 text-sm font-bold mb-3">
              {s.step}
            </span>
            <h3 className="font-semibold text-slate-100 text-sm mb-2">
              {s.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              {s.body}
            </p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl mx-auto rounded-xl border border-slate-800/80 bg-[#151b27] p-5 sm:p-6">
        <h3 className="font-semibold text-slate-100 text-sm mb-3 flex items-center gap-2">
          <Wand2 className="size-4 text-blue-400" />
          Markdown embed format
        </h3>
        <p className="text-sm text-slate-400 mb-3">
          Paste this into any GitHub README, GitLab profile, or blog that
          supports Markdown images:
        </p>
        <pre className="rounded-lg bg-[#0a0e17] border border-slate-700/60 p-4 text-xs font-mono text-emerald-400/90 overflow-x-auto">
          {`![GitHub Stats](${baseUrl || "https://your-app.vercel.app"}/api/stats?username=YOUR_USERNAME)`}
        </pre>
        <p className="mt-3 text-xs text-slate-500">
          Replace{" "}
          <span className="font-mono text-slate-400">YOUR_USERNAME</span> with
          your GitHub handle. Use the{" "}
          <Link href="/builder" className="text-blue-400 hover:underline">
            builder
          </Link>{" "}
          to generate the exact URL with your chosen theme and options.
        </p>
      </div>

      <div className="mt-10 text-center">
        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
          <Link href="/builder">Open the Card Builder</Link>
        </Button>
      </div>
    </div>
  );
}
