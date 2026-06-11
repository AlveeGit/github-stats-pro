/* eslint-disable @typescript-eslint/no-explicit-any */
//  /lib/github.ts
//  GitHub GraphQL client

import { graphql } from "@octokit/graphql";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RankResult {
  score: number;
  level: "S+" | "S" | "A++" | "A+" | "A" | "B+" | "B";
  percentile: number;
}

export interface UserStats {
  name: string;
  login: string;
  avatarUrl: string;
  bio: string;
  followers: number;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalContributions: number;
  contributedToCount: number;
  rank: RankResult;
}

export interface LanguageStat {
  name: string;
  color: string;
  percentage: number;
  bytes: number;
}

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalContributions: number;
  startDate: string;
  endDate: string;
  currentStreakStart: string;
  longestStreakStart: string;
  longestStreakEnd: string;
}

export interface RepoInfo {
  name: string;
  owner: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
  isTemplate: boolean;
  topics: string[];
  isPrivate: boolean;
}

// ─── Errors ───────────────────────────────────────────────────────────────────

export class GitHubError extends Error {
  constructor(
    message: string,
    public status: number = 500,
  ) {
    super(message);
    this.name = "GitHubError";
  }
}

// ─── Client ───────────────────────────────────────────────────────────────────

function getClient() {
  const token = process.env.GITHUB_PAT;
  if (!token)
    throw new GitHubError("GITHUB_PAT environment variable is not set", 500);
  return graphql.defaults({ headers: { authorization: `token ${token}` } });
}

// ─── Rank Calculator ──────────────────────────────────────────────────────────

function calculateRank(stats: {
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalStars: number;
  followers: number;
  contributedToCount: number;
}): RankResult {
  const weights = {
    commits: 0.3,
    stars: 0.25,
    prs: 0.15,
    followers: 0.1,
    issues: 0.1,
    contributions: 0.1,
  };

  const raw =
    Math.log1p(stats.totalCommits) * weights.commits +
    Math.log1p(stats.totalStars) * weights.stars +
    Math.log1p(stats.totalPRs) * weights.prs +
    Math.log1p(stats.followers) * weights.followers +
    Math.log1p(stats.totalIssues) * weights.issues +
    Math.log1p(stats.contributedToCount) * weights.contributions;

  // Sigmoid normalisation → 0-100
  const score = Math.round((1 / (1 + Math.exp(-raw / 2 + 4))) * 100);

  const level: RankResult["level"] =
    score >= 95
      ? "S+"
      : score >= 85
        ? "S"
        : score >= 75
          ? "A++"
          : score >= 65
            ? "A+"
            : score >= 55
              ? "A"
              : score >= 45
                ? "B+"
                : "B";

  // Rough percentile from score (based on GitHub user distribution)
  const percentile = Math.max(1, Math.round((1 - score / 100) * 97 + 1));

  return { score, level, percentile };
}

// ─── getUserStats ─────────────────────────────────────────────────────────────

const STATS_QUERY = `
  query UserStats($login: String!, $cursor: String) {
    user(login: $login) {
      name
      login
      avatarUrl
      bio
      followers { totalCount }
      contributionsCollection {
        totalCommitContributions
        totalPullRequestContributions
        totalIssueContributions
        totalRepositoryContributions
        contributedToRepositoriesCount: totalRepositoriesWithContributedCommits
      }
      repositories(
        first: 100
        after: $cursor
        ownerAffiliations: OWNER
        privacy: PUBLIC
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        pageInfo { hasNextPage endCursor }
        nodes {
          stargazerCount
          isFork
        }
      }
    }
  }
`;

