# AGENTS.md

## Cursor Cloud specific instructions

### Stack
Single Vite + React SPA (`audit-educa`). npm package manager. Node 20+ recommended.

### Commands
| Task | Command |
|------|---------|
| Install | `npm install` |
| Dev server | `npm run dev` (http://localhost:5173) |
| Generate routes/integrations | `npm run generate` |
| Validate JSON schemas | `npm run validate` |
| Site audit report | `npm run audit:site` |
| Build | `npm run build` |

### Architecture (schema-first)
- **Route registry:** `content/registry/routes.json` — single source of truth
- **Generated (do not edit):** `src/generated/routes.jsx`, `src/generated/integrations.js`
- **Schemas:** `core/schemas/*.schema.json` validated via `core/validate.js`
- **After changing registry or content JSON:** run `npm run generate`

### Notes
- Audit execution tools (`/contingencias`, `/IAGEN`, etc.) are `archived` in registry — code remains in `src/pages/` but no public route.
- GTM/GA4 snippets injected into `index.html` by `npm run generate --inject-analytics`.
- `public/tests/**` is exam JSON data — do not migrate line-by-line.
- Plain `npm run dev` does not serve `/api/analyze`; use `npx vercel dev` for IAGEN API locally.
