/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('jest').Config} */
const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./tsconfig.json");
module.exports = {
  projects: [
    {
      displayName: "unit",
      preset: "ts-jest/presets/default-esm",

      testEnvironment: "node",
      transform: {
        "^.+\\.(ts|js)$": ["ts-jest", { useESM: true, tsconfig: "tsconfig.json" }]
      },

      clearMocks: true,
      moduleFileExtensions: ["ts", "js", "json"],
      testPathIgnorePatterns: ["/node_modules/", "/dist/"],
      testMatch: ["**/unit/*.test.ts", "**/*.unit.test.ts"],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/"
      }),
      setupFilesAfterEnv: ["<rootDir>/tests/mock.setup.js"]
    },
    {
      displayName: "integration",
      preset: "ts-jest/presets/default-esm",

      testEnvironment: "node",
      transform: {
        "^.+\\.(ts|js)$": ["ts-jest", { useESM: true, tsconfig: "tsconfig.json" }]
      },

      clearMocks: true,
      moduleFileExtensions: ["ts", "js", "json"],
      testPathIgnorePatterns: ["/node_modules/", "/dist/"],
      testMatch: ["**/integration/*.test.ts", "**/*.integration.test.ts"],
      moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
        prefix: "<rootDir>/"
      }),
      setupFilesAfterEnv: ["<rootDir>/tests/mock.setup.js"]
    }
  ]
};
