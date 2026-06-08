//  /lib/cache.ts
//  Upstash Redis caching layer

import { Redis } from "@upstash/redis";

// ─── TTL Constants (seconds) ──────────────────────────────────────────────────

export const TTL = {
  STATS: 60 * 60, // 1 hour
  LANGS: 60 * 60 * 24, // 24 hours
  STREAK: 60 * 60, // 1 hour
  REPO: 60 * 30, // 30 minutes
} as const;

// ─── Key Helpers ──────────────────────────────────────────────────────────────

export const CacheKey = {
  stats: (username: string) => `grs:stats:${username.toLowerCase()}`,
  langs: (username: string) => `grs:langs:${username.toLowerCase()}`,
  streak: (username: string) => `grs:streak:${username.toLowerCase()}`,
  repo: (owner: string, repo: string) =>
    `grs:repo:${owner.toLowerCase()}:${repo.toLowerCase()}`,
} as const;

// ─── Client (lazy singleton) ──────────────────────────────────────────────────

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;

  const url = process.env.UPSTASH_REDIS_URL;
  const token = process.env.UPSTASH_REDIS_TOKEN;

  if (!url || !token) {
    console.warn("[cache] Upstash env vars missing — caching disabled");
    return null;
  }

  try {
    _redis = new Redis({ url, token });
    return _redis;
  } catch (err) {
    console.error("[cache] Failed to init Redis client:", err);
    return null;
  }
}

// ─── Core withCache ───────────────────────────────────────────────────────────

/**
 * Try to return cached value for `key`.
 * On miss, call `fetcher()`, store the result with `ttlSeconds`, return it.
 * If Redis is unavailable or throws, falls back to fetcher() silently.
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const redis = getRedis();

  // No Redis → just fetch directly
  if (!redis) return fetcher();

  // ── Cache read ──
  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) {
      return cached;
    }
  } catch (err) {
    console.error(`[cache] GET failed for key "${key}":`, err);
    // Fall through to fetch
  }

  // ── Cache miss → fetch ──
  const fresh = await fetcher();

  // ── Cache write (fire and forget — never let this block the response) ──
  redis.set(key, JSON.stringify(fresh), { ex: ttlSeconds }).catch((err) => {
    console.error(`[cache] SET failed for key "${key}":`, err);
  });

  return fresh;
}

// ─── Manual invalidation helpers (useful for testing / admin) ────────────────

export async function invalidate(key: string): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.del(key);
  } catch (err) {
    console.error(`[cache] DEL failed for key "${key}":`, err);
  }
}

export async function invalidateUser(username: string): Promise<void> {
  await Promise.allSettled([
    invalidate(CacheKey.stats(username)),
    invalidate(CacheKey.langs(username)),
    invalidate(CacheKey.streak(username)),
  ]);
}