export async function getUserStats(username: string): Promise<UserStats> {
  const client = getClient();
  let totalStars = 0;
  let cursor: string | null = null;
  let userData: any = null;

  try {
    // Paginate through ALL repositories
    do {
      const result: any = await client(STATS_QUERY, {
        login: username,
        cursor,
      });
      const user = result.user;

      if (!user) throw new GitHubError(`User "${username}" not found`, 404);

      if (!userData) userData = user;

      for (const repo of user.repositories.nodes) {
        if (!repo.isFork) totalStars += repo.stargazerCount;
      }

      cursor = user.repositories.pageInfo.hasNextPage
        ? user.repositories.pageInfo.endCursor
        : null;
    } while (cursor);

    const c = userData.contributionsCollection;
    const stats = {
      totalCommits: c.totalCommitContributions,
      totalPRs: c.totalPullRequestContributions,
      totalIssues: c.totalIssueContributions,
      totalStars,
      followers: userData.followers.totalCount,
      contributedToCount: c.contributedToRepositoriesCount ?? 0,
    };

    return {
      name: userData.name ?? userData.login,
      login: userData.login,
      avatarUrl: userData.avatarUrl,
      bio: userData.bio ?? "",
      followers: userData.followers.totalCount,
      totalStars,
      totalCommits: c.totalCommitContributions,
      totalPRs: c.totalPullRequestContributions,
      totalIssues: c.totalIssueContributions,
      totalContributions:
        c.totalCommitContributions +
        c.totalPullRequestContributions +
        c.totalIssueContributions,
      contributedToCount: c.contributedToRepositoriesCount ?? 0,
      rank: calculateRank(stats),
    };
  } catch (err: any) {
    if (err instanceof GitHubError) throw err;
    if (err.status === 401)
      throw new GitHubError("Invalid or expired GitHub PAT", 401);
    if (err.message?.includes("Could not resolve to a User")) {
      throw new GitHubError(`User "${username}" not found`, 404);
    }
    throw new GitHubError(err.message ?? "GitHub API error", 500);
  }
}

// ─── getTopLanguages ──────────────────────────────────────────────────────────

const LANGS_QUERY = `
  query TopLanguages($login: String!, $cursor: String) {
    user(login: $login) {
      repositories(
        first: 100
        after: $cursor
        ownerAffiliations: OWNER
        privacy: PUBLIC
        isFork: false
        orderBy: { field: UPDATED_AT, direction: DESC }
      ) {
        pageInfo { hasNextPage endCursor }
        nodes {
          languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
            edges {
              size
              node { name color }
            }
          }
        }
      }
    }
  }
`;

export async function getTopLanguages(
  username: string,
  excludeLangs: string[] = [],
): Promise<LanguageStat[]> {
  const client = getClient();
  const langMap = new Map<string, { color: string; bytes: number }>();
  let cursor: string | null = null;
  let totalBytes = 0;

  try {
    do {
      const result: any = await client(LANGS_QUERY, {
        login: username,
        cursor,
      });
      const user = result.user;
      if (!user) throw new GitHubError(`User "${username}" not found`, 404);

      for (const repo of user.repositories.nodes) {
        for (const edge of repo.languages.edges) {
          const name: string = edge.node.name;
          if (
            excludeLangs
              .map((l) => l.toLowerCase())
              .includes(name.toLowerCase())
          )
            continue;
          const existing = langMap.get(name);
          if (existing) {
            existing.bytes += edge.size;
          } else {
            langMap.set(name, {
              color: edge.node.color ?? "#858585",
              bytes: edge.size,
            });
          }
          totalBytes += edge.size;
        }
      }

      cursor = user.repositories.pageInfo.hasNextPage
        ? user.repositories.pageInfo.endCursor
        : null;
    } while (cursor);

    return Array.from(langMap.entries())
      .sort((a, b) => b[1].bytes - a[1].bytes)
      .slice(0, 12)
      .map(([name, { color, bytes }]) => ({
        name,
        color,
        bytes,
        percentage:
          totalBytes > 0 ? Math.round((bytes / totalBytes) * 1000) / 10 : 0,
      }));
  } catch (err: any) {
    if (err instanceof GitHubError) throw err;
    if (err.message?.includes("Could not resolve to a User")) {
      throw new GitHubError(`User "${username}" not found`, 404);
    }
    throw new GitHubError(err.message ?? "GitHub API error", 500);
  }
}

