const fs = require("fs");
const path = require("path");

function getAliasesFromTsconfig() {
  const tsconfigPath = path.resolve(__dirname, "tsconfig.json");
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

  const { baseUrl = ".", paths = {} } = tsconfig.compilerOptions || {};

  const aliases = {};

  for (const [key, value] of Object.entries(paths)) {
    // "@components/*" -> "@components"
    const aliasKey = key.replace(/\/\*$/, "");

    // ["src/components/*"] -> "./src/components"
    const aliasPath = value[0].replace(/\/\*$/, "");

    aliases[aliasKey] = path.resolve(__dirname, baseUrl, aliasPath, "index.ts");
  }

  return aliases;
}

module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "current" } }], "@babel/preset-typescript"],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: getAliasesFromTsconfig()
      }
    ]
  ]
};
