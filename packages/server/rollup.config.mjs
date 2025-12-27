import process from "node:process";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import del from "rollup-plugin-delete";
import { glob } from "glob";

// Find all TypeScript files in src
const input = glob.sync("src/**/*.ts");
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
      extensions: [".ts", ".js"],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      declarationMap: false,
      outDir: "dist/esm",
    }),
  ].filter(Boolean),
  external: [/^@perfectest\//],
};
