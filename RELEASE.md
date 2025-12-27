# Versioning & Release (Changesets + npm Trusted Publishing)

This repo uses **Changesets** to manage versioning and releases, with **one shared version across all workspaces** (including private apps like `docs/` and `examples/*`).

Publishing to npm is done via **npm Trusted Publishing (OIDC)**, so we **do not store** an `NPM_TOKEN` secret in GitHub.

## One-time setup (maintainers)

### 1) Enable GitHub Actions to create pull requests

In the repository settings: **Settings** → **Actions** → **General** → **Workflow permissions**, enable **Allow GitHub Actions to create and approve pull requests**.

### 2) npm scope access

- These packages publish to npm under the `@perfectest` scope:
  - `@perfectest/shared`
  - `@perfectest/react`
  - `@perfectest/server`
- They are configured with `publishConfig.access = "public"` so scoped packages publish publicly.

### 3) Configure npm Trusted Publisher (OIDC)

In npm (for each package, or for the scope if available), configure a **Trusted Publisher** pointing at this repo/workflow:

- **Provider**: GitHub Actions
- **Repository**: this repo (owner + name)
- **Workflow file**: `.github/workflows/release.yml`
- **Environment**: optional (if you set one in npm, you must also set the same `environment:` in the workflow job)

Notes:

- This repo uses `changesets/action` to drive publishing. Until it has first-class Trusted Publishing support, we follow the established workaround: set `NPM_TOKEN` to an empty string in the workflow so publishing uses OIDC instead of a stored token. See:
  - https://github.com/changesets/changesets/issues/1152#issuecomment-3190884868

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

Prefer letting CI publish so releases are repeatable and use GitHub OIDC (no long-lived npm tokens).
