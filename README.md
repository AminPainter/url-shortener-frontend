# CutItShort — frontend

React 19 + TanStack Router (file-based) + TanStack Query + Tailwind v4 + shadcn/ui.

## Run

```bash
cp .env.example .env
pnpm install
pnpm dev            # needs the backend stack: Kong on :9113 (see ../glomo-url-shortner-backend)
```

`/api/*` is proxied to Kong by Vite (the backend has no CORS). Short links render as
`$VITE_SHORT_LINK_ORIGIN/<code>`.

## Layout

- `src/routes` – thin route files (guards, search params) → `route-tree.gen.ts` is generated
- `src/features/<feature>/{api,components,hooks,lib}` – auth, links, landing, command-menu
- `src/components/ui` – shadcn primitives; `src/components/layout` – app shell
- All filenames are kebab-case.

Link history is kept in localStorage per user until the backend exposes a list endpoint.
