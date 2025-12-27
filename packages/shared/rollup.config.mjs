import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { glob } from "glob";

// Find all TypeScript files in src
const input = glob.sync("src/**/*.ts");

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
    resolve({
      extensions: [".ts", ".js"],
    }),
    typescript({
      tsconfig: "./tsconfig.json",
      declaration: false,
      declarationMap: false,
      outDir: "dist/esm",
    }),
  ],
  external: [],
};
