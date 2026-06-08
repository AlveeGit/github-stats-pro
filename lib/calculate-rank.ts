/**
 * Rank calculation — weighted log scoring with sigmoid normalisation.
 *
 * Each metric is log-compressed (diminishing returns) then combined into a
 * weighted sum.  The raw score is passed through a sigmoid so the final grade
 * lives on (0, 1) and letter grades are evenly distributed.
 */

export type RankGrade = "S+" | "S" | "A+" | "A" | "B+" | "B" | "C";

export interface RankResult {
  /** Letter grade */
  grade: RankGrade;
  /** 0–100 percentile score (100 = best) */
  percentile: number;
  /** Raw sigmoid output (0–1) */
  score: number;
}

export interface RankInput {
  commits: number;
  prs: number;
  issues: number;
  reviews: number; // PR reviews given
  stars: number; // total stars received across all repos
  followers: number;
  contributions: number; // total contribution count (from contribution calendar)
  repoCount: number; // number of public repos
}

// ── Weights ────────────────────────────────────────────────────────────────
// Must sum to 1.  Commits & stars are the primary signals.
const WEIGHTS = {
  commits: 0.3,
  prs: 0.15,
  issues: 0.1,
  reviews: 0.1,
  stars: 0.2,
  followers: 0.05,
  contributions: 0.05,
  repoCount: 0.05,
} as const satisfies Record<keyof RankInput, number>;

// ── "Typical active developer" reference values for log normalisation ──────
// These represent roughly the 75th-percentile values; scoring ABOVE them
// pushes you toward S-tier, scoring below pulls you toward C.
const REFERENCE = {
  commits: 500,
  prs: 50,
  issues: 50,
  reviews: 30,
  stars: 300,
  followers: 100,
  contributions: 400,
  repoCount: 15,
} as const satisfies Record<keyof RankInput, number>;

// ── Grade thresholds (sigmoid output) ─────────────────────────────────────
const GRADE_THRESHOLDS: [number, RankGrade][] = [
  [0.97, "S+"],
  [0.92, "S"],
  [0.85, "A+"],
  [0.75, "A"],
  [0.6, "B+"],
  [0.45, "B"],
  [0.0, "C"],
];

// ── Helpers ────────────────────────────────────────────────────────────────

/** Natural-log with zero guard and normalisation against a reference value. */
function logNorm(value: number, ref: number): number {
  // Returns a dimensionless score in (0 … ~2) for typical inputs.
  return Math.log1p(value) / Math.log1p(ref);
}

/** Logistic sigmoid centred at 0.5 with steepness k. */
function sigmoid(x: number, k = 8): number {
  return 1 / (1 + Math.exp(-k * (x - 0.5)));
}

// ── Public API ─────────────────────────────────────────────────────────────

export function calculateRank(input: RankInput): RankResult {
  const metrics = Object.keys(WEIGHTS) as (keyof RankInput)[];

  // Weighted sum of log-normalised metrics
  const rawScore = metrics.reduce((sum, key) => {
    return sum + WEIGHTS[key] * logNorm(input[key], REFERENCE[key]);
  }, 0);

  // Sigmoid maps rawScore → (0, 1); we cap at a practical maximum of ~1.5 for
  // the raw sum (achievable by top 0.1% devs) so the sigmoid midpoint feels right.
  const normalised = rawScore / 1.0; // weighted sum of normalised logs ≈ 0–1.5
  const score = sigmoid(Math.min(normalised, 1.5) / 1.5);

  // Letter grade
  const grade =
    GRADE_THRESHOLDS.find(([threshold]) => score >= threshold)?.[1] ?? "C";

  // Percentile: convert sigmoid output to 0–100, inverted so higher = better
  const percentile = parseFloat((score * 100).toFixed(1));

  return { grade, percentile, score };
}

/** Utility: return a descriptive label for a grade. */
export function gradeLabel(grade: RankGrade): string {
  const labels: Record<RankGrade, string> = {
    "S+": "Legendary",
    S: "Elite",
    "A+": "Advanced",
    A: "Proficient",
    "B+": "Skilled",
    B: "Competent",
    C: "Developing",
  };
  return labels[grade];
}

/** Colour hex for the grade badge (used in SVG rendering). */
export function gradeColor(grade: RankGrade): string {
  const colors: Record<RankGrade, string> = {
    "S+": "#e040fb",
    S: "#ff6e27",
    "A+": "#4fc3f7",
    A: "#29b6f6",
    "B+": "#66bb6a",
    B: "#aed581",
    C: "#ffca28",
  };
  return colors[grade];
}
