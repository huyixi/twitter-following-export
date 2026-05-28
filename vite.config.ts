import { resolve } from "node:path";
import { build as buildWithEsbuild } from "esbuild";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    {
      name: "extension-script-bundles",
      async closeBundle() {
        await Promise.all([
          buildWithEsbuild({
            entryPoints: [resolve(__dirname, "src/content/index.ts")],
            outfile: resolve(__dirname, "dist/assets/content.js"),
            bundle: true,
            format: "iife",
            target: "es2022",
            minify: true
          }),
          buildWithEsbuild({
            entryPoints: [resolve(__dirname, "src/background/index.ts")],
            outfile: resolve(__dirname, "dist/assets/background.js"),
            bundle: true,
            format: "esm",
            target: "es2022",
            minify: true
          })
        ]);
      }
    }
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html")
      },
      output: {
        entryFileNames: "assets/[name].js",
        chunkFileNames: "assets/[name].js",
        assetFileNames: "assets/[name][extname]"
      }
    }
  },
  test: {
    environment: "jsdom",
    globals: true
  }
});
