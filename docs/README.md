# Documentation Site

Documentation site for your packages, built with Next.js.

## Development

From the monorepo root:

```bash
pnpm dev:docs
```

Or standalone:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Structure

```
docs/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
└── package.json
```

## Deployment

For Vercel: import the repo and set root directory to `docs`.

For other platforms:

```bash
pnpm build
```

## Version Syncing

Package dependencies are synced with monorepo versions during releases via `sync-versions`. This keeps the docs using the latest versions.
