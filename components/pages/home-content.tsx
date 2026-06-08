import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { FEATURES } from "@/lib/guide-data";
import {
  BarChart3,
  Code2,
  Flame,
  FolderGit2,
  Layers,
  Palette,
  Server,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURE_ICONS = [BarChart3, Code2, Flame, FolderGit2, Palette, Server];

export function HomeContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
          GitHub Stats Pro
        </h1>
        <p className="mt-4 text-slate-400 text-base sm:text-lg leading-relaxed">
          Generate beautiful, embeddable SVG cards for your GitHub profile.
          Stats, languages, streaks &amp; repo pins — customize live, copy &amp;
          paste into your README.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="lg"
            className="bg-blue-600 hover:bg-blue-500 w-full sm:w-auto text-white"
          >
            <Link href="/builder">
              Start Building <ArrowRight className="size-4 ml-1" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-slate-700 bg-transparent hover:bg-slate-800 w-full sm:w-auto"
          >
            <Link href="/guide">Read the guide</Link>
          </Button>
        </div>
      </div>

      {/* Intro */}
      <section className="mb-16 sm:mb-20">
        <SectionHeading
          icon={Sparkles}
          title="What is GitHub Stats Pro?"
          subtitle="A free, self-hosted alternative to popular README stat badges."
        />
        <div className="max-w-3xl mx-auto space-y-4 text-slate-400 text-sm sm:text-base leading-relaxed">
          <p>
            <strong className="text-slate-200">GitHub Stats Pro</strong> turns
            your GitHub data into lightweight SVG images you can embed anywhere
            with a single line of Markdown — just like adding an image to your
            README.
          </p>
          <p>
            Use the{" "}
            <Link
              href="/builder"
              className="text-blue-400 hover:text-blue-300 underline underline-offset-2"
            >
              live card builder
            </Link>{" "}
            to customize your card visually, then copy the generated URL or
            Markdown snippet. No API knowledge required.
          </p>
        </div>
      </section>

      {/* Features */}
      <section>
        <SectionHeading
          icon={Layers}
          title="Features"
          subtitle="Everything you need to make your GitHub profile stand out."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => {
            const Icon = FEATURE_ICONS[i];
            return (
              <Card
                key={f.title}
                className="bg-[#151b27] border-slate-800/80 ring-slate-800/60"
              >
                <CardContent className="pt-5">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center justify-center size-9 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 text-sm">
                        {f.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-slate-400 leading-relaxed">
                        {f.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
