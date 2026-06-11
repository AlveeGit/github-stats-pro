export const SELF_HOST_BENEFITS = [
  "No shared public API rate limits",
  "Better reliability under heavy traffic",
  "Full control over caching and customization",
  "Your GitHub PAT stays on your own infrastructure",
] as const;

export const ENV_VARS = [
  {
    name: "GITHUB_PAT",
    required: true,
    description: "GitHub Personal Access Token",
  },
  {
    name: "UPSTASH_REDIS_URL",
    required: false,
    description: "Upstash Redis REST URL (caching disabled if missing)",
  },
  {
    name: "UPSTASH_REDIS_TOKEN",
    required: false,
    description: "Upstash Redis REST token",
  },
  {
    name: "NEXT_PUBLIC_GITHUB_REPO_URL",
    required: false,
    description: 'Optional — sets the "View on GitHub" link to your fork',
  },
] as const;

export const TOKEN_SCOPES = [
  {
    useCase: "Public repositories only",
    scopes: "public_repo, read:user",
  },
  {
    useCase: "Private repository stats",
    scopes: "repo, read:user",
  },
] as const;

export const HOSTING_STEPS = [
  {
    step: "1",
    title: "Fork the repository",
    body: "Fork GitHub Stats Pro to your GitHub account so you own the deployment.",
  },
  {
    step: "2",
    title: "Create a GitHub token",
    body: "Generate a Personal Access Token with read:user and public_repo (or repo for private stats).",
    link: "https://github.com/settings/tokens",
    linkLabel: "GitHub Token Settings",
  },
  {
    step: "3",
    title: "Create Redis cache (optional)",
    body: "Set up a free Upstash Redis database for faster responses and fewer GitHub API calls. Disable eviction on the free tier.",
    link: "https://upstash.com",
    linkLabel: "Upstash",
  },
  {
    step: "4",
    title: "Deploy to Vercel",
    body: "Use the one-click deploy button below, or run pnpm install && pnpm build and connect your fork in the Vercel dashboard.",
  },
  {
    step: "5",
    title: "Add environment variables",
    body: "In Vercel project settings, add GITHUB_PAT and optionally UPSTASH_REDIS_URL + UPSTASH_REDIS_TOKEN, then redeploy.",
  },
] as const;

export const TECH_STACK = [
  { name: "Next.js 16", href: "https://nextjs.org" },
  { name: "Satori", href: "https://github.com/vercel/satori" },
  { name: "GitHub GraphQL API v4", href: "https://docs.github.com/en/graphql" },
  { name: "Upstash Redis", href: "https://upstash.com" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com" },
  { name: "shadcn/ui", href: "https://ui.shadcn.com" },
] as const;

export function getDeployUrl(repoUrl: string): string {
  const encoded = encodeURIComponent(repoUrl);
  const env = encodeURIComponent(
    "GITHUB_PAT,UPSTASH_REDIS_URL,UPSTASH_REDIS_TOKEN",
  );
  const desc = encodeURIComponent("Required environment variables");
  return `https://vercel.com/new/clone?repository-url=${encoded}&env=${env}&envDescription=${desc}`;
}
