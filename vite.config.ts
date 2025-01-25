import { defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import pkg from "./package.json";
const deps = Object.keys(pkg.dependencies);

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: "./lib/index.ts",
      name: "vite-plugin-image-prefetch",
      fileName: "index"
    },
    rollupOptions: {
      external: deps,
      output: {
        globals: (() => {
          const result: any = {};
          deps.forEach((item: string) => {
            result[item] = item;
          });
          return result;
        })(),
        exports: "named"
      }
    }
  },
  plugins: [
    dtsPlugin({
      insertTypesEntry: true
    })
  ]
});
