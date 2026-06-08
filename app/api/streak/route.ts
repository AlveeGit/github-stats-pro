import { NextRequest } from "next/server";
import { withCache, CacheKey, TTL } from "@/lib/cache";
import { getStreak } from "@/lib/github";
import { renderStreakCard } from "@/lib/render/streak";
import { streakCardHeight } from "@/lib/render/heights";
import {
  elementToSvg,
  renderErrorSvg,
  getErrorMessage,
  svgResponse,
  parseBool,
  parseIntParam,
} from "@/lib/render/svg";

export const runtime = "nodejs";

const VALID_DATE_FORMATS = ["short", "long", "numeric"] as const;
type DateFormat = (typeof VALID_DATE_FORMATS)[number];

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
  const dateFormatParam = params.get("date_format") ?? "short";
  const dateFormat: DateFormat = VALID_DATE_FORMATS.includes(
    dateFormatParam as DateFormat,
  )
    ? (dateFormatParam as DateFormat)
    : "short";

  try {
    const streak = await withCache(
      CacheKey.streak(username),
      TTL.STREAK,
      () => getStreak(username),
    );

    const hideTotal = parseBool(params.get("hide_total"), false);

    const element = renderStreakCard(
      {
        username,
        totalContributions: streak.totalContributions,
        firstContribution: streak.startDate,
        currentStreak: streak.currentStreak,
        currentStreakStart: streak.currentStreakStart,
        currentStreakEnd:
          streak.currentStreak > 0 ? streak.endDate : "",
        longestStreak: streak.longestStreak,
        longestStreakStart: streak.longestStreakStart,
        longestStreakEnd: streak.longestStreakEnd,
      },
      {
        theme,
        hideBorder: parseBool(params.get("hide_border"), false),
        hideTotal,
        dateFormat,
        width: cardWidth,
      },
    );

    const svg = await elementToSvg(element, cardWidth, streakCardHeight(hideTotal));
    return svgResponse(svg, TTL.STREAK);
  } catch (err) {
    const message = getErrorMessage(err);
    return svgResponse(renderErrorSvg(message, theme, cardWidth), 60);
  }
}
