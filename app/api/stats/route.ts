import { NextRequest } from "next/server";
import { withCache, CacheKey, TTL } from "@/lib/cache";
import { getUserStats } from "@/lib/github";
import { renderStatsCard } from "@/lib/render/stats";
import { statsCardHeight } from "@/lib/render/heights";
import {
  elementToSvg,
  renderErrorSvg,
  getErrorMessage,
  svgResponse,
  parseBool,
  parseIntParam,
} from "@/lib/render/svg";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const username = params.get("username");

  if (!username) {
    return Response.json(
      { error: "Missing required query parameter: username" },
      { status: 400 },
    );
  }

  const theme = params.get("theme") ?? "default";
  const cardWidth = parseIntParam(params.get("card_width"), 495, 200, 1000);

  try {
    const stats = await withCache(
      CacheKey.stats(username),
      TTL.STATS,
      () => getUserStats(username),
    );

    const hideStats = params.get("hide") ?? "";
    const hidden = new Set(
      hideStats.split(",").map((s) => s.trim()).filter(Boolean),
    );
    const totalStats = 8;
    const visibleCount = totalStats - [...hidden].filter((k) =>
      ["stars", "commits", "prs", "issues", "reviews", "followers", "repos", "contributions"].includes(k),
    ).length;

    const element = renderStatsCard(
      {
        username: stats.login,
        name: stats.name,
        avatarUrl: stats.avatarUrl,
        totalStars: stats.totalStars,
        totalCommits: stats.totalCommits,
        totalPRs: stats.totalPRs,
        totalIssues: stats.totalIssues,
        totalReviews: 0,
        followers: stats.followers,
        contributions: stats.totalContributions,
        repoCount: stats.contributedToCount,
      },
      {
        theme,
        showIcons: parseBool(params.get("show_icons"), true),
        hideBorder: parseBool(params.get("hide_border"), false),
        hideStats,
        width: cardWidth,
        customTitle: params.get("custom_title") ?? undefined,
      },
    );

    const height = statsCardHeight(Math.max(visibleCount, 1));
    const svg = await elementToSvg(element, cardWidth, height);
    return svgResponse(svg, TTL.STATS);
  } catch (err) {
    const message = getErrorMessage(err);
    return svgResponse(renderErrorSvg(message, theme, cardWidth), 60);
  }
}
