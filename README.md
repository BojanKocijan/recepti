# Meal Planner

A personal weekly meal planner built as a fat-loss-focused, budget-conscious
alternative to HelloFresh. Features 27 high-protein recipes, weekly meal
planning, package-based shopping lists, leftover tracking with bonus recipe
suggestions, and full English/Serbian (latinica) translation.

## Features

- 📅 Weekly meal plan (Mon–Sun) with persistent storage
- 🍱 27 fat-loss-focused, high-protein recipes (35–55g protein per portion)
- 🛒 Package-aware shopping list (e.g. "1× 500g pack" instead of "0.3kg loose")
- 💰 HelloFresh cost comparison across 6 Dutch supermarkets (AH, Jumbo, Plus, Lidl, Aldi, Ekoplaza)
- ♻️ Leftover detection + algorithmic bonus recipe suggestions (omelet, stir-fry, salad, soup, wrap, grain bowl, yogurt bowl)
- 🌍 Full English / Serbian (latinica) UI translation
- 🖨️ Print recipes and shopping lists
- 📱 iOS-style design, mobile-first

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or newer
- npm (comes with Node.js)

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

This starts a local dev server (usually at `http://localhost:5173`).

### Build for production

```bash
npm run build
```

The production-ready static site is output to the `dist/` folder.

### Preview the production build

```bash
npm run preview
```

## Deploying

The app is a static site (Vite + React), so it can be deployed to any static
host:

- **GitHub Pages** — build with `npm run build`, then publish the `dist/` folder
  (e.g. via the `gh-pages` branch or GitHub Actions).
- **Netlify / Vercel** — connect the repo, set the build command to
  `npm run build` and the publish directory to `dist`.

## Data storage

The app persists your meal plan, recipes, and preferences in the browser via
`window.storage`. When self-hosted, `src/storagePolyfill.js` provides a
`localStorage`-backed implementation of this API automatically, so no extra
setup is needed — your data stays in your browser only.

## AI-powered features (optional)

Two features call the Anthropic API directly from the browser:

- **Regenerate cooking steps** (in the recipe detail view)
- **Scan a recipe** from a photo

These work out-of-the-box inside Claude.ai's Artifacts environment, which
proxies and authenticates the requests for you. When self-hosting this app,
these calls to `https://api.anthropic.com/v1/messages` will fail (no API key
and likely a CORS block from the browser) — **all other features work
normally**, since both calls are wrapped in error handling.

To enable these features in a self-hosted deployment, you'll need to add a
small backend proxy that:

1. Receives the request from the frontend
2. Adds your Anthropic API key (`x-api-key` header)
3. Forwards it to `https://api.anthropic.com/v1/messages`
4. Returns the response

Then update the `fetch(...)` calls in `src/MealPlanner.jsx` to point at your
proxy endpoint instead.

## Tech stack

- React 18
- Vite
- Tailwind CSS
- lucide-react (icons)

## License

MIT — see [LICENSE](./LICENSE).
