import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/section-heading";
import { CARD_TYPES } from "@/lib/guide-data";
import {
  BarChart3,
  Code2,
  Flame,
  FolderGit2,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CARD_ICONS = {
  stats: BarChart3,
  langs: Code2,
  streak: Flame,
  repo: FolderGit2,
} as const;

export function CardsContent() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <SectionHeading
        icon={Rocket}
        title="Card Types"
        subtitle="Four card styles — pick the one that fits your profile."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {CARD_TYPES.map((c) => {
          const Icon = CARD_ICONS[c.type];
          return (
            <Card
              key={c.type}
              className="bg-[#151b27] border-slate-800/80 ring-slate-800/60"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Icon className="size-4 text-blue-400" />
                  <CardTitle className="text-slate-100 text-base">
                    {c.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-slate-400">{c.description}</p>
                <div>
                  <p className="text-xs text-slate-500 mb-1">API endpoint</p>
                  <code className="text-xs font-mono text-blue-300/90 bg-[#0a0e17] px-2 py-1 rounded">
                    GET /api/{c.type}
                  </code>
                </div>
                <div>
                  <p className="text-xs text-slate-500 mb-1">Common params</p>
                  <p className="text-xs font-mono text-slate-400 leading-relaxed wrap-break-word">
                    {c.params}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="text-center">
        <Button asChild className="bg-blue-600 hover:bg-blue-500 text-white">
          <Link href="/builder">Build a card now</Link>
        </Button>
      </div>
    </div>
  );
}
