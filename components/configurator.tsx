"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { themes } from "@/lib/themes";
import {
  buildCardUrl,
  buildMarkdown,
  defaultCardWidth,
  parseBuilderParams,
  type CardConfig,
  type CardType,
  type DateFormat,
  type LangsLayout,
} from "@/lib/build-card-url";
import { useOrigin } from "@/components/use-origin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Copy, Check, ExternalLink } from "lucide-react";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function OptionRow({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-slate-200">{label}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
        )}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function CopyField({
  label,
  value,
  monospace = true,
}: {
  label: string;
  value: string;
  monospace?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [value]);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-slate-400 uppercase tracking-wide">
        {label}
      </label>
      <div className="flex gap-2">
        <Input
          readOnly
          value={value}
          placeholder="Enter a username to generate…"
          className={cn(
            "bg-[#0a0e17] border-slate-700/60 text-slate-300",
            monospace && "font-mono text-xs",
          )}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={copy}
          disabled={!value}
          className="shrink-0 border-slate-700/60 bg-[#0a0e17] hover:bg-slate-800"
          aria-label={`Copy ${label}`}
        >
          {copied ? (
            <Check className="size-4 text-emerald-400" />
          ) : (
            <Copy className="size-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

function ThemeGrid({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (name: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 max-h-52 overflow-y-auto pr-1">
      {Object.entries(themes).map(([key, theme]) => (
        <button
          key={key}
          type="button"
          onClick={() => onSelect(key)}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-lg p-2 transition-all duration-200",
            "hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50",
            selected === key
              ? "bg-slate-800 ring-2 ring-blue-500 ring-offset-2 ring-offset-[#151b27] scale-[1.02]"
              : "bg-transparent",
          )}
        >
          <div className="grid grid-cols-2 gap-0.5 w-full rounded overflow-hidden h-8 border border-slate-700/40">
            <div className="h-full" style={{ background: theme.bg }} />
            <div className="h-full" style={{ background: theme.titleColor }} />
            <div className="h-full" style={{ background: theme.ringColor }} />
            <div className="h-full" style={{ background: theme.border }} />
          </div>
          <span className="text-[10px] text-slate-400 truncate w-full text-center leading-tight">
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
}

function CardPreview({
  url,
  cardType,
  username,
  repo,
}: {
  url: string;
  cardType: CardType;
  username: string;
  repo: string;
}) {
  const [loadedUrl, setLoadedUrl] = useState<string | null>(null);
  const loading = !!url && url !== loadedUrl;

  let emptyMessage: string | null = null;
  if (!username.trim()) {
    emptyMessage = "Preview your card — enter a username above";
  } else if (cardType === "repo" && !repo.trim()) {
    emptyMessage = "Enter a repository name to preview";
  } else if (!url) {
    emptyMessage = "Preview unavailable";
  }

  if (emptyMessage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] rounded-xl border border-dashed border-slate-700/60 bg-[#0a0e17]/50 p-8 text-center ">
        <p className="text-slate-400 text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative flex items-start justify-center min-h-[120px] rounded-xl border border-slate-700/40 bg-[#0a0e17]/50 p-4 sm:p-6 overflow-x-auto">
        {loading && (
          <div className="absolute inset-6 flex flex-col gap-3 animate-pulse">
            <div className="h-4 w-48 rounded bg-slate-700/50" />
            <div className="h-3 w-full rounded bg-slate-700/30" />
            <div className="h-3 w-4/5 rounded bg-slate-700/30" />
            <div className="h-3 w-3/5 rounded bg-slate-700/30" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt="Card preview"
          className={cn(
            "max-w-full h-auto transition-opacity duration-300 ",
            loading ? "opacity-0" : "opacity-100",
          )}
          onLoad={() => setLoadedUrl(url)}
          onError={() => setLoadedUrl(url)}
        />
      </div>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        <ExternalLink className="size-3.5" />
        Open in new tab
      </a>
    </div>
  );
}

const INITIAL_CONFIG: Omit<CardConfig, "username"> = {
  cardType: "stats",
  theme: "default",
  cardWidth: 495,
  hideBorder: false,
  showIcons: true,
  hideStats: "",
  customTitle: "",
  layout: "normal",
  langsCount: 6,
  hideLangs: "",
  hideProgress: false,
  hideTotal: false,
  dateFormat: "short",
  repo: "",
  showOwner: true,
};

function buildInitialState(searchParams: URLSearchParams) {
  const parsed = parseBuilderParams(searchParams);
  const cardType = parsed.config.cardType ?? "stats";
  return {
    username: parsed.username,
    config: {
      ...INITIAL_CONFIG,
      ...parsed.config,
      cardWidth: defaultCardWidth(cardType),
    },
  };
}

export function Configurator() {
  const searchParams = useSearchParams();
  const initial = buildInitialState(searchParams);
  const [username, setUsername] = useState(initial.username);
  const debouncedUsername = useDebounce(username, 500);
  const [config, setConfig] = useState(initial.config);
  const baseUrl = useOrigin();

  const patch = useCallback(
    (partial: Partial<typeof config>) =>
      setConfig((prev) => ({ ...prev, ...partial })),
    [],
  );

  const setCardType = useCallback((cardType: CardType) => {
    setConfig((prev) => ({
      ...prev,
      cardType,
      cardWidth: defaultCardWidth(cardType),
    }));
  }, []);

  const fullConfig: CardConfig = useMemo(
    () => ({ ...config, username: debouncedUsername }),
    [config, debouncedUsername],
  );

  const cardUrl = useMemo(
    () => (baseUrl ? buildCardUrl(baseUrl, fullConfig) : ""),
    [baseUrl, fullConfig],
  );

  const markdown = useMemo(
    () => buildMarkdown(cardUrl, fullConfig),
    [cardUrl, fullConfig],
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Card Builder
        </h1>
        <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
          Customize your GitHub stats card live. Copy the URL or Markdown snippet
          when you&apos;re done.
        </p>
      </div>

      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left — Controls */}
          <div className="space-y-6">
            {/* Username (+ repo name for Repo Pin) */}
            <Card className="bg-[#151b27] border-slate-800/80 ring-slate-800/60">
              <CardHeader>
                <CardTitle className="text-slate-100">
                  {config.cardType === "repo" ? "Repository" : "GitHub Username"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-200">
                    {config.cardType === "repo" ? "Owner" : "Username"}
                  </label>
                  <Input
                    placeholder={config.cardType === "repo" ? "vercel" : "octocat"}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-[#0a0e17] border-slate-700/60 text-slate-100 placeholder:text-slate-600"
                  />
                </div>
                {config.cardType === "repo" && (
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-slate-200">
                      Repository name
                    </label>
                    <Input
                      placeholder="next.js"
                      value={config.repo}
                      onChange={(e) => patch({ repo: e.target.value })}
                      className="bg-[#0a0e17] border-slate-700/60 text-slate-100 placeholder:text-slate-600"
                    />
                    <p className="text-xs text-slate-500">
                      The repo slug only — e.g.{" "}
                      <span className="font-mono text-slate-400">next.js</span>,
                      not the full URL.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Card type */}
            <Card className="bg-[#151b27] border-slate-800/80 ring-slate-800/60">
              <CardHeader>
                <CardTitle className="text-slate-100">Card Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={config.cardType}
                  onValueChange={(v) => setCardType(v as CardType)}
                >
                  <TabsList className="w-full bg-[#0a0e17] border border-slate-700/40">
                    <TabsTrigger value="stats" className="flex-1">
                      Stats
                    </TabsTrigger>
                    <TabsTrigger value="langs" className="flex-1">
                      Languages
                    </TabsTrigger>
                    <TabsTrigger value="streak" className="flex-1">
                      Streak
                    </TabsTrigger>
                    <TabsTrigger value="repo" className="flex-1">
                      Repo Pin
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardContent>
            </Card>

            {/* Theme */}
            <Card className="bg-[#151b27] border-slate-800/80 ring-slate-800/60">
              <CardHeader>
                <CardTitle className="text-slate-100">Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <ThemeGrid
                  selected={config.theme}
                  onSelect={(theme) => patch({ theme })}
                />
              </CardContent>
            </Card>

            {/* Per-card options */}
            <Card className="bg-[#151b27] border-slate-800/80 ring-slate-800/60">
              <CardHeader>
                <CardTitle className="text-slate-100">Options</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-slate-800/60">
                {/* Shared */}
                <OptionRow label="Hide border">
                  <Switch
                    checked={config.hideBorder}
                    onCheckedChange={(v) => patch({ hideBorder: v })}
                  />
                </OptionRow>

                <div className="py-3 space-y-2">
                  <p className="text-sm font-medium text-slate-200">
                    Card width — {config.cardWidth}px
                  </p>
                  <Slider
                    min={200}
                    max={1000}
                    step={5}
                    value={[config.cardWidth]}
                    onValueChange={([v]) => patch({ cardWidth: v })}
                  />
                </div>

                {/* Stats */}
                {config.cardType === "stats" && (
                  <>
                    <OptionRow label="Show icons">
                      <Switch
                        checked={config.showIcons}
                        onCheckedChange={(v) => patch({ showIcons: v })}
                      />
                    </OptionRow>
                    <div className="py-3 space-y-1.5">
                      <label className="text-sm font-medium text-slate-200">
                        Hide stats
                      </label>
                      <Input
                        placeholder="stars,issues,prs"
                        value={config.hideStats}
                        onChange={(e) => patch({ hideStats: e.target.value })}
                        className="bg-[#0a0e17] border-slate-700/60 text-slate-100 text-sm"
                      />
                      <p className="text-xs text-slate-500">
                        Comma-separated: stars, commits, prs, issues, reviews,
                        followers, repos, contributions
                      </p>
                    </div>
                    <div className="py-3 space-y-1.5">
                      <label className="text-sm font-medium text-slate-200">
                        Custom title
                      </label>
                      <Input
                        placeholder="My GitHub Stats"
                        value={config.customTitle}
                        onChange={(e) => patch({ customTitle: e.target.value })}
                        className="bg-[#0a0e17] border-slate-700/60 text-slate-100 text-sm"
                      />
                    </div>
                  </>
                )}

                {/* Langs */}
                {config.cardType === "langs" && (
                  <>
                    <div className="py-3 space-y-1.5">
                      <label className="text-sm font-medium text-slate-200">
                        Layout
                      </label>
                      <Select
                        value={config.layout}
                        onValueChange={(v) =>
                          patch({ layout: v as LangsLayout })
                        }
                      >
                        <SelectTrigger className="bg-[#0a0e17] border-slate-700/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="compact">Compact</SelectItem>
                          <SelectItem value="donut">Donut</SelectItem>
                          <SelectItem value="pie">Pie</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="py-3 space-y-2">
                      <p className="text-sm font-medium text-slate-200">
                        Languages shown — {config.langsCount}
                      </p>
                      <Slider
                        min={1}
                        max={12}
                        step={1}
                        value={[config.langsCount]}
                        onValueChange={([v]) => patch({ langsCount: v })}
                      />
                    </div>
                    <OptionRow label="Hide progress bars">
                      <Switch
                        checked={config.hideProgress}
                        onCheckedChange={(v) => patch({ hideProgress: v })}
                      />
                    </OptionRow>
                    <div className="py-3 space-y-1.5">
                      <label className="text-sm font-medium text-slate-200">
                        Exclude languages
                      </label>
                      <Input
                        placeholder="html,css"
                        value={config.hideLangs}
                        onChange={(e) => patch({ hideLangs: e.target.value })}
                        className="bg-[#0a0e17] border-slate-700/60 text-slate-100 text-sm"
                      />
                    </div>
                  </>
                )}

                {/* Streak */}
                {config.cardType === "streak" && (
                  <>
                    <OptionRow label="Hide total contributions">
                      <Switch
                        checked={config.hideTotal}
                        onCheckedChange={(v) => patch({ hideTotal: v })}
                      />
                    </OptionRow>
                    <div className="py-3 space-y-1.5">
                      <label className="text-sm font-medium text-slate-200">
                        Date format
                      </label>
                      <Select
                        value={config.dateFormat}
                        onValueChange={(v) =>
                          patch({ dateFormat: v as DateFormat })
                        }
                      >
                        <SelectTrigger className="bg-[#0a0e17] border-slate-700/60">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short">Short</SelectItem>
                          <SelectItem value="long">Long</SelectItem>
                          <SelectItem value="numeric">Numeric</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Repo */}
                {config.cardType === "repo" && (
                  <OptionRow label="Show owner in title">
                    <Switch
                      checked={config.showOwner}
                      onCheckedChange={(v) => patch({ showOwner: v })}
                    />
                  </OptionRow>
                )}
              </CardContent>
            </Card>

            {/* Generated output */}
            <Card className="bg-[#151b27] border-slate-800/80 ring-slate-800/60">
              <CardHeader>
                <CardTitle className="text-slate-100">Embed Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <CopyField label="API URL" value={cardUrl} />
                <CopyField label="Markdown" value={markdown} />
              </CardContent>
            </Card>
          </div>

          {/* Right — Preview */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card className="bg-[#151b27] border-slate-800/80 ring-slate-800/60">
              <CardHeader>
                <CardTitle className="text-slate-100">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <CardPreview
                  url={cardUrl}
                  cardType={config.cardType}
                  username={debouncedUsername}
                  repo={config.repo}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
