/**
 * Shared SVG utilities — Satori rendering + error cards.
 */

import React from "react";
import satori, { type SatoriOptions } from "satori";
import { getTheme } from "../themes";
import { GitHubError } from "../github";

// ── Font loading (cached) ────────────────────────────────────────────────────

let fontsPromise: Promise<SatoriOptions["fonts"]> | null = null;

async function getFonts(): Promise<SatoriOptions["fonts"]> {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      fetch(
        "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-400-normal.woff",
      ).then((r) => r.arrayBuffer()),
      fetch(
        "https://cdn.jsdelivr.net/npm/@fontsource/inter@5.0.18/files/inter-latin-700-normal.woff",
      ).then((r) => r.arrayBuffer()),
    ]).then(([regular, bold]) => [
      { name: "Inter", data: regular, weight: 400 as const, style: "normal" as const },
      { name: "Inter", data: bold, weight: 700 as const, style: "normal" as const },
    ]);
  }
  return fontsPromise;
}

// ── Satori wrapper ─────────────────────────────────────────────────────────────

export async function elementToSvg(
  element: React.ReactElement,
  width: number,
  height: number,
): Promise<string> {
  return satori(element, {
    width,
    height,
    fonts: await getFonts(),
  });
}

// ── Error helpers ────────────────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function renderErrorSvg(
  message: string,
  themeName = "default",
  width = 495,
): string {
  const theme = getTheme(themeName);
  const h = 120;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${h}" viewBox="0 0 ${width} ${h}">
  <rect width="${width}" height="${h}" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1" rx="10"/>
  <text x="${width / 2}" y="${h / 2}" text-anchor="middle" dominant-baseline="middle"
    fill="${theme.titleColor}" font-family="Inter, 'Segoe UI', system-ui, sans-serif"
    font-size="14" font-weight="700">${escapeXml(message)}</text>
</svg>`;
}

export function getErrorMessage(err: unknown, fallback = "something went wrong"): string {
  if (err instanceof GitHubError) {
    if (err.status === 404) {
      return err.message.includes("not found")
        ? err.message
        : `Error: ${err.message}`;
    }
    if (err.status === 403 || err.status === 429) {
      return "Error: rate limited, try again later";
    }
    return `Error: ${err.message}`;
  }
  if (err instanceof Error) return `Error: ${err.message}`;
  return `Error: ${fallback}`;
}

export function svgResponse(svg: string, maxAge = 3600): Response {
  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": `public, max-age=${maxAge}, s-maxage=${maxAge}`,
    },
  });
}

// ── Query param helpers ────────────────────────────────────────────────────────

export function parseBool(
  value: string | null,
  defaultValue: boolean,
): boolean {
  if (value === null) return defaultValue;
  return value === "true" || value === "1";
}

export function parseIntParam(
  value: string | null,
  defaultValue: number,
  min?: number,
  max?: number,
): number {
  if (value === null) return defaultValue;
  const n = parseInt(value, 10);
  if (isNaN(n)) return defaultValue;
  if (min !== undefined && n < min) return min;
  if (max !== undefined && n > max) return max;
  return n;
}
