//  /lib/render/langs.tsx
//  SVG renderer for languages card

/**
 * lib/render/langs.tsx
 *
 * Renders the "Top Languages" card.
 * Supports four layouts: normal | compact | donut | pie
 */

import React from "react";
import { getTheme, Theme } from "../themes";

// ── Types ──────────────────────────────────────────────────────────────────

export interface LanguageData {
  name:       string;
  percentage: number;   // 0–100
  color:      string;   // hex
  bytes:      number;
}

export interface LangsCardData {
  username: string;
  languages: LanguageData[];
}

export type LangsLayout = "normal" | "compact" | "donut" | "pie";

export interface LangsCardOptions {
  theme?:          string;
  layout?:         LangsLayout;
  hideBorder?:     boolean;
  hideTitle?:      boolean;
  hideProgress?:   boolean;
  showPercentage?: boolean;
  langsCount?:     number;   // max languages to show (default 5)
  width?:          number;
  customTitle?:    string;
  borderRadius?:   number;
}

// ── Constants ──────────────────────────────────────────────────────────────

const CARD_WIDTH = 300;

// ── Sub-renderers ──────────────────────────────────────────────────────────

/** Normal: vertical bars per language with progress bar */
function NormalLayout({
  langs, theme, showPct, hideProgress,
}: {
  langs: LanguageData[]; theme: Theme; showPct: boolean; hideProgress: boolean;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      {langs.map((l) => (
        <div key={l.name} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
            <span style={{ color: theme.textColor, fontWeight: 600 }}>{l.name}</span>
            {showPct && (
              <span style={{ color: theme.statColor }}>{l.percentage.toFixed(1)}%</span>
            )}
          </div>
          {!hideProgress && (
            <div
              style={{
                width: "100%", height: 8, background: theme.progressBarBg, borderRadius: 4,
                overflow: "hidden", display: "flex",
              }}
            >
              <div
                style={{
                  width:        `${l.percentage}%`,
                  height:       "100%",
                  background:   l.color,
                  borderRadius: 4,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/** Compact: coloured bullets in a 2-column grid */
function CompactLayout({
  langs, theme, showPct,
}: {
  langs: LanguageData[]; theme: Theme; showPct: boolean;
}) {
  // Split top bar — proportional widths
  const totalPct = langs.reduce((s, l) => s + l.percentage, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%" }}>
      {/* Stacked progress bar */}
      <div
        style={{
          display: "flex", width: "100%", height: 10, borderRadius: 5,
          overflow: "hidden",
        }}
      >
        {langs.map((l) => (
          <div
            key={l.name}
            style={{
              width:      `${(l.percentage / totalPct) * 100}%`,
              height:     "100%",
              background: l.color,
            }}
          />
        ))}
      </div>

      {/* Legend — two flex columns (Satori does not support CSS grid) */}
      <div style={{ display: "flex", flexDirection: "row", gap: 12, width: "100%" }}>
        {[0, 1].map((col) => (
          <div
            key={col}
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 6,
            }}
          >
            {langs
              .filter((_, i) => i % 2 === col)
              .map((l) => (
                <div
                  key={l.name}
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: l.color,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    style={{
                      fontSize: 12,
                      color: theme.textColor,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {l.name}
                    {showPct && (
                      <span style={{ color: theme.statColor, marginLeft: 4 }}>
                        {l.percentage.toFixed(1)}%
                      </span>
                    )}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Donut chart using SVG arcs */
function DonutLayout({
  langs, theme, showPct,
}: {
  langs: LanguageData[]; theme: Theme; showPct: boolean;
}) {
  const SIZE = 120;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R  = 45;   // outer radius
  const r  = 28;   // inner radius (donut hole)

  const totalPct = langs.reduce((s, l) => s + l.percentage, 0);

  // Build arc segments
  const segments: { path: string; color: string; name: string; pct: number }[] = [];
  let angle = -Math.PI / 2; // start at top

  for (const lang of langs) {
    const sweep = (lang.percentage / totalPct) * 2 * Math.PI;
    const x1o = cx + R * Math.cos(angle);
    const y1o = cy + R * Math.sin(angle);
    const x1i = cx + r * Math.cos(angle);
    const y1i = cy + r * Math.sin(angle);
    angle += sweep;
    const x2o = cx + R * Math.cos(angle);
    const y2o = cy + R * Math.sin(angle);
    const x2i = cx + r * Math.cos(angle);
    const y2i = cy + r * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;

    segments.push({
      path:  `M ${x1o} ${y1o} A ${R} ${R} 0 ${large} 1 ${x2o} ${y2o} L ${x2i} ${y2i} A ${r} ${r} 0 ${large} 0 ${x1i} ${y1i} Z`,
      color: lang.color,
      name:  lang.name,
      pct:   lang.percentage,
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ flexShrink: 0 }}>
        {segments.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke={theme.bg} strokeWidth={1} />
        ))}
      </svg>

      {/* Legend */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {langs.map((l) => (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{ width: 10, height: 10, borderRadius: 2, background: l.color, flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: theme.textColor }}>
              {l.name}
              {showPct && (
                <span style={{ color: theme.statColor, marginLeft: 4 }}>
                  {l.percentage.toFixed(1)}%
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Pie chart (same as donut but no hole) */
function PieLayout({
  langs, theme, showPct,
}: {
  langs: LanguageData[]; theme: Theme; showPct: boolean;
}) {
  const SIZE = 120;
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const R  = 50;

  const totalPct = langs.reduce((s, l) => s + l.percentage, 0);

  const segments: { path: string; color: string; name: string; pct: number }[] = [];
  let angle = -Math.PI / 2;

  for (const lang of langs) {
    const sweep = (lang.percentage / totalPct) * 2 * Math.PI;
    const x1 = cx + R * Math.cos(angle);
    const y1 = cy + R * Math.sin(angle);
    angle += sweep;
    const x2 = cx + R * Math.cos(angle);
    const y2 = cy + R * Math.sin(angle);
    const large = sweep > Math.PI ? 1 : 0;

    segments.push({
      path:  `M ${cx} ${cy} L ${x1} ${y1} A ${R} ${R} 0 ${large} 1 ${x2} ${y2} Z`,
      color: lang.color,
      name:  lang.name,
      pct:   lang.percentage,
    });
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ flexShrink: 0 }}>
        {segments.map((s, i) => (
          <path key={i} d={s.path} fill={s.color} stroke={theme.bg} strokeWidth={1} />
        ))}
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {langs.map((l) => (
          <div key={l.name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div
              style={{ width: 10, height: 10, borderRadius: 2, background: l.color, flexShrink: 0 }}
            />
            <span style={{ fontSize: 12, color: theme.textColor }}>
              {l.name}
              {showPct && (
                <span style={{ color: theme.statColor, marginLeft: 4 }}>
                  {l.percentage.toFixed(1)}%
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main renderer ──────────────────────────────────────────────────────────

export function renderLangsCard(
  data: LangsCardData,
  options: LangsCardOptions = {}
): React.ReactElement {
  const {
    theme: themeName  = "default",
    layout            = "normal",
    hideBorder        = false,
    hideTitle         = false,
    hideProgress      = false,
    showPercentage    = true,
    langsCount        = 5,
    width             = CARD_WIDTH,
    customTitle,
    borderRadius      = 10,
  } = options;

  const theme = getTheme(themeName);
  const langs = data.languages.slice(0, langsCount);
  const title = customTitle ?? "Most Used Languages";

  let body: React.ReactElement;
  switch (layout) {
    case "compact":
      body = <CompactLayout langs={langs} theme={theme} showPct={showPercentage} />;
      break;
    case "donut":
      body = <DonutLayout langs={langs} theme={theme} showPct={showPercentage} />;
      break;
    case "pie":
      body = <PieLayout langs={langs} theme={theme} showPct={showPercentage} />;
      break;
    default:
      body = (
        <NormalLayout
          langs={langs}
          theme={theme}
          showPct={showPercentage}
          hideProgress={hideProgress}
        />
      );
  }

  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        width:         `${width}px`,
        background:    theme.bg,
        border:        hideBorder ? "none" : `1px solid ${theme.border}`,
        borderRadius:  `${borderRadius}px`,
        padding:       "25px 25px",
        fontFamily:    "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        boxSizing:     "border-box",
      }}
    >
      {!hideTitle && (
        <div
          style={{
            fontSize:    17,
            fontWeight:  700,
            color:       theme.titleColor,
            marginBottom: 18,
          }}
        >
          {title}
        </div>
      )}

      {body}
    </div>
  );
}