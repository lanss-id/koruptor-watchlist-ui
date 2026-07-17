# Koruptor Watchlist UI

A high-performance monitoring dashboard for tracking corruption cases in Indonesia, built with Next.js and Tailwind CSS. Featuring real-time data visualization and clean, dark-mode focused UI.

**Type:** Frontend Application  
**Stack:** Next.js · TypeScript · Tailwind CSS · ApexCharts · Framer Motion  
**Tag:** `DeMek Project`

---

## Architecture

```
┌─────────────────────┐
│    Vercel Edge      │
│ (Global CDN + ISR)  │
└──────────┬──────────┘
           │
  ┌────────▼────────┐
  │ Next.js App     │
  │ (React 19)      │
  └────────┬────────┘
           │
  ┌────────▼────────┐
  │ API / Backend   │
  │ (Koruptor API)  │
  └─────────────────┘
```

---

## Features

- **Dashboard:** Real-time metrics visualization using ApexCharts.
- **Dark UI:** Taste-Silk UI (#0a0a0a True Black background, #dc2626 Red accents).
- **Responsive:** Mobile-first layout with Framer Motion transitions.

---

## Deployment Strategy

### Vercel
- **Production:** `koruptor-watchlist-i65ocrve4-lanssids-projects.vercel.app`
- **CI/CD:** Automated builds on every `main` branch push.

### Testing & Verification
1. **Local:** `npm run dev` → Audit with Chrome Lighthouse.
2. **Unit Tests:** `npm test` (TDD-based)
3. **Rollout:** Deploy to preview, then merge to `main`.

---

## Roadmap

- [ ] Add real-time news scraper link.
- [ ] Implement search/filter for cases.
- [ ] Add case detail modal.

---

*Part of the **DeMek Project** — Infrastructure for autonomous AI agent operations.*