// ─── getStreak ────────────────────────────────────────────────────────────────

const STREAK_QUERY = `
  query Streak($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              contributionCount
              date
            }
          }
        }
      }
    }
  }
`;

export async function getStreak(username: string): Promise<StreakData> {
  const client = getClient();

  try {
    const result: any = await client(STREAK_QUERY, { login: username });
    const user = result.user;
    console.log("streak user", user);

    if (!user) throw new GitHubError(`User "${username}" not found`, 404);

    const calendar = user.contributionsCollection.contributionCalendar;
    const days: { date: string; count: number }[] = calendar.weeks
      .flatMap((w: any) => w.contributionDays)
      .map((d: any) => ({ date: d.date, count: d.contributionCount }));

    // Today (UTC)
    const today = new Date().toISOString().split("T")[0];

    // Current streak — walk backwards from today
    let currentStreak = 0;
    let currentStreakStart = "";
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].date > today) continue;
      if (days[i].count > 0) {
        currentStreak++;
        currentStreakStart = days[i].date;
      } else {
        // Allow one gap for today (contributions may not be recorded yet)
        if (days[i].date === today && currentStreak === 0) continue;
        break;
      }
    }

    // Longest streak — full scan
    let longestStreak = 0;
    let longestStreakStart = "";
    let longestStreakEnd = "";
    let tempStreak = 0;
    let tempStart = "";

    for (const day of days) {
      if (day.count > 0) {
        if (tempStreak === 0) tempStart = day.date;
        tempStreak++;
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
          longestStreakStart = tempStart;
          longestStreakEnd = day.date;
        }
      } else {
        tempStreak = 0;
        tempStart = "";
      }
    }

    return {
      currentStreak,
      longestStreak,
      totalContributions: calendar.totalContributions,
      startDate: days[0]?.date ?? "",
      endDate: today,
      currentStreakStart,
      longestStreakStart,
      longestStreakEnd,
    };
  } catch (err: any) {
    if (err instanceof GitHubError) throw err;
    if (err.message?.includes("Could not resolve to a User")) {
      throw new GitHubError(`User "${username}" not found`, 404);
    }
    throw new GitHubError(err.message ?? "GitHub API error", 500);
  }
}

// ─── getRepoInfo ──────────────────────────────────────────────────────────────

const REPO_QUERY = `
  query RepoInfo($owner: String!, $repo: String!) {
    repository(owner: $owner, name: $repo) {
      name
      owner { login }
      description
      stargazerCount
      forkCount
      isTemplate
      isPrivate
      repositoryTopics(first: 5) {
        nodes { topic { name } }
      }
      primaryLanguage { name color }
    }
  }
`;

export async function getRepoInfo(
  owner: string,
  repo: string,
): Promise<RepoInfo> {
  const client = getClient();

  try {
    const result: any = await client(REPO_QUERY, { owner, repo });
    const r = result.repository;
    if (!r)
      throw new GitHubError(`Repository "${owner}/${repo}" not found`, 404);

    return {
      name: r.name,
      owner: r.owner.login,
      description: r.description,
      stars: r.stargazerCount,
      forks: r.forkCount,
      language: r.primaryLanguage?.name ?? null,
      languageColor: r.primaryLanguage?.color ?? null,
      isTemplate: r.isTemplate,
      topics: r.repositoryTopics.nodes.map((n: any) => n.topic.name),
      isPrivate: r.isPrivate,
    };
  } catch (err: any) {
    if (err instanceof GitHubError) throw err;
    if (err.message?.includes("Could not resolve")) {
      throw new GitHubError(`Repository "${owner}/${repo}" not found`, 404);
    }
    throw new GitHubError(err.message ?? "GitHub API error", 500);
  }
}
