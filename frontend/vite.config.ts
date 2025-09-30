import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgrPlugin from "vite-plugin-svgr";
import eslint from "vite-plugin-eslint";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: { additionalData: `@use "src/_variables.scss" as *;` },
    },
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgrPlugin(),
    eslint(),
    visualizer({ filename: "dist/stats.html", template: "treemap" }),
  ],
  envDir: "../",
});
