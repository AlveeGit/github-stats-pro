# GitHub Stats Pro

A self-hosted, embeddable alternative to [github-readme-stats](https://github.com/anuraghazra/github-readme-stats). Generate SVG cards for GitHub stats, top languages, contribution streaks, and repo pins — with a live configurator UI and one-click Vercel deploy.

## Features

- **Full repo pagination** — no 100-repo cap
- **4 language layouts** — normal, compact, donut, pie
- **20+ themes** — dark, light, and colorful presets
- **Self-hosted** — your own GitHub PAT, no shared rate limits
- **Redis caching** — Upstash with graceful fallback
- **Live configurator** — build and preview cards at the homepage

## Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2Fgithub-stats-pro&env=GITHUB_PAT,UPSTASH_REDIS_URL,UPSTASH_REDIS_TOKEN&envDescription=Required+environment+variables)

> Replace `YOUR_USERNAME` in the button URL with your GitHub username before sharing.

### Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GITHUB_PAT` | Yes | GitHub Personal Access Token with `read:user` and `repo` scopes |
| `UPSTASH_REDIS_URL` | No | Upstash Redis REST URL (caching disabled if missing) |
| `UPSTASH_REDIS_TOKEN` | No | Upstash Redis REST token |

## Quick Usage

Replace `YOUR_URL` with your deployment URL and `USERNAME` with a GitHub username.

**Stats card**

```markdown
![stats](https://YOUR_URL/api/stats?username=USERNAME)
```

**Top languages**

```markdown
![langs](https://YOUR_URL/api/langs?username=USERNAME)
```

**Contribution streak**

```markdown
![streak](https://YOUR_URL/api/streak?username=USERNAME)
```

**Repo pin**

```markdown
![repo](https://YOUR_URL/api/repo?username=USERNAME&repo=REPONAME)
```

Or use the live configurator at `https://YOUR_URL` to build URLs interactively.

## API Reference

All endpoints return `image/svg+xml`. Missing required params return `400` JSON. Fetch errors return a themed SVG error card.

### `GET /api/stats`

| Param | Required | Default | Description |
|---|---|---|---|
| `username` | Yes | — | GitHub username |
| `theme` | No | `default` | Theme name (see configurator for full list) |
| `show_icons` | No | `true` | Show stat icons (`true` / `false`) |
| `hide_border` | No | `false` | Remove card border |
| `card_width` | No | `495` | Card width in pixels (200–1000) |
| `hide` | No | — | Comma-separated stats to hide: `stars`, `commits`, `prs`, `issues`, `reviews`, `followers`, `repos`, `contributions` |
| `custom_title` | No | — | Override the card title |

**Example**

```
/api/stats?username=octocat&theme=dark&hide=issues,prs&card_width=450
```

---

### `GET /api/langs`

| Param | Required | Default | Description |
|---|---|---|---|
| `username` | Yes | — | GitHub username |
| `theme` | No | `default` | Theme name |
| `layout` | No | `normal` | `normal` \| `compact` \| `donut` \| `pie` |
| `langs_count` | No | `6` | Number of languages to show (1–12) |
| `hide` | No | — | Comma-separated languages to exclude, e.g. `html,css` |
| `card_width` | No | `300` | Card width in pixels (200–1000) |
| `hide_border` | No | `false` | Remove card border |
| `hide_progress` | No | `false` | Hide progress bars / chart, list only |

**Example**

```
/api/langs?username=octocat&layout=donut&langs_count=8&hide=html
```

---

### `GET /api/streak`

| Param | Required | Default | Description |
|---|---|---|---|
| `username` | Yes | — | GitHub username |
| `theme` | No | `default` | Theme name |
| `card_width` | No | `495` | Card width in pixels (200–1000) |
| `hide_border` | No | `false` | Remove card border |
| `date_format` | No | `short` | `short` \| `long` \| `numeric` |
| `hide_total` | No | `false` | Hide the total contributions panel |

**Example**

```
/api/streak?username=octocat&theme=radical&hide_total=true
```

---

### `GET /api/repo`

| Param | Required | Default | Description |
|---|---|---|---|
| `username` | Yes | — | Repository owner (GitHub username or org) |
| `repo` | Yes | — | Repository name |
| `theme` | No | `default` | Theme name |
| `card_width` | No | `400` | Card width in pixels (200–1000) |
| `hide_border` | No | `false` | Remove card border |
| `show_owner` | No | `true` | Show `owner / repo` in the header |

**Example**

```
/api/repo?username=vercel&repo=next.js&theme=dracula&show_owner=false
```

## Self-Hosting

1. **Fork** this repository on GitHub.
2. **Create a GitHub PAT** at [github.com/settings/tokens](https://github.com/settings/tokens) with `read:user` and `repo` scopes (public repos only need `public_repo`).
3. **Create an Upstash Redis database** at [upstash.com](https://upstash.com) (free tier works; disable eviction).
4. **Deploy to Vercel** using the button above, or:
   ```bash
   pnpm install
   pnpm build
   ```
   Set the three environment variables in your Vercel project settings.
5. **Update** `NEXT_PUBLIC_GITHUB_REPO_URL` (optional) to point the homepage star button to your fork.

## Local Development

```bash
pnpm install
# Create .env.local with GITHUB_PAT, UPSTASH_REDIS_URL, UPSTASH_REDIS_TOKEN
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the configurator.

## Tech Stack

- Next.js 16 (App Router)
- Satori (SVG rendering)
- GitHub GraphQL API v4
- Upstash Redis
- Tailwind CSS + shadcn/ui

## License

MIT
