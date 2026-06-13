# PROJECT_KNOWLEDGE — recepti

**This project is governed by [Design Forge](https://github.com/bojankocijan/design-forge) — see [`CLAUDE.md`](./CLAUDE.md) for rules.**

---

## 1. Project purpose
Personal weekly meal planner with cost comparison (home cooking vs HelloFresh), AI-powered recipe scanning and step generation, and a shopping list builder — targeted at Dutch households.

## 2. Target users
Single person or couple cooking at home in the Netherlands. Bilingual: English and Serbian.

## 3. Project-specific components
<!-- Components not in the chosen UI library -->
| Component | Path | Purpose |
|---|---|---|
| MealPlannerApp | src/MealPlanner.jsx | Root app — entire app in one file (refactor tracked in #3) |

## 4. Local wrappers / interim overrides
| Wrapper | Path | Why | Ticket |
|---|---|---|---|
| storagePolyfill | src/storagePolyfill.js | Shims Claude Artifacts `window.storage` API with localStorage for standalone deploy | — |

## 5. Architectural decisions
| Date | Decision | Why |
|---|---|---|
| 2026-06-13 | Platform: Web React (Vite + React 18 + Tailwind) | Imported from Claude Artifacts export — existing stack |
| 2026-06-13 | UI library: Tailwind CSS (no component library) | App imported as-is; no dedicated UI library chosen |
| 2026-06-13 | Data layer: localStorage via storagePolyfill | No backend; all data persisted in browser localStorage |
| 2026-06-13 | AI: Anthropic claude-sonnet-4-20250514 direct browser calls | Powers recipe scanning, step generation, cook mode |

## 6. Open questions / known issues
- [ ] #2 — Migrate to TypeScript (.jsx → .tsx)
- [ ] #3 — Split monolith into 4-file component folders
- [ ] #4 — Remove inline styles
- [ ] #5 — Add CI pipeline
- [ ] API key is embedded in the JS bundle at build time (acceptable for personal use; do not publish key publicly)

## 7. Upstream PRs opened from this project
| Date | Repo | PR | Status |
|---|---|---|---|

## 8. Data layer
- Default: localStorage (via storagePolyfill shim)
- DB: none

## 9. GitHub Issues repo
BojanKocijan/recepti

## 10. Deployment
GitHub Pages — https://bojankocijan.github.io/recepti/
Auto-deploys from main via `.github/workflows/deploy.yml`
`VITE_ANTHROPIC_API_KEY` must be set as a GitHub Actions secret.

## 11. Active feature
| ID | Title | Status | Branch | JTBD |
|---|---|---|---|---|

### Paused features
| ID | Title | Status | Branch | JTBD |
|---|---|---|---|---|

## 12. Feature audit log
| ID | Title | Handed off | Notes |
|---|---|---|---|
