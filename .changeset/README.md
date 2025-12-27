# Changesets

Managed by [Changesets](https://github.com/changesets/changesets).

## Contents

- `config.json` — configuration
- `*.md` files — pending changesets

## Usage

When making releasable changes:

```bash
pnpm changeset
```

Commit the generated file with your PR.

## Release Flow

1. Merge PRs with changeset files to main
2. GitHub Actions creates a "Version Packages" PR
3. Merge that PR to publish to npm

## More Info

- [Intro to Changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [Adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)
