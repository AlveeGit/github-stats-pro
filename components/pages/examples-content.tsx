"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { buildExamples, TIPS } from "@/lib/guide-data";
import { builderHref } from "@/lib/build-card-url";
import { useOrigin } from "@/components/use-origin";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ExamplesContent() {
  const baseUrl = useOrigin();
  const examples = buildExamples(baseUrl);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionHeading
        icon={Sparkles}
        title="Examples"
        subtitle='Click "Try in builder" to load an example and see it live.'
      />

      <div className="space-y-4">
        {examples.map((ex) => (
          <Card
            key={ex.title}
            className="bg-[#151b27] border-slate-800/80 ring-slate-800/60"
          >
            <CardContent className="pt-5">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-100 text-sm">
                    {ex.title}
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400">
                    {ex.description}
                  </p>
                  <pre className="mt-3 rounded-lg bg-[#0a0e17] border border-slate-700/60 p-3 text-[11px] sm:text-xs font-mono text-slate-300 overflow-x-auto">
                    {ex.markdown}
                  </pre>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="shrink-0 border-slate-700/60 bg-[#0a0e17] hover:bg-slate-800 text-slate-200"
                >
                  <Link href={builderHref(ex.username, ex.config)}>
                    Try in builder
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        {TIPS.map((tip) => (
          <div
            key={tip.title}
            className={cn(
              "rounded-xl border border-slate-800/60 bg-[#151b27]/50 p-4",
            )}
          >
            <h4 className="text-sm font-medium text-slate-200">{tip.title}</h4>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">
              {tip.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
