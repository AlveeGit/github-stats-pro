import { NextRequest } from "next/server";
import { withCache, CacheKey, TTL } from "@/lib/cache";
import { getRepoInfo } from "@/lib/github";
import { renderRepoCard } from "@/lib/render/repo";
import {
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
  const repo = params.get("repo");

  if (!username || !repo) {
    return Response.json(
      {
        error: `Missing required query parameter${!username && !repo ? "s" : ""}: ${[!username && "username", !repo && "repo"].filter(Boolean).join(", ")}`,
      },
      { status: 400 },
    );
  }

  const theme = params.get("theme") ?? "default";
  const cardWidth = parseIntParam(params.get("card_width"), 400, 200, 1000);

  try {
    const info = await withCache(
      CacheKey.repo(username, repo),
      TTL.REPO,
      () => getRepoInfo(username, repo),
    );

    const svg = renderRepoCard(
      {
        owner: info.owner,
        repo: info.name,
        description: info.description,
        stars: info.stars,
        forks: info.forks,
        language: info.language,
        languageColor: info.languageColor,
        isTemplate: info.isTemplate,
        topics: info.topics,
      },
      {
        theme,
        width: cardWidth,
        hideBorder: parseBool(params.get("hide_border"), false),
        showOwner: parseBool(params.get("show_owner"), true),
      },
    );

    return svgResponse(svg, TTL.REPO);
  } catch (err) {
    const message = getErrorMessage(err);
    return svgResponse(renderErrorSvg(message, theme, cardWidth), 60);
  }
}
