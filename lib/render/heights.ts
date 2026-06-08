import type { LangsLayout } from "./langs";

const BUFFER = 28;

/** Stats card — scales with visible stat rows. */
export function statsCardHeight(
  visibleStatCount: number,
  showRank = true,
): number {
  const padding = 50;
  const titleBlock = 45;
  const rowHeight = 26;
  const bodyHeight = Math.max(showRank ? 118 : 0, visibleStatCount * rowHeight);
  return padding + titleBlock + bodyHeight + BUFFER;
}

/** Languages card — layout-aware height. */
export function langsCardHeight(
  layout: LangsLayout,
  count: number,
  hideTitle = false,
  hideProgress = false,
): number {
  const padding = 50;
  const titleBlock = hideTitle ? 0 : 43;

  switch (layout) {
    case "compact": {
      const rows = Math.ceil(count / 2);
      return padding + titleBlock + 10 + 10 + rows * 26 + BUFFER;
    }
    case "donut":
    case "pie": {
      const legendHeight = count * 26 + 16;
      const bodyHeight = Math.max(140, legendHeight);
      return padding + titleBlock + bodyHeight + BUFFER;
    }
    default: {
      const rowHeight = hideProgress ? 24 : 42;
      const gap = 10;
      return padding + titleBlock + count * rowHeight + Math.max(0, count - 1) * gap + BUFFER;
    }
  }
}

/** Streak card — fixed three-panel layout. */
export function streakCardHeight(hideTotal = false): number {
  return hideTotal ? 175 + BUFFER : 195 + BUFFER;
}
