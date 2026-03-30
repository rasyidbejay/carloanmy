# CarLoan.my
Salary‑first car affordability and loan calculator built with Next.js App Router (TypeScript + Tailwind). Designed as a premium, dark, decision‑focused dashboard for Malaysian car buyers.

## Core features
- Salary‑first affordability planner with adjustable down payment, tenure, rate, and loan type (hire purchase / Islamic).
- Car discovery with local data, affordability badges, and inline selection.
- Calculator with live repayment, affordability status, and comparison scenarios.
- Simplified amortisation breakdown.
- Light/dark theme via `next-themes`.

## Tech stack
- Next.js 14 App Router (TypeScript)
- Tailwind CSS, clsx, tailwind-merge
- lucide-react icons
- next-themes for theming
- Inter font via `@fontsource/inter`

## Local development
Prereqs: Node.js 18+ (Node 20 recommended), npm.

```bash
npm install
npm run dev
# open http://localhost:3000
```

Environment (optional):
Create `.env.local` based on `.env.example` for analytics/debug flags.

## Build & preview
```bash
npm run build
npm run start   # serves the production build
```

## Deployment recommendations
This app uses Next.js App Router with dynamic rendering; it is best deployed on a platform that supports Next.js server output (e.g., **Vercel** or **Netlify Edge/SSR**).

### Deploy to Vercel (recommended)
1) Connect this repository in Vercel.  
2) Framework preset: **Next.js**.  
3) Build command: `npm run build` (default).  
4) Output: `.vercel/output` (handled automatically).  
5) Set any env vars from `.env.example` if needed.  

### About GitHub Pages
The repo currently includes a `deploy.yml` Pages workflow, but the project is **not configured for static export**. App Router features (theming, dynamic routes) require a Next.js server runtime. If you must use Pages, you would need to switch to `output: "export"` in `next.config.mjs`, ensure only static routes are used, and adjust asset `basePath`—that trade-off is not recommended for this app. Prefer Vercel for a correct deployment.

## Known limitations
- GitHub Pages workflow will fail without converting the app to a static export.
- Some pages rely on client-side hydration (theme toggle), so JS must be enabled.

## Project scripts
- `npm run dev` – start dev server
- `npm run build` – production build
- `npm run start` – run built app
- `npm run lint` – lint the codebase
