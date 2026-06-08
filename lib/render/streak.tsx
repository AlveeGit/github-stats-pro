//  /lib/render/streak.tsx
//  SVG renderer for streak card

/**
 * lib/render/streak.tsx
 *
 * Renders the contribution streak card.
 * Three panels: total contributions | current streak | longest streak
 */

import React from "react";
import { getTheme, Theme } from "../themes";

// ── Types ──────────────────────────────────────────────────────────────────

export interface StreakCardData {
  username:          string;
  totalContributions: number;
  /** ISO date strings (YYYY-MM-DD) */
  firstContribution: string;
  currentStreak:     number;
  currentStreakStart: string;
  currentStreakEnd:   string;
  longestStreak:     number;
  longestStreakStart: string;
  longestStreakEnd:   string;
}

export interface StreakCardOptions {
  theme?:        string;
  hideBorder?:   boolean;
  hideTotal?:    boolean;
  dateFormat?:   "short" | "long" | "numeric";  // how dates are displayed
  width?:        number;
  borderRadius?: number;
}

// ── Constants ──────────────────────────────────────────────────────────────

const CARD_WIDTH  = 495;
const CARD_HEIGHT = 195;

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string, format: "short" | "long" | "numeric" = "short"): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00Z");
  if (isNaN(d.getTime())) return iso;

  switch (format) {
    case "long":
      return d.toLocaleDateString("en-US", {
        month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
      });
    case "numeric":
      return d.toLocaleDateString("en-US", {
        month: "2-digit", day: "2-digit", year: "numeric", timeZone: "UTC",
      });
    default: // short
      return d.toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
      });
  }
}

function dateRange(start: string, end: string, fmt: "short" | "long" | "numeric"): string {
  if (!start) return "";
  if (!end || start === end) return formatDate(start, fmt);
  return `${formatDate(start, fmt)} – ${formatDate(end, fmt)}`;
}

// ── Panel component ────────────────────────────────────────────────────────

function Panel({
  label,
  value,
  subLabel,
  accent,
  theme,
  isMiddle = false,
}: {
  label:    string;
  value:    string | number;
  subLabel: string;
  accent:   string;
  theme:    Theme;
  isMiddle?: boolean;
}) {
  return (
    <div
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        flex:           1,
        padding:        "0 12px",
        borderLeft:     isMiddle ? `1px solid ${theme.border}` : "none",
        borderRight:    isMiddle ? `1px solid ${theme.border}` : "none",
      }}
    >
      {/* Label */}
      <span
        style={{
          fontSize:    13,
          fontWeight:  600,
          color:       theme.textColor,
          textAlign:   "center",
          marginBottom: 6,
        }}
      >
        {label}
      </span>

      {/* Big number */}
      <span
        style={{
          fontSize:    36,
          fontWeight:  800,
          color:       accent,
          lineHeight:  1,
          marginBottom: 4,
        }}
      >
        {value}
      </span>

      {/* Sub-label (date range or "days") */}
      <span
        style={{
          fontSize:  11,
          color:     theme.textColor,
          textAlign: "center",
          opacity:   0.8,
        }}
      >
        {subLabel}
      </span>
    </div>
  );
}

// ── Flame icon SVG path ────────────────────────────────────────────────────
// Simple flame path for the streak panel
const FLAME_PATH =
  "M12.187 2.856a.53.53 0 0 0-.518.168C10.184 4.645 9.5 6.288 9.5 8c0 1.487.641 2.518 1.313 3.317C11.484 12.098 12 12.832 12 14c0 .729-.232 1.378-.61 1.908-.404-.088-.82-.261-1.23-.535C8.54 14.215 7.5 12.15 7.5 10c0-1.32.313-2.527.813-3.492.156-.3.063-.67-.219-.855a.7.7 0 0 0-.875.09C5.508 7.6 5 9.254 5 11c0 2.51 1.313 4.715 3.375 5.945A5.987 5.987 0 0 0 12 18c3.313 0 6-2.688 6-6 0-2.146-1.088-4.08-2.906-5.238-.219-.137-.5-.11-.688.073-.469.473-1.031 1.05-1.031 1.05A4.503 4.503 0 0 1 14 5.5c0-1.006-.219-1.993-.625-2.887a.532.532 0 0 0-.469-.344l-.719.587z";

// ── Main renderer ──────────────────────────────────────────────────────────

export function renderStreakCard(
  data: StreakCardData,
  options: StreakCardOptions = {}
): React.ReactElement {
  const {
    theme: themeName = "default",
    hideBorder       = false,
    hideTotal        = false,
    dateFormat       = "short",
    width            = CARD_WIDTH,
    borderRadius     = 10,
  } = options;

  const theme = getTheme(themeName);

  // Accent colours for the three panels
  const totalAccent   = theme.statColor;
  const currentAccent = theme.ringColor;    // primary brand colour for streak
  const longestAccent = theme.iconColor;

  const currentDates = dateRange(
    data.currentStreakStart,
    data.currentStreakEnd,
    dateFormat,
  );
  const longestDates = dateRange(
    data.longestStreakStart,
    data.longestStreakEnd,
    dateFormat,
  );
  const firstContrib = data.firstContribution
    ? formatDate(data.firstContribution, dateFormat)
    : "";

  return (
    <div
      style={{
        display:       "flex",
        flexDirection: "column",
        width:         `${width}px`,
        background:    theme.bg,
        border:        hideBorder ? "none" : `1px solid ${theme.border}`,
        borderRadius:  `${borderRadius}px`,
        fontFamily:    "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        boxSizing:     "border-box",
        overflow:      "hidden",
      }}
    >
      {/* Panels row */}
      <div
        style={{
          display:    "flex",
          alignItems: "stretch",
          padding:    "30px 20px",
          gap:        0,
        }}
      >
        {/* Panel 1 – Total Contributions */}
        {!hideTotal && (
          <Panel
            label="Total Contributions"
            value={data.totalContributions.toLocaleString()}
            subLabel={firstContrib ? `Since ${firstContrib}` : "All time"}
            accent={totalAccent}
            theme={theme}
          />
        )}

        {/* Panel 2 – Current Streak (middle, with flame) */}
        <div
          style={{
            display:        "flex",
            flexDirection:  "column",
            alignItems:     "center",
            justifyContent: "center",
            flex:           1,
            padding:        "0 12px",
            borderLeft:     hideTotal ? "none" : `1px solid ${theme.border}`,
            borderRight:    `1px solid ${theme.border}`,
          }}
        >
          {/* Flame icon */}
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill={currentAccent}
            style={{ marginBottom: 4 }}
          >
            <path d={FLAME_PATH} />
          </svg>

          <span
            style={{
              fontSize:    13,
              fontWeight:  600,
              color:       theme.textColor,
              textAlign:   "center",
              marginBottom: 6,
            }}
          >
            Current Streak
          </span>

          <span
            style={{
              fontSize:    36,
              fontWeight:  800,
              color:       currentAccent,
              lineHeight:  1,
              marginBottom: 2,
            }}
          >
            {data.currentStreak}
          </span>

          <span style={{ fontSize: 11, color: theme.textColor, marginBottom: 4 }}>
            days
          </span>

          <span
            style={{
              fontSize:  11,
              color:     theme.textColor,
              textAlign: "center",
              opacity:   0.8,
            }}
          >
            {currentDates}
          </span>
        </div>

        {/* Panel 3 – Longest Streak */}
        <Panel
          label="Longest Streak"
          value={data.longestStreak}
          subLabel={longestDates || "days"}
          accent={longestAccent}
          theme={theme}
        />
      </div>
    </div>
  );
}