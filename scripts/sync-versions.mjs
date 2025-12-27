import { readFile, writeFile, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

const CHECK_MODE = process.argv.includes("--check");

function parseSimpleCatalogFromWorkspaceYaml(yamlText) {
  const lines = yamlText.split(/\r?\n/);
  const catalog = {};

  let inCatalog = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (!inCatalog) {
      if (line.trim() === "catalog:") {
        inCatalog = true;
      }
      continue;
    }

    if (line.trim() === "") continue;
    if (/^\S/.test(line)) break; // next top-level key
    if (!line.startsWith("  ")) continue;

    const withoutIndent = line.slice(2);
    const idx = withoutIndent.indexOf(":");
    if (idx <= 0) continue;

    let rawKey = withoutIndent.slice(0, idx).trim();
    const rawValue = withoutIndent.slice(idx + 1).trim();

    if (
      (rawKey.startsWith('"') && rawKey.endsWith('"')) ||
      (rawKey.startsWith("'") && rawKey.endsWith("'"))
    ) {
      rawKey = rawKey.slice(1, -1);
    }

    if (rawKey && rawValue) {
      catalog[rawKey] = rawValue;
    }
  }

  return catalog;
}

async function readJson(filePath) {
  const text = await readFile(filePath, "utf8");
  return JSON.parse(text);
}

async function writeJsonIfChanged(filePath, nextObj) {
  const nextText = `${JSON.stringify(nextObj, null, 2)}\n`;
  const prevText = await readFile(filePath, "utf8");
  if (prevText === nextText) return false;
  if (CHECK_MODE) return true;
  await writeFile(filePath, nextText, "utf8");
  return true;
}

async function getLocalWorkspacePackageVersions() {
  const packagesDir = path.join(repoRoot, "packages");
  const entries = await readdir(packagesDir, { withFileTypes: true });

  const versionsByName = {};
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    const pkgJsonPath = path.join(packagesDir, ent.name, "package.json");
    try {
      const pkg = await readJson(pkgJsonPath);
      if (pkg?.name && pkg?.version) {
        versionsByName[pkg.name] = pkg.version;
      }
    } catch {
      // ignore folders without a package.json
    }
  }
  return versionsByName;
}

async function getStandaloneTargetManifests() {
  const targets = [path.join(repoRoot, "docs", "package.json")];

  const examplesDir = path.join(repoRoot, "examples");
  const entries = await readdir(examplesDir, { withFileTypes: true });
  for (const ent of entries) {
    if (!ent.isDirectory()) continue;
    targets.push(path.join(examplesDir, ent.name, "package.json"));
  }

  return targets;
}

function updateDepsObject({ deps, catalog, localVersions }) {
  if (!deps) return { changed: false, next: deps };

  let changed = false;
  const next = { ...deps };

  for (const [name, spec] of Object.entries(next)) {
    const local = localVersions[name];
    if (local) {
      if (spec !== local) {
        next[name] = local;
        changed = true;
      }
      continue;
    }

    const resolvedFromCatalog = catalog[name];
    if (resolvedFromCatalog) {
      if (spec !== resolvedFromCatalog) {
        next[name] = resolvedFromCatalog;
        changed = true;
      }
      continue;
    }

    if (spec === "catalog:") {
      throw new Error(
        `Missing catalog version for ${name}. Add it under "catalog:" in pnpm-workspace.yaml`
      );
    }

    if (typeof spec === "string" && spec.startsWith("workspace:")) {
      throw new Error(
        `Missing local workspace version for ${name}. Is it under packages/*/package.json?`
      );
    }
  }

  return { changed, next };
}

async function main() {
  const workspaceYamlPath = path.join(repoRoot, "pnpm-workspace.yaml");
  const workspaceYaml = await readFile(workspaceYamlPath, "utf8");
  const catalog = parseSimpleCatalogFromWorkspaceYaml(workspaceYaml);
  const localVersions = await getLocalWorkspacePackageVersions();
  const targets = await getStandaloneTargetManifests();

  let anyChanges = false;
  const changedFiles = [];

  for (const manifestPath of targets) {
    let pkg;
    try {
      pkg = await readJson(manifestPath);
    } catch {
      // ignore missing manifests
      continue;
    }

    const d1 = updateDepsObject({
      deps: pkg.dependencies,
      catalog,
      localVersions,
    });
    const d2 = updateDepsObject({
      deps: pkg.devDependencies,
      catalog,
      localVersions,
    });
    const d3 = updateDepsObject({
      deps: pkg.peerDependencies,
      catalog,
      localVersions,
    });
    const d4 = updateDepsObject({
      deps: pkg.optionalDependencies,
      catalog,
      localVersions,
    });

    const nextPkg = {
      ...pkg,
      dependencies: d1.next,
      devDependencies: d2.next,
      peerDependencies: d3.next,
      optionalDependencies: d4.next,
    };

    const changed = d1.changed || d2.changed || d3.changed || d4.changed;
    if (!changed) continue;

    const didWriteOrWouldWrite = await writeJsonIfChanged(
      manifestPath,
      nextPkg
    );
    if (didWriteOrWouldWrite) {
      anyChanges = true;
      changedFiles.push(path.relative(repoRoot, manifestPath));
    }
  }

  if (CHECK_MODE) {
    if (anyChanges) {
      console.error(
        `Standalone manifests are out of date:\n${changedFiles
          .map((p) => `- ${p}`)
          .join("\n")}\n\nRun: pnpm -s sync-versions`
      );
      process.exit(1);
    }
    return;
  }
}

main().catch((err) => {
  console.error(err?.stack || String(err));
  process.exit(1);
});
