# Next.js Advanced Example

Next.js app showing usage of multiple packages together.

## Development

From the monorepo root:

```bash
pnpm dev:next-advanced
```

Or standalone:

```bash
pnpm install
pnpm dev
```

Open http://localhost:3000.

## Structure

```
examples/next-advanced/
├── src/app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── public/
└── package.json
```

## Standalone Usage

This example can be copied out of the monorepo. The `sync-versions` script ensures package versions are concrete (not `workspace:*`) so they resolve from npm.

```bash
cp -r examples/next-advanced ~/my-project
cd ~/my-project
pnpm install
pnpm dev
```
