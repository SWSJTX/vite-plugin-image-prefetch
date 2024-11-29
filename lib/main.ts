import type { IndexHtmlTransformContext, Plugin } from "vite";
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

  return {
    name: "vite-plugin-image-prefetch",
    apply: "build",
    transformIndexHtml(_: string, ctx: IndexHtmlTransformContext) {
      const files = FastGlob.sync(dir, {
        cwd: ctx.server?.config.publicDir
      });

      const images = files.map(file => ctx.server?.config.base ?? "/" + file);

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
