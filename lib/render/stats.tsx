//  /lib/render/stats.tsx
//  SVG renderer for stats car

/**
 * lib/render/stats.tsx
 *
 * Renders the "GitHub Stats" card as a JSX tree consumed by Satori.
 * Returns a React element — NOT a string.  Pass this to satori() in the API route.
 */

import React from "react";
import { getTheme, Theme } from "../themes";
import { calculateRank, gradeColor, RankInput } from "../calculate-rank";

// ── Types ──────────────────────────────────────────────────────────────────

export interface StatsCardData {
  username: string;
  name: string;
  avatarUrl?: string;
  totalStars: number;
  totalCommits: number;
  totalPRs: number;
  totalIssues: number;
  totalReviews: number;
  followers: number;
  contributions: number;
  repoCount: number;
}

export interface StatsCardOptions {
  theme?: string;
  showIcons?: boolean;
  showRank?: boolean;
  showAvatar?: boolean;
  hideBorder?: boolean;
  hideTitle?: boolean;
  // Comma-separated list of stat keys to hide
  hideStats?: string;
  width?: number;
  customTitle?: string;
  borderRadius?: number;
}

// ── Constants ──────────────────────────────────────────────────────────────

const CARD_WIDTH  = 495;
const CARD_HEIGHT = 195;

// SVG-path icons (subset of Simple Icons / Octicons, path-only, 16×16 viewBox)
const ICONS = {
  star:    "M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 11.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z",
  commit:  "M1.643 3.143L.427 1.927A.25.25 0 0 0 0 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 0 0 .177-.427L2.715 4.215a6.5 6.5 0 1 1-1.18 4.458.75.75 0 1 0-1.493.154A8.001 8.001 0 1 0 1.643 3.143Z",
  pr:      "M1.5 3.25a2.25 2.25 0 1 1 3 2.122v5.256a2.251 2.251 0 1 1-1.5 0V5.372A2.25 2.25 0 0 1 1.5 3.25Zm5.677-.177L9.573.677A.25.25 0 0 1 10 .854V2.5h1A2.5 2.5 0 0 1 13.5 5v5.628a2.251 2.251 0 1 1-1.5 0V5a1 1 0 0 0-1-1h-1v1.646a.25.25 0 0 1-.427.177L7.177 3.427a.25.25 0 0 1 0-.354ZM3.75 2.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm0 9.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Zm8.25.75a.75.75 0 1 0 1.5 0 .75.75 0 0 0-1.5 0Z",
  issue:   "M8 9.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0A6.5 6.5 0 0 0 1.5 8Z",
  review:  "M10.3 6.74a.75.75 0 0 1-.04 1.06l-2.908 2.772a.75.75 0 0 1-1.054-.007L4.53 8.82a.75.75 0 0 1 1.06-1.06l1.256 1.256 2.381-2.268a.75.75 0 0 1 1.073.032ZM0 4.75C0 3.784.784 3 1.75 3h12.5c.966 0 1.75.784 1.75 1.75v7a1.75 1.75 0 0 1-1.75 1.75H1.75A1.75 1.75 0 0 1 0 11.75Zm1.75-.25a.25.25 0 0 0-.25.25v7c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-7a.25.25 0 0 0-.25-.25Z",
  follower:"M2 5.5a3.5 3.5 0 1 1 5.898 2.549 5.508 5.508 0 0 1 3.034 4.084.75.75 0 1 1-1.482.235 4 4 0 0 0-7.9 0 .75.75 0 0 1-1.482-.236A5.507 5.507 0 0 1 3.102 8.05 3.493 3.493 0 0 1 2 5.5ZM11 4a3.001 3.001 0 0 1 2.22 5.018 5.01 5.01 0 0 1 2.56 3.012.749.749 0 0 1-.885.954.752.752 0 0 1-.549-.514 3.507 3.507 0 0 0-2.522-2.372.75.75 0 0 1-.574-.73v-.352a.75.75 0 0 1 .416-.672A1.5 1.5 0 0 0 11 5.5.75.75 0 0 1 11 4Zm-5.5-.5a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 3.5Z",
  repo:    "M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z",
};

// ── Helpers ────────────────────────────────────────────────────────────────

function StatRow({
  icon, label, value, theme, showIcon,
}: {
  icon: string; label: string; value: string | number;
  theme: Theme; showIcon: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 14,
        color: theme.textColor,
        marginBottom: 6,
      }}
    >
      {showIcon && (
        <svg
          width={16}
          height={16}
          viewBox="0 0 16 16"
          fill={theme.iconColor}
          style={{ flexShrink: 0 }}
        >
          <path d={icon} />
        </svg>
      )}
      <span style={{ flex: 1 }}>{label}:</span>
      <span style={{ fontWeight: 700, color: theme.statColor }}>{value}</span>
    </div>
  );
}

