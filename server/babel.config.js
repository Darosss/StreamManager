import { readFileSync } from "fs";
import { resolve } from "path";

function getAliasesFromTsconfig() {
  const tsconfigPath = resolve(__dirname, "tsconfig.json");
  const tsconfig = JSON.parse(readFileSync(tsconfigPath, "utf8"));

  const { baseUrl = ".", paths = {} } = tsconfig.compilerOptions || {};

  const aliases = {};

  for (const [key, value] of Object.entries(paths)) {
    // "@components/*" -> "@components"
    const aliasKey = key.replace(/\/\*$/, "");

    // ["src/components/*"] -> "./src/components"
    const aliasPath = value[0].replace(/\/\*$/, "");

    aliases[aliasKey] = resolve(__dirname, baseUrl, aliasPath, "index.ts");
  }

  return aliases;
}

export const presets = [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-typescript"];
export const plugins = [
  ["babel-plugin-transform-import-meta", { module: "ES6" }],
  [
    "module-resolver",
    {
      root: ["./src"],
      alias: getAliasesFromTsconfig()
    }
  ],
  "@babel/plugin-transform-modules-commonjs"
];
