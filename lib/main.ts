import type { Plugin, ResolvedConfig } from "vite";
import FastGlob from "fast-glob";

interface IPrefetchImagesOptions {
  /**
   * directory
   */
  dir: string;
  /**
   * attrs
   */
  attrs?: {
    rel?: "prefetch" | "preload";
  };
}

export const vitePluginPrefetchImages = (options: IPrefetchImagesOptions): Plugin => {
  const { dir, attrs = {} } = options;

  if (!dir) {
    throw new Error("Directory not found.");
  }

  let base = "";
  let publicDir = "";

  const PUBLIC_DIR = "public";
  const BASE = "/";

  return {
    name: "vite-plugin-image-prefetch",
    configResolved(resolvedConfig: ResolvedConfig) {
      base = resolvedConfig.base;
      publicDir = resolvedConfig.publicDir;
    },
    transformIndexHtml() {
      const files = FastGlob.sync(dir, {
        cwd: publicDir ?? PUBLIC_DIR
      });

      const images = files.map(file => (base ?? BASE) + file);

      return images.map(href => {
        return {
          tag: "link",
          attrs: {
            rel: "prefetch",
            href: href,
            as: "image",
            ...attrs
          }
        };
      });
    }
  };
};
