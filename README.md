# Monorepo Package Template

A starter template for publishing multiple npm packages from a single repository, with a docs site and example apps.

## Features

**Monorepo**

- [Turborepo](https://turborepo.com/) for build orchestration and caching
- [pnpm](https://pnpm.io/) workspaces with [catalog](https://pnpm.io/catalogs) for centralized dependency versions

**Publishing**

- [Changesets](https://github.com/changesets/changesets) for versioning and changelogs
- [npm Trusted Publishing](https://docs.npmjs.com/generating-provenance-statements) (OIDC) — no stored tokens
- Fixed versioning — all packages share the same version
- Version syncing script keeps docs/examples aligned

**Build**

- [Rollup](https://rollupjs.org/) with ESM output, tree-shaking, and sourcemaps
- [TypeScript](https://www.typescriptlang.org/) with declaration files
- Preserves `"use client"` directives for React Server Components

**Code Quality**

- [ESLint](https://eslint.org/) (flat config)
- [Prettier](https://prettier.io/)

**Apps**

- Documentation site (Next.js)
- Example apps (Next.js basic and advanced)

## Structure

```
├── packages/
│   ├── shared/          # @yourscope/shared — isomorphic utilities and types
│   ├── react/           # @yourscope/react — React components and hooks
│   └── server/          # @yourscope/server — Node.js server utilities
├── docs/                # documentation site (Next.js)
├── examples/
│   ├── next-basic/      # basic Next.js example
│   └── next-advanced/   # advanced Next.js example
├── scripts/
│   └── sync-versions.mjs
└── .github/workflows/
    └── release.yml
```

## Getting Started

Requirements: Node.js 24+, pnpm 10+

```bash
git clone https://github.com/perfectbase/monorepo-package-template my-packages
cd my-packages
pnpm install
```

## Commands

```bash
pnpm build              # build all packages
pnpm dev                # dev mode (example app + package watch)
pnpm dev:next-basic     # run basic example
pnpm dev:next-advanced  # run advanced example
pnpm dev:docs           # run docs site
pnpm lint               # lint all packages
pnpm check-types        # type-check all packages
pnpm format             # format code
pnpm clean              # remove build artifacts
```

## Customization

### 1. Update package scope

Replace `@perfectest` with your npm scope in:

- `packages/*/package.json` — `name` field
- `package.json` — `pnpm.overrides`
- `.changeset/config.json` — `fixed` and `ignore` patterns

### 2. Update repository URLs

- All `package.json` files — `repository` field
- `.changeset/config.json` — `repo` field

### 3. Set up npm publishing

See [RELEASE.md](./RELEASE.md) for GitHub Actions and npm Trusted Publisher setup.

### 4. Modify packages

The template includes three packages as examples:

| Package  | Purpose    | Contents          |
| -------- | ---------- | ----------------- |
| `shared` | Isomorphic | Types, utilities  |
| `react`  | React      | Components, hooks |
| `server` | Node.js    | Server utilities  |

Add, remove, or rename as needed.

## Package Configuration

Each package uses:

```json
{
  "type": "module",
  "sideEffects": false,
  "exports": {
    ".": {
      "types": "./dist/types/index.d.ts",
      "import": "./dist/esm/index.js"
    },
    "./*": {
      "types": "./dist/types/*.d.ts",
      "import": "./dist/esm/*.js"
    }
  }
}
```

This gives you ESM-only output, subpath exports (`@scope/pkg/button`), tree-shaking, and TypeScript support.

## Releases

1. Run `pnpm changeset` and commit the generated file
2. Merge to main — GitHub Actions creates a "Version Packages" PR
3. Merge that PR — packages publish to npm

See [RELEASE.md](./RELEASE.md) for details.

## Stack

| Tool       | Version | Purpose             |
| ---------- | ------- | ------------------- |
| Turborepo  | 2.7.x   | Build orchestration |
| pnpm       | 10.x    | Package management  |
| TypeScript | 5.9.x   | Type system         |
| Rollup     | 4.x     | Bundling            |
| Next.js    | 16.x    | Docs and examples   |
| React      | 19.x    | UI                  |
| ESLint     | 9.x     | Linting             |
| Prettier   | 3.x     | Formatting          |
| Changesets | 2.x     | Version management  |

## Links

- [Turborepo docs](https://turborepo.com/docs)
- [pnpm workspaces](https://pnpm.io/workspaces)
- [pnpm catalogs](https://pnpm.io/catalogs)
- [Changesets docs](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [npm Trusted Publishing](https://docs.npmjs.com/generating-provenance-statements)

## License

MIT
