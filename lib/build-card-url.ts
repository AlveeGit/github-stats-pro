export type CardType = "stats" | "langs" | "streak" | "repo";

export type LangsLayout = "normal" | "compact" | "donut" | "pie";
export type DateFormat = "short" | "long" | "numeric";

export interface CardConfig {
  cardType: CardType;
  username: string;
  theme: string;
  cardWidth: number;
  hideBorder: boolean;
  // stats
  showIcons: boolean;
  hideStats: string;
  customTitle: string;
  // langs
  layout: LangsLayout;
  langsCount: number;
  hideLangs: string;
  hideProgress: boolean;
  // streak
  hideTotal: boolean;
  dateFormat: DateFormat;
  // repo
  repo: string;
  showOwner: boolean;
}

const DEFAULTS: Record<CardType, Partial<CardConfig>> = {
  stats: { cardWidth: 495, theme: "default", showIcons: true, hideBorder: false },
  langs: { cardWidth: 300, theme: "default", layout: "normal", langsCount: 6, hideBorder: false, hideProgress: false },
  streak: { cardWidth: 495, theme: "default", hideBorder: false, hideTotal: false, dateFormat: "short" },
  repo: { cardWidth: 400, theme: "default", hideBorder: false, showOwner: true },
};

export function defaultCardWidth(cardType: CardType): number {
  return DEFAULTS[cardType].cardWidth ?? 495;
}

export function buildCardUrl(baseUrl: string, config: CardConfig): string {
  const { cardType, username } = config;
  if (!username.trim()) return "";

  const params = new URLSearchParams();
  params.set("username", username.trim());

  if (config.theme !== "default") params.set("theme", config.theme);

  const defs = DEFAULTS[cardType];

  if (config.cardWidth !== defs.cardWidth) {
    params.set("card_width", String(config.cardWidth));
  }
  if (config.hideBorder) params.set("hide_border", "true");

  switch (cardType) {
    case "stats":
      if (!config.showIcons) params.set("show_icons", "false");
      if (config.hideStats.trim()) params.set("hide", config.hideStats.trim());
      if (config.customTitle.trim()) params.set("custom_title", config.customTitle.trim());
      break;

    case "langs":
      if (config.layout !== "normal") params.set("layout", config.layout);
      if (config.langsCount !== 6) params.set("langs_count", String(config.langsCount));
      if (config.hideLangs.trim()) params.set("hide", config.hideLangs.trim());
      if (config.hideProgress) params.set("hide_progress", "true");
      break;

    case "streak":
      if (config.hideTotal) params.set("hide_total", "true");
      if (config.dateFormat !== "short") params.set("date_format", config.dateFormat);
      break;

    case "repo":
      if (!config.repo.trim()) return "";
      params.set("repo", config.repo.trim());
      if (!config.showOwner) params.set("show_owner", "false");
      break;
  }

  return `${baseUrl}/api/${cardType}?${params.toString()}`;
}

const CARD_TYPES: CardType[] = ["stats", "langs", "streak", "repo"];
const LANGS_LAYOUTS: LangsLayout[] = ["normal", "compact", "donut", "pie"];
const DATE_FORMATS: DateFormat[] = ["short", "long", "numeric"];

/** Serialize config into /builder query params. */
export function configToBuilderParams(
  username: string,
  config: Partial<Omit<CardConfig, "username">>,
): URLSearchParams {
  const p = new URLSearchParams();
  if (username.trim()) p.set("username", username.trim());

  const cardType = config.cardType ?? "stats";
  p.set("card", cardType);
  if (config.theme && config.theme !== "default") p.set("theme", config.theme);
  if (config.repo?.trim()) p.set("repo", config.repo.trim());
  if (config.layout && config.layout !== "normal") p.set("layout", config.layout);
  if (config.langsCount && config.langsCount !== 6) {
    p.set("langs_count", String(config.langsCount));
  }

  return p;
}

export function builderHref(
  username: string,
  config: Partial<Omit<CardConfig, "username">>,
): string {
  const qs = configToBuilderParams(username, config).toString();
  return qs ? `/builder?${qs}` : "/builder";
}

/** Parse /builder search params into initial state. */
export function parseBuilderParams(params: URLSearchParams): {
  username: string;
  config: Partial<Omit<CardConfig, "username">>;
} {
  const cardParam = params.get("card") ?? "stats";
  const cardType: CardType = CARD_TYPES.includes(cardParam as CardType)
    ? (cardParam as CardType)
    : "stats";

  const layoutParam = params.get("layout") ?? "normal";
  const layout: LangsLayout = LANGS_LAYOUTS.includes(layoutParam as LangsLayout)
    ? (layoutParam as LangsLayout)
    : "normal";

  const dateParam = params.get("date_format") ?? "short";
  const dateFormat: DateFormat = DATE_FORMATS.includes(dateParam as DateFormat)
    ? (dateParam as DateFormat)
    : "short";

  return {
    username: params.get("username") ?? "",
    config: {
      cardType,
      theme: params.get("theme") ?? "default",
      repo: params.get("repo") ?? "",
      layout,
      langsCount: params.get("langs_count")
        ? parseInt(params.get("langs_count")!, 10)
        : undefined,
      dateFormat,
    },
  };
}

export function buildMarkdown(url: string, config: CardConfig): string {
  if (!url) return "";

  const altLabels: Record<CardType, string> = {
    stats: "GitHub Stats",
    langs: "Top Languages",
    streak: "GitHub Streak",
    repo: config.repo.trim() || "GitHub Repo",
  };

  return `![${altLabels[config.cardType]}](${url})`;
}
