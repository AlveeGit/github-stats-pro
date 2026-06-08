import { NextRequest } from "next/server";
import { withCache, CacheKey, TTL } from "@/lib/cache";
import { getTopLanguages } from "@/lib/github";
import { renderLangsCard, type LangsLayout } from "@/lib/render/langs";
import { langsCardHeight } from "@/lib/render/heights";
import {
  elementToSvg,
  renderErrorSvg,
  getErrorMessage,
  svgResponse,
  parseBool,
  parseIntParam,
} from "@/lib/render/svg";

export const runtime = "nodejs";

const VALID_LAYOUTS: LangsLayout[] = ["normal", "compact", "donut", "pie"];

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
  const layoutParam = params.get("layout") ?? "normal";
  const layout: LangsLayout = VALID_LAYOUTS.includes(layoutParam as LangsLayout)
    ? (layoutParam as LangsLayout)
    : "normal";
  const langsCount = parseIntParam(params.get("langs_count"), 6, 1, 12);
  const cardWidth = parseIntParam(params.get("card_width"), 300, 200, 1000);
  const excludeLangs = (params.get("hide") ?? "")
    .split(",")
    .map((l) => l.trim())
    .filter(Boolean);
  const hideProgress = parseBool(params.get("hide_progress"), false);

  try {
    const languages = await withCache(
      CacheKey.langs(username),
      TTL.LANGS,
      () => getTopLanguages(username, excludeLangs),
    );

    const element = renderLangsCard(
      { username, languages },
      {
        theme,
        layout,
        langsCount,
        hideBorder: parseBool(params.get("hide_border"), false),
        hideProgress,
        width: cardWidth,
      },
    );
    const height = langsCardHeight(layout, langsCount, false, hideProgress);
    const svg = await elementToSvg(element, cardWidth, height);
    return svgResponse(svg, TTL.LANGS);
  } catch (err) {
    const message = getErrorMessage(err);
    return svgResponse(renderErrorSvg(message, theme, cardWidth), 60);
  }
}
