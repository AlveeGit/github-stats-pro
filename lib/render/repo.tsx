/**
 * lib/render/repo.tsx
 *
 * Renders the GitHub Repo Pin card as a raw SVG string.
 */

import { getTheme } from "../themes";

// ── Types ──────────────────────────────────────────────────────────────────

export interface RepoCardData {
  owner: string;
  repo: string;
  description: string | null;
  stars: number;
  forks: number;
  language: string | null;
  languageColor: string | null;
  isTemplate: boolean;
  topics: string[];
}

export interface RepoCardOptions {
  theme?: string;
  width?: number;
  hideBorder?: boolean;
  showOwner?: boolean;
}

// ── Constants ──────────────────────────────────────────────────────────────

const CARD_WIDTH = 400;
const PADDING = 16;
const MAX_TOPICS = 3;

const ICONS = {
  folder:
    "M1.75 1A1.75 1.75 0 0 0 0 2.75v10.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0 0 16 13.25V5.664a1.75 1.75 0 0 0-.489-1.163L13.124.513A1.75 1.75 0 0 0 11.5 0H1.75ZM1.5 2.75a.25.25 0 0 1 .25-.25h9.5a.25.25 0 0 1 .177.073l1.75 1.75a.25.25 0 0 1 .073.177V13.25a.25.25 0 0 1-.25.25H1.75a.25.25 0 0 1-.25-.25Z",
  fork: "M3 2.75A2.75 2.75 0 1 1 5.75 5.5v1.25a.75.75 0 0 1-1.5 0V5.5a1.25 1.25 0 1 0-2.5 0v1.25a.75.75 0 0 1-1.5 0V5.5A2.75 2.75 0 1 1 3 2.75ZM10.25 8.25a.75.75 0 0 0-1.5 0v1.25a1.25 1.25 0 1 1-2.5 0V8.25a.75.75 0 0 0-1.5 0v1.25a2.75 2.75 0 1 0 5.5 0Z M11.5 6.25a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z",
  star: "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 11.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Split description into at most 2 lines (~52 chars each). */
function wrapDescription(text: string, maxLines = 2, charsPerLine = 52): string[] {
  if (!text) return [];
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > charsPerLine && current) {
      lines.push(current);
      current = word;
      if (lines.length >= maxLines) {
        lines[maxLines - 1] = lines[maxLines - 1].slice(0, charsPerLine - 3) + "...";
        return lines;
      }
    } else {
      current = next;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maxLines);
}

