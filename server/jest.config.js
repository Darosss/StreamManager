/** @type {import('jest').Config} */

const config = {
  testEnvironment: "node",
  transform: {
    "^.+\\.(ts|js)$": "babel-jest"
  },
  transformIgnorePatterns: ["node_modules/(?!(@twurple)/)"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
  moduleFileExtensions: ["ts", "js", "json"],
  clearMocks: true
};

module.exports = config;
