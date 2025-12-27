# Versioning and Releases

This template uses Changesets for version management and npm Trusted Publishing (OIDC) for publishing without stored tokens.

## Overview

- Fixed versioning — all packages share one version number
- Automated releases via GitHub Actions
- No npm tokens needed — uses OIDC
- Automatic changelog generation

## Initial Setup

### 1. Enable GitHub Actions PR creation

Go to **Settings** → **Actions** → **General** → **Workflow permissions**

Enable **Allow GitHub Actions to create and approve pull requests**.

### 2. Configure npm scope

Update package names in `packages/*/package.json`:

```json
{
  "name": "@yourscope/package-name",
  "publishConfig": {
    "access": "public"
  }
}
```

### 3. Set up npm Trusted Publisher

For each package, configure a Trusted Publisher on npm:

1. Go to npmjs.com → Your package → **Settings** → **Trusted Publishers**
2. Add a GitHub Actions publisher:

| Field             | Value                       |
| ----------------- | --------------------------- |
| Repository owner  | Your GitHub username or org |
| Repository name   | Your repository name        |
| Workflow filename | `release.yml`               |
| Environment       | (leave empty)               |

Note: You need to create the package on npm first. Either publish an initial version manually or let the first automated publish create it.

### 4. Update changeset config

Edit `.changeset/config.json`:

```json
{
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "your-org/your-repo" }
  ],
  "fixed": [["@yourscope/*"]],
  "ignore": ["!@yourscope/*"]
}
```

## Workflow

### Creating a changeset

When making changes:

```bash
pnpm changeset
```

Follow the prompts to select packages, bump type (patch/minor/major), and write a summary. Commit the generated file with your PR.

### Examples

Patch (bug fix):

```markdown
---
"@yourscope/react": patch
---

Fixed button click handler on mobile
```

Minor (new feature):

```markdown
---
"@yourscope/shared": minor
"@yourscope/react": minor
---

Added useDebounce hook
```

Major (breaking change):

```markdown
---
"@yourscope/server": major
---

Renamed createServer to initServer
```

## Release Process

### Automated

1. Push to main with changeset files
2. GitHub Actions creates a "Version Packages" PR
3. Review the version bumps and changelogs
4. Merge the PR — packages publish to npm

### Manual

```bash
pnpm run version   # preview version changes
pnpm run release   # build and publish (prefer CI instead)
```

## How It Works

### Fixed versioning

All packages share one version. Config in `.changeset/config.json`:

```json
{
  "fixed": [["@yourscope/*"]]
}
```

### Version syncing

The `sync-versions` script runs during versioning to update `docs/package.json` and `examples/*/package.json` with concrete versions, so they work as standalone apps.

### npm Trusted Publishing

Instead of storing an NPM_TOKEN, GitHub Actions requests a short-lived token from npm via OIDC. The workflow sets `NPM_TOKEN: ""` to enable this.

## Troubleshooting

**"npm ERR! code ENEEDAUTH"**
Trusted Publisher config doesn't match. Check repository owner/name and workflow filename.

**"No changesets found"**
Run `pnpm changeset` and commit the file.

**Version PR not created**
Check GitHub Actions has permission to create PRs.

**Packages not publishing**
Ensure `publishConfig.access` is `"public"` for scoped packages.

## Resources

- [Changesets docs](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [npm Trusted Publishing](https://docs.npmjs.com/generating-provenance-statements)
- [GitHub OIDC](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/about-security-hardening-with-openid-connect)
