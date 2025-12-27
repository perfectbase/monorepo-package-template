import process from "node:process";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import preserveDirectives from "rollup-plugin-preserve-directives";
import del from "rollup-plugin-delete";
import { glob } from "glob";

// Find all TypeScript files in src
const input = glob.sync("src/**/*.{ts,tsx}");
const isWatch = !!process.env.ROLLUP_WATCH;

/** @type {import("rollup").RollupOptions} */
export default {
  input,
  output: {
    dir: "dist/esm",
    format: "esm",
    sourcemap: true,
    preserveModules: true,
    preserveModulesRoot: "src",
    entryFileNames: "[name].js",
  },
  plugins: [
    !isWatch &&
      del({
        targets: ["dist/*"],
        runOnce: true,
        hook: "buildStart",
      }),
    resolve({
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      declarationMap: false,
      outDir: "dist/esm",
    }),
    preserveDirectives(),
  ].filter(Boolean),
  external: [/^@perfectest\//, /^react/, /^react-dom/],
  onwarn(warning, warn) {
    // Suppress "use client" directive warnings
    if (warning.code === "MODULE_LEVEL_DIRECTIVE") return;
    warn(warning);
  },
};