function iconSvg(path: string, x: number, y: number, size: number, fill: string): string {
  return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 16 16" fill="${fill}">
    <path d="${path}"/>
  </svg>`;
}

// ── Main renderer ──────────────────────────────────────────────────────────

export function renderRepoCard(
  data: RepoCardData,
  options: RepoCardOptions = {},
): string {
  const {
    theme: themeName = "default",
    width = CARD_WIDTH,
    hideBorder = false,
    showOwner = true,
  } = options;

  const theme = getTheme(themeName);
  const descLines = wrapDescription(data.description ?? "");
  const visibleTopics = data.topics.slice(0, MAX_TOPICS);
  const extraTopics = data.topics.length - MAX_TOPICS;

  const hasDesc = descLines.length > 0;
  const hasTopics = data.topics.length > 0;

  // Dynamic height
  let h = PADDING + 22; // header
  if (hasDesc) h += descLines.length * 18 + 8;
  if (hasTopics) h += 26;
  h += 28 + PADDING; // footer

  const border = hideBorder
    ? ""
    : `stroke="${theme.border}" stroke-width="1"`;

  const headerY = PADDING + 14;
  const iconX = PADDING;
  const textX = PADDING + 22;

  // Header text: owner / repo
  const ownerPart = showOwner
    ? `<tspan fill="${theme.textColor}" font-weight="400">${escapeXml(data.owner)}</tspan><tspan fill="${theme.textColor}" font-weight="400"> / </tspan>`
    : "";
  const repoPart = `<tspan fill="${theme.titleColor}" font-weight="700">${escapeXml(data.repo)}</tspan>`;

  // Template badge
  const templateBadge = data.isTemplate
    ? `<rect x="${width - PADDING - 72}" y="${PADDING}" width="72" height="18" rx="9" fill="${theme.ringColor}" opacity="0.15"/>
       <text x="${width - PADDING - 36}" y="${PADDING + 13}" text-anchor="middle"
         fill="${theme.ringColor}" font-family="Inter, 'Segoe UI', system-ui, sans-serif"
         font-size="9" font-weight="700" letter-spacing="0.5">TEMPLATE</text>`
    : "";

  // Description lines
  let descSvg = "";
  let y = PADDING + 36;
  if (hasDesc) {
    for (const line of descLines) {
      descSvg += `<text x="${PADDING}" y="${y}" fill="${theme.textColor}"
        font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="12">${escapeXml(line)}</text>`;
      y += 18;
    }
    y += 8;
  }

  // Topic pills
  let topicsSvg = "";
  if (hasTopics) {
    let tx = PADDING;
    const pillH = 20;
    const pillY = y;

    for (const topic of visibleTopics) {
      const label = escapeXml(topic);
      const pillW = Math.min(topic.length * 7 + 16, width - PADDING * 2 - 60);
      topicsSvg += `<rect x="${tx}" y="${pillY}" width="${pillW}" height="${pillH}" rx="10"
        fill="${theme.progressBarBg}"/>
        <text x="${tx + 8}" y="${pillY + 14}" fill="${theme.textColor}"
          font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="10" font-weight="600">${label}</text>`;
      tx += pillW + 6;
    }

    if (extraTopics > 0) {
      const moreLabel = `+${extraTopics} more`;
      const moreW = moreLabel.length * 7 + 16;
      topicsSvg += `<rect x="${tx}" y="${pillY}" width="${moreW}" height="${pillH}" rx="10"
        fill="${theme.progressBarBg}"/>
        <text x="${tx + 8}" y="${pillY + 14}" fill="${theme.textColor}"
          font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="10" font-weight="600">${moreLabel}</text>`;
    }
    y = pillY + pillH + 8;
  }

  // Footer
  const footerY = h - PADDING - 8;
  const langColor = data.languageColor ?? theme.iconColor;

  let footerContent = "";
  let fx = PADDING;

  if (data.language) {
    footerContent += `<circle cx="${fx + 5}" cy="${footerY - 4}" r="5" fill="${langColor}"/>`;
    footerContent += `<text x="${fx + 14}" y="${footerY}" fill="${theme.textColor}"
      font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="12">${escapeXml(data.language)}</text>`;
    fx += 14 + data.language.length * 7 + 16;
  }

  // Separator
  if (data.language) {
    footerContent += `<text x="${fx}" y="${footerY}" fill="${theme.border}" font-size="12">|</text>`;
    fx += 12;
  }

  // Stars
  footerContent += iconSvg(ICONS.star, fx, footerY - 12, 14, theme.iconColor);
  fx += 18;
  footerContent += `<text x="${fx}" y="${footerY}" fill="${theme.statColor}"
    font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="12" font-weight="600">${data.stars.toLocaleString()}</text>`;
  fx += String(data.stars.toLocaleString()).length * 7 + 12;

  footerContent += `<text x="${fx}" y="${footerY}" fill="${theme.border}" font-size="12">|</text>`;
  fx += 12;

  // Forks
  footerContent += iconSvg(ICONS.fork, fx, footerY - 12, 14, theme.iconColor);
  fx += 18;
  footerContent += `<text x="${fx}" y="${footerY}" fill="${theme.statColor}"
    font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="12" font-weight="600">${data.forks.toLocaleString()}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}" viewBox="0 0 ${width} ${h}">
  <rect width="${width}" height="${h}" fill="${theme.bg}" rx="10" ${border}/>
  ${iconSvg(ICONS.folder, iconX, headerY - 12, 16, theme.iconColor)}
  <text x="${textX}" y="${headerY}" font-family="Inter, 'Segoe UI', system-ui, sans-serif" font-size="14">
    ${ownerPart}${repoPart}
  </text>
  ${templateBadge}
  ${descSvg}
  ${topicsSvg}
  ${footerContent}
</svg>`;
}
