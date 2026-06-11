import type { CardConfig, CardType } from "@/lib/build-card-url";

export interface ExamplePreset {
  title: string;
  description: string;
  username: string;
  markdown: string;
  config: Partial<Omit<CardConfig, "username">>;
}

export const FEATURES = [
  {
    title: "GitHub Stats",
    description:
      "Stars, commits, PRs, issues, followers, and a rank badge — pulled from all your public repos.",
  },
  {
    title: "Top Languages",
    description:
      "Language breakdown with normal bars, compact legend, donut, or pie chart layouts.",
  },
  {
    title: "Contribution Streak",
    description:
      "Current streak, longest streak, and total contributions from your GitHub calendar.",
  },
  {
    title: "Repo Pin",
    description:
      "Showcase a single repository with stars, forks, topics, and description.",
  },
  {
    title: "20+ Themes",
    description:
      "Dark, light, and colorful presets — pick one visually or pass ?theme=dark in the URL.",
  },
  {
    title: "Self-Hosted",
    description:
      "Your own GitHub token and Redis cache. No shared rate limits, no third-party downtime.",
  },
] as const;

export const STEPS = [
  {
    step: "1",
    title: "Enter a GitHub username",
    body: "Type any public GitHub username in the builder. For Repo Pin, also enter the owner and repository name (e.g. vercel / next.js).",
  },
  {
    step: "2",
    title: "Pick a card type & theme",
    body: "Choose Stats, Languages, Streak, or Repo Pin. Click a theme swatch to style the card.",
  },
  {
    step: "3",
    title: "Tune the options",
    body: "Adjust layout, hide stats, change card width, and more. The live preview updates automatically.",
  },
  {
    step: "4",
    title: "Copy & paste into your README",
    body: "Copy the Markdown snippet from the Embed Code section and paste it into any GitHub README, blog, or website.",
  },
] as const;

export const CARD_TYPES: {
  type: CardType;
  title: string;
  description: string;
  params: string;
}[] = [
  {
    type: "stats",
    title: "Stats Card",
    description:
      "A summary of your GitHub activity with an optional rank ring. Great for profile READMEs.",
    params: "username, theme, show_icons, hide, card_width, custom_title",
  },
  {
    type: "langs",
    title: "Languages Card",
    description:
      "Shows your most-used languages by bytes across all repositories.",
    params: "username, theme, layout, langs_count, hide, hide_progress",
  },
  {
    type: "streak",
    title: "Streak Card",
    description:
      "Highlights how many days in a row you've contributed to GitHub.",
    params: "username, theme, date_format, hide_total, card_width",
  },
  {
    type: "repo",
    title: "Repo Pin Card",
    description:
      "Pins one repo — perfect for showcasing your best open-source project.",
    params: "username, repo, theme, show_owner, card_width",
  },
];

export const TIPS = [
  {
    title: "Cards not updating?",
    body: "GitHub READMEs cache images. Add ?v=2 to the URL or change a param to bust the cache.",
  },
  {
    title: "Private repos",
    body: "Only public repository data is fetched. Your self-hosted PAT is never exposed to visitors.",
  },
  {
    title: "Deploy your own",
    body: "Fork the repo, add a GitHub PAT and optional Upstash Redis, then deploy to Vercel. See the Self-Host guide for step-by-step instructions.",
    href: "/self-host",
  },
] as const;

function exampleUrl(
  baseUrl: string,
  path: string,
  params: Record<string, string>,
): string {
  const qs = new URLSearchParams(params).toString();
  return `${baseUrl || "https://your-app.vercel.app"}${path}?${qs}`;
}

export function buildExamples(baseUrl: string): ExamplePreset[] {
  const origin = baseUrl || "https://your-app.vercel.app";
  return [
    {
      title: "Classic stats card",
      description: "Default theme with rank badge and icons.",
      username: "octocat",
      markdown: `![GitHub Stats](${exampleUrl(origin, "/api/stats", { username: "octocat" })})`,
      config: { cardType: "stats", theme: "default" },
    },
    {
      title: "Dark theme stats",
      description: "Sleek dark card — popular for night-mode READMEs.",
      username: "octocat",
      markdown: `![GitHub Stats](${exampleUrl(origin, "/api/stats", { username: "octocat", theme: "dark" })})`,
      config: { cardType: "stats", theme: "dark" },
    },
    {
      title: "Donut language chart",
      description: "Top 6 languages in a donut layout.",
      username: "octocat",
      markdown: `![Top Languages](${exampleUrl(origin, "/api/langs", { username: "octocat", layout: "donut", langs_count: "6" })})`,
      config: { cardType: "langs", theme: "radical", layout: "donut", langsCount: 6 },
    },
    {
      title: "Contribution streak",
      description: "Current and longest streak side by side.",
      username: "octocat",
      markdown: `![GitHub Streak](${exampleUrl(origin, "/api/streak", { username: "octocat", theme: "dracula" })})`,
      config: { cardType: "streak", theme: "dracula" },
    },
    {
      title: "Pinned repository",
      description: "Pin the Next.js repo owned by Vercel.",
      username: "vercel",
      markdown: `![next.js](${exampleUrl(origin, "/api/repo", { username: "vercel", repo: "next.js", theme: "tokyonight" })})`,
      config: {
        cardType: "repo",
        theme: "tokyonight",
        repo: "next.js",
        showOwner: true,
      },
    },
  ];
}
