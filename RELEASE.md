# Versioning & Release (Changesets)

This repo uses **Changesets** to manage versioning and releases, with **one shared version across all workspaces** (including private apps like `docs/` and `examples/*`).

## One-time setup (maintainers)

### 1) npm scope access

- These packages publish to npm under the `@perfectest` scope:
  - `@perfectest/shared`
  - `@perfectest/react`
  - `@perfectest/server`
- They are configured with `publishConfig.access = "public"` so scoped packages publish publicly.

### 2) GitHub Actions secret

Add this repo secret:

- `NPM_TOKEN`: an npm automation token with permission to publish `@perfectest/*`.

## Day-to-day workflow

### Create a changeset (required for any release)

From the repo root:

```bash
pnpm changeset
```

Follow the prompts:

- Select the packages impacted
- Choose **patch / minor / major**
- Write a short description (this becomes the changelog entry)

Commit the generated `.changeset/*.md` file(s) with your feature/fix PR.

### How versioning works here (fixed versioning)

This repo is configured so that **all workspaces share one version**. When a release happens:

- every workspace version is bumped together
- only non-private packages are published to npm (`packages/*`)
- private apps (`docs`, `web`, `next-basic`) are versioned but never published

### Automated releases (CI)

On every push to `main`, GitHub Actions runs the release workflow:

1. If there are unpublished changesets on `main`:
   - It opens/updates a **Version Packages** PR that runs `pnpm changeset version`.
   - That PR updates versions and changelogs.

2. When the Version Packages PR is merged:
   - CI runs `pnpm run release` (`pnpm build && changeset publish`).
   - The updated packages in `packages/*` are published to npm.

## Local commands (rarely needed)

### Preview the version bump locally

```bash
pnpm changeset version
```

This updates `package.json` versions and changelogs based on pending changesets.

### Publish locally (not recommended)

```bash
pnpm run release
```

Prefer letting CI publish so releases are repeatable and use the shared npm token.