function RankCircle({
  grade, score, color, theme,
}: {
  grade: string; score: number; color: string; theme: Theme;
}) {
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = circ * score;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: 110,
        height: 110,
        flexShrink: 0,
        position: "relative",
      }}
    >
      <svg width={110} height={110} viewBox="0 0 110 110">
        <circle
          cx={55}
          cy={55}
          r={r}
          fill="none"
          stroke={theme.progressBarBg}
          strokeWidth={8}
        />
        <circle
          cx={55}
          cy={55}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={`${dash} ${circ - dash}`}
          strokeLinecap="round"
          transform="rotate(-90 55 55)"
        />
      </svg>
      {/* HTML labels — Satori does not support SVG <text> */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 110,
          height: 110,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 700,
            color,
            lineHeight: 1,
          }}
        >
          {grade}
        </span>
        <span
          style={{
            fontSize: 11,
            color: theme.textColor,
            lineHeight: 1,
          }}
        >
          Rank
        </span>
      </div>
    </div>
  );
}

// ── Main renderer ──────────────────────────────────────────────────────────

export function renderStatsCard(
  data: StatsCardData,
  options: StatsCardOptions = {}
): React.ReactElement {
  const {
    theme: themeName = "default",
    showIcons       = true,
    showRank        = true,
    showAvatar      = false,
    hideBorder      = false,
    hideTitle       = false,
    hideStats       = "",
    width           = CARD_WIDTH,
    customTitle,
    borderRadius    = 10,
  } = options;

  const theme = getTheme(themeName);
  const hidden = new Set(hideStats.split(",").map((s) => s.trim()).filter(Boolean));

  const rankInput: RankInput = {
    commits:       data.totalCommits,
    prs:           data.totalPRs,
    issues:        data.totalIssues,
    reviews:       data.totalReviews,
    stars:         data.totalStars,
    followers:     data.followers,
    contributions: data.contributions,
    repoCount:     data.repoCount,
  };
  const rank = calculateRank(rankInput);
  const rankCol = gradeColor(rank.grade);

  const title = customTitle ?? `${data.name}'s GitHub Stats`;

  // All possible stat rows
  const allStats = [
    { key: "stars",       icon: ICONS.star,     label: "Total Stars Earned", value: data.totalStars.toLocaleString() },
    { key: "commits",     icon: ICONS.commit,   label: "Total Commits",       value: data.totalCommits.toLocaleString() },
    { key: "prs",         icon: ICONS.pr,       label: "Pull Requests",       value: data.totalPRs.toLocaleString() },
    { key: "issues",      icon: ICONS.issue,    label: "Issues Opened",       value: data.totalIssues.toLocaleString() },
    { key: "reviews",     icon: ICONS.review,   label: "PR Reviews",          value: data.totalReviews.toLocaleString() },
    { key: "followers",   icon: ICONS.follower, label: "Followers",           value: data.followers.toLocaleString() },
    { key: "repos",       icon: ICONS.repo,     label: "Public Repos",        value: data.repoCount.toLocaleString() },
    { key: "contributions", icon: ICONS.commit, label: "Contributions",       value: data.contributions.toLocaleString() },
  ].filter((s) => !hidden.has(s.key));

  const contentWidth = showRank ? width - 150 : width - 40;

  return (
    <div
      style={{
        display:         "flex",
        flexDirection:   "column",
        width:           `${width}px`,
        background:      theme.bg,
        border:          hideBorder ? "none" : `1px solid ${theme.border}`,
        borderRadius:    `${borderRadius}px`,
        padding:         "25px 30px",
        fontFamily:      "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        boxSizing:       "border-box",
      }}
    >
      {/* Title */}
      {!hideTitle && (
        <div
          style={{
            display:     "flex",
            alignItems:  "center",
            gap:         10,
            marginBottom: 20,
          }}
        >
          {showAvatar && data.avatarUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.avatarUrl}
              width={32}
              height={32}
              style={{ borderRadius: "50%" }}
              alt={data.username}
            />
          )}
          <span
            style={{
              fontSize:   17,
              fontWeight: 700,
              color:      theme.titleColor,
            }}
          >
            {title}
          </span>
        </div>
      )}

      {/* Body: stats + rank */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {/* Stats list */}
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {allStats.map((s) => (
            <StatRow
              key={s.key}
              icon={s.icon}
              label={s.label}
              value={s.value}
              theme={theme}
              showIcon={showIcons}
            />
          ))}
        </div>

        {/* Rank ring */}
        {showRank && (
          <RankCircle
            grade={rank.grade}
            score={rank.score}
            color={rankCol}
            theme={theme}
          />
        )}
      </div>
    </div>
  );
}