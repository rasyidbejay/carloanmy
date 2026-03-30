# CarLoan.my · Premium Car Affordability & Loan Dashboard
Decision-first, salary-aware car affordability and loan experience for Malaysian drivers. Built as a dark, premium dashboard that helps users understand “What car can I afford?” before they dive into the numbers.

![Stack](https://img.shields.io/badge/Next.js-14-black?logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript&logoColor=white)
![Tailwind_CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwind-css&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=black)
![Theme](https://img.shields.io/badge/Theming-next--themes-8b5cf6)

---

## 1) Product summary
CarLoan.my is a salary-first car affordability and loan decision tool. It lets users search Malaysian models, see affordability at a glance, adjust financing inputs, compare scenarios, and review a simple flat-rate repayment breakdown.

## 2) Problem it solves
Most loan calculators start from a car price. CarLoan.my starts from salary, down payment, and tenure to surface realistic options and repayments, reducing decision fatigue for buyers.

## 3) Key features
- Salary-first affordability inputs with loan type toggle (hire purchase / Islamic)
- Car discovery with affordability badges and inline selection
- Live calculator: loan amount, monthly payment, total repayment, interest, affordability status
- Scenario compare (save/apply/remove up to 3 setups)
- Simplified flat-rate amortisation breakdown (monthly and yearly views)
- Dark/light theme with `next-themes`
- Mobile-friendly layout and responsive grids

## 4) Tech stack
- **Framework:** Next.js 14 App Router, React 18, TypeScript
- **UI:** Tailwind CSS, clsx, tailwind-merge, lucide-react icons, @fontsource/inter
- **State & logic:** React state/hooks, custom calculator utilities
- **Theming:** next-themes (class-based)

## 5) UI / UX direction
- Premium dark dashboard, Apple/Notion-inspired restraint
- Decision-first hierarchy: affordability → calculator → compare → breakdown
- Soft cards, rounded containers, subtle accents, responsive mobile support

## 6) Project structure (high level)
```bash
src/
  app/
    page.tsx          # main dashboard + views (affordability, discover, calculator, compare, breakdown)
    layout.tsx        # App shell & providers
    providers.tsx     # Theme provider
    globals.css       # Tailwind and theme tokens
  components/
    Sidebar.tsx
    SearchBar.tsx
    CarCard.tsx
    CarGrid.tsx
    SelectedCarHero.tsx
    InputPanel.tsx
    ResultPanel.tsx
    ComparePanel.tsx
    AmortizationTable.tsx
    ui/               # shared UI primitives (Card, Button, Input, etc.)
  data/
    cars.ts           # local starter dataset
  lib/
    calculator.ts     # flat-rate loan math
    format.ts         # currency/percent helpers
  types/
    car.ts, loan.ts
public/
  cars/               # car images (place locally)
  placeholder/        # fallback images
```

## 7) How it works (flow)
1. **Affordability view:** Enter salary, down payment, tenure, rate, loan type → budgets and recommended max prices update instantly.
2. **Browse/Discover:** Search or pick a featured car; affordability badges rank options.
3. **Calculator:** Selected car seeds inputs; live repayment and affordability status update as you edit.
4. **Compare:** Save up to 3 scenarios, highlight best monthly repayment, view deltas vs baseline.
5. **Breakdown:** Simplified flat-rate amortisation schedule (monthly & yearly).

## 8) Local setup
Prereqs: Node 18+ (20 recommended), npm.
```bash
npm install
npm run dev
# open http://localhost:3000
```
Optional env: copy `.env.example` to `.env.local` and fill values if needed.

## 9) Available scripts
```bash
npm run dev     # start dev server
npm run build   # production build
npm run start   # run built app
npm run lint    # lint the codebase
```

## 10) Responsive support
- Mobile: stacked sections, single-column inputs/cards, slide-in mobile nav.
- Tablet: 2–3 column grids where space allows.
- Desktop: full dashboard shell with sidebar and wide grids.

## 11) Known limitations
- Uses a simplified flat-rate loan model (not bank-grade reducing balance).
- No backend/APIs; data is local and static.
- GitHub Pages static export is not configured; use an SSR-capable host for production.

## 12) Future improvements
- Bank-style reducing-balance calculations and rate tables
- Richer car dataset with specs and images
- Export/share flows (PDF or link)
- User profiles to save scenarios

## 13) Screenshots
- _Add your latest desktop and mobile screenshots here_

## 14) Closing
CarLoan.my focuses on clarity and confidence: start from salary, see what’s affordable, adjust, compare, and decide—all in one premium dashboard.
