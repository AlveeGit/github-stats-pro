

# GitHub Stats Pro ⚡📊

Beautiful GitHub stat cards. Zero setup. Zero backend headaches.
Just open the site, customize your cards, and paste the generated Markdown into your README.

👉 [GitHub Stats Pro Live Builder](https://github-stats-pro-alveegit.vercel.app/?utm_source=chatgpt.com)

No self-hosting required. It’s already deployed and ready to use instantly.

---

## ✨ What You Can Generate

- 📈 GitHub stats cards
- 🧠 Top language cards
- 🔥 Contribution streak cards
- 📌 Repository pins
- 🎨 20+ themes
- 🍩 Donut & pie language charts
- ⚙️ Live customization + instant preview

Everything is rendered as lightweight SVGs, perfect for GitHub READMEs, portfolios, and developer profiles.

---

# 🚀 Instant Usage

Go to:

[github-stats-pro-alveegit.vercel.app](https://github-stats-pro-alveegit.vercel.app/?utm_source=chatgpt.com)

Then:

1. Enter your GitHub username
2. Customize your card
3. Copy the generated Markdown
4. Paste into your README

Done. Your profile now glows like a cyberpunk dashboard 🌌

---

# 📦 Example Cards

## 📈 Stats Card

```markdown
![stats](https://github-stats-pro-alveegit.vercel.app/api/stats?username=octocat)
```

---

## 🧠 Top Languages

```markdown
![langs](https://github-stats-pro-alveegit.vercel.app/api/langs?username=octocat)
```

### Layouts

- `normal`
- `compact`
- `donut`
- `pie`

Example:

```markdown
![langs](https://github-stats-pro-alveegit.vercel.app/api/langs?username=octocat&layout=donut&theme=radical)
```

---

## 🔥 Contribution Streak

```markdown
![streak](https://github-stats-pro-alveegit.vercel.app/api/streak?username=octocat)
```

---

## 📌 Repository Pin

```markdown
![repo](https://github-stats-pro-alveegit.vercel.app/api/repo?username=vercel&repo=next.js)
```

---

# 🎨 Features

## ⚡ Ready-to-Use Hosted Service

Unlike most GitHub stats generators, you do **not** need to:

- deploy anything
- configure servers
- set up Redis
- create API routes

It already works out of the box.

---

## 🚫 No 100 Repo Limit

Full GitHub pagination support means large profiles and organizations work correctly.

---

## 🎛 Live Configurator

The homepage includes a real-time builder where you can:

- switch themes
- hide stats
- change layouts
- resize cards
- preview instantly
- copy Markdown with one click

No query-parameter spelunking required 🗺️

---

## 🎨 Modern Themes

Includes:

- dark themes
- light themes
- neon themes
- gradient styles
- hacker aesthetics
- minimalist layouts

From stealth mode to RGB spaceship control panel.

---

## ⚡ Fast SVG Rendering

Built using:

- [Next.js](https://nextjs.org?utm_source=chatgpt.com)
- [Satori](https://github.com/vercel/satori?utm_source=chatgpt.com)
- [GitHub GraphQL API v4](https://docs.github.com/en/graphql?utm_source=chatgpt.com)
- [Upstash Redis](https://upstash.com?utm_source=chatgpt.com)

Optimized for GitHub README performance.

---

# 🛠 API Endpoints


| Endpoint      | Purpose              |
| ------------- | -------------------- |
| `/api/stats`  | GitHub profile stats |
| `/api/langs`  | Top languages        |
| `/api/streak` | Contribution streak  |
| `/api/repo`   | Repository pin       |


All endpoints return SVG images.

---

# 🧪 Example Advanced URLs

## Donut Language Chart

```txt
/api/langs?username=octocat&layout=donut&theme=tokyonight&langs_count=8
```

## Minimal Stats Card

```txt
/api/stats?username=octocat&hide=issues,prs&hide_border=true
```

## Dracula Repo Card

```txt
/api/repo?username=vercel&repo=next.js&theme=dracula
```

---

# 🏠 Self-Hosting (Optional)

Use your own GitHub Personal Access Token.

Benefits:

- No public API bottlenecks
- No shared rate limits
- Better reliability
- Full control over caching and customization


---


# 🚀 Deploy Your Own



> Replace `YOUR_USERNAME` in the deploy URL before sharing or publishing.

---

## 🔐 Environment Variables


| Variable              | Required | Description                  |
| --------------------- | -------- | ---------------------------- |
| `GITHUB_PAT`          | ✅ Yes    | GitHub Personal Access Token |
| `UPSTASH_REDIS_URL`   | Optional | Upstash Redis REST URL       |
| `UPSTASH_REDIS_TOKEN` | Optional | Upstash Redis REST token     |


### Recommended GitHub Token Scopes


| Use Case                 | Recommended Scopes         |
| ------------------------ | -------------------------- |
| Public repositories only | `public_repo`, `read:user` |
| Private repository stats | `repo`, `read:user`        |


Create your token here:

[GitHub Personal Access Tokens](https://github.com/settings/tokens?utm_source=chatgpt.com)

---

# ⚡ Quick Usage

Replace:

- `YOUR_URL` → your deployed domain
- `USERNAME` → GitHub username

---

## 📈 Stats Card

```markdown
![stats](https://YOUR_URL/api/stats?username=USERNAME)

```

Example:

```markdown
![stats](https://github-stats-pro.vercel.app/api/stats?username=octocat&theme=tokyonight)

```

---

## 🧠 Top Languages

```markdown
![langs](https://YOUR_URL/api/langs?username=USERNAME)

```

### Available Layouts

- `normal`
- `compact`
- `donut`
- `pie`

Example:

```markdown
![langs](https://YOUR_URL/api/langs?username=octocat&layout=donut&theme=radical)

```

---

## 🔥 Contribution Streak

```markdown
![streak](https://YOUR_URL/api/streak?username=USERNAME)

```

---

## 📌 Repository Pin

```markdown
![repo](https://YOUR_URL/api/repo?username=USERNAME&repo=REPONAME)

```

---


  

# 📚 API Reference

All endpoints return:

```http
Content-Type: image/svg+xml

```

Validation failures return JSON `400` responses.  
GitHub/API failures return themed SVG error cards instead of broken images.

---

# 📈 `/api/stats`

## Parameters


| Param          | Type     | Default   | Description              |
| -------------- | -------- | --------- | ------------------------ |
| `username`     | required | —         | GitHub username          |
| `theme`        | optional | `default` | Theme name               |
| `show_icons`   | optional | `true`    | Show stat icons          |
| `hide_border`  | optional | `false`   | Remove card border       |
| `card_width`   | optional | `495`     | Width in px (`200–1000`) |
| `hide`         | optional | —         | Hide specific stats      |
| `custom_title` | optional | —         | Custom card title        |


### Hideable Stats

```txt
stars
commits
prs
issues
reviews
followers
repos
contributions

```

### Example

```txt
/api/stats?username=octocat&theme=dark&hide=issues,prs&card_width=450

```

---

# 🧠 `/api/langs`

## Parameters


| Param           | Type     | Default   | Description              |
| --------------- | -------- | --------- | ------------------------ |
| `username`      | required | —         | GitHub username          |
| `theme`         | optional | `default` | Theme name               |
| `layout`        | optional | `normal`  | Card layout              |
| `langs_count`   | optional | `6`       | Languages shown (`1–12`) |
| `hide`          | optional | —         | Excluded languages       |
| `card_width`    | optional | `300`     | Width in px              |
| `hide_border`   | optional | `false`   | Remove border            |
| `hide_progress` | optional | `false`   | Hide charts/bars         |


### Example

```txt
/api/langs?username=octocat&layout=donut&langs_count=8&hide=html

```

---

# 🔥 `/api/streak`

## Parameters


| Param         | Type     | Default   | Description              |
| ------------- | -------- | --------- | ------------------------ |
| `username`    | required | —         | GitHub username          |
| `theme`       | optional | `default` | Theme name               |
| `card_width`  | optional | `495`     | Width in px              |
| `hide_border` | optional | `false`   | Remove border            |
| `date_format` | optional | `short`   | Date formatting          |
| `hide_total`  | optional | `false`   | Hide total contributions |


### Date Formats

- `short`
- `long`
- `numeric`

### Example

```txt
/api/streak?username=octocat&theme=radical&hide_total=true

```

---

# 📌 `/api/repo`

## Parameters


| Param         | Type     | Default   | Description      |
| ------------- | -------- | --------- | ---------------- |
| `username`    | required | —         | Repository owner |
| `repo`        | required | —         | Repository name  |
| `theme`       | optional | `default` | Theme name       |
| `card_width`  | optional | `400`     | Width in px      |
| `hide_border` | optional | `false`   | Remove border    |
| `show_owner`  | optional | `true`    | Show owner name  |


### Example

```txt
/api/repo?username=vercel&repo=next.js&theme=dracula&show_owner=false

```

---

# 🏠 Self-Hosting Guide

## 1️⃣ Fork the Repository

Fork this repository to your GitHub account.

---

## 2️⃣ Create a GitHub Token

Generate a PAT here:

[GitHub Token Settings](https://github.com/settings/tokens?utm_source=chatgpt.com)

Recommended scopes:

```txt
read:user
public_repo

```

Use `repo` if you want private repository statistics.

---

## 3️⃣ Create Redis Cache (Optional)

Create a free Redis database using:

[Upstash](https://upstash.com/?utm_source=chatgpt.com)

Caching is optional but highly recommended for:

- faster responses
- reduced GitHub API usage
- better cold-start performance

---

## 4️⃣ Deploy to Vercel

### One-Click Deploy

Use the deploy button above ☝️

### Manual Deploy

```bash
pnpm install
pnpm build

```

Then configure environment variables in your Vercel project settings.

---

## 5️⃣ Configure Homepage Repository Link (Optional)

Set:

```env
NEXT_PUBLIC_GITHUB_REPO_URL=

```

This updates the homepage “Star on GitHub” button to your fork.

---

# 💻 Local Development

```bash
pnpm install

```

Create `.env.local`

```env
GITHUB_PAT=
UPSTASH_REDIS_URL=
UPSTASH_REDIS_TOKEN=

```

Run development server:

```bash
pnpm dev

```

Open:

```txt
http://localhost:3000

```

---

# 🧱 Tech Stack

- [Next.js](https://nextjs.org/?utm_source=chatgpt.com) 16 (App Router)
- [Satori](https://github.com/vercel/satori?utm_source=chatgpt.com) for SVG rendering
- [GitHub GraphQL API v4](https://docs.github.com/en/graphql?utm_source=chatgpt.com)
- [Upstash Redis](https://upstash.com/?utm_source=chatgpt.com)
- [Tailwind CSS](https://tailwindcss.com/?utm_source=chatgpt.com)
- [shadcn/ui](https://ui.shadcn.com/?utm_source=chatgpt.com)

---


# 🪪 License

MIT

Fork it. Customize it. Turn your README into a tiny operating system terminal from the year 2147 🖥️✨  