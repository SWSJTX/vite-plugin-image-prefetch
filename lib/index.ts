import type { Plugin, ResolvedConfig } from "vite";
import FastGlob from "fast-glob";

/**
 * file mode enum
 */
export enum EMenuMode {
  /**
   * public menu
   */
  PUBLIC = 0,
  /**
   * src menu
   */
  SRC = 1
}

/**
 * add attrs rel enum
 */
export enum EAttrRel {
  /**
   * prefetch
   */
  PREFETCH = "prefetch",
  /**
   * preload
   */
  PRELOAD = "preload"
}

interface IPrefetchImagesOptions {
  /**
   * directory
   */
  dir: string;
  /**
   * file mode
   */
  menuMode: EMenuMode;
  /**
   * attrs
   */
  attrs?: {
    rel?: EAttrRel;
  };
}

export const vitePluginPrefetchImages = (options: IPrefetchImagesOptions): Plugin => {
  const { dir, menuMode = EMenuMode.PUBLIC, attrs = {} } = options;

  if (!dir) {
    throw new Error("Directory not found.");
  }

  let base = "";
  let publicDir = "";

  const PUBLIC_DIR = "public";
  const BASE = "/";

  const assetsImages: string[] = [];

  return {
    name: "vite-plugin-image-prefetch",
    configResolved(resolvedConfig: ResolvedConfig) {
      base = resolvedConfig.base;
      publicDir = resolvedConfig.publicDir;
    },
    generateBundle(_, bundle) {
      const bundleValues = Object.values(bundle);
      const files = FastGlob.sync(dir);

      bundleValues.forEach(bundle => {
        if (files.includes(Reflect.get(bundle, "originalFileName"))) {
          assetsImages.push(bundle.fileName);
        }
      });
    },
    transformIndexHtml() {
      let images: string[] = [];

      // if menuMode is public
      if (menuMode === EMenuMode.PUBLIC) {
        const files = FastGlob.sync(dir, {
          cwd: publicDir ?? PUBLIC_DIR
        });
        images = files.map(file => (base ?? BASE) + file);
        //     if menuMode is src
      } else if (menuMode === EMenuMode.SRC) {
        images = assetsImages.map(image => (base ?? BASE) + image);
        //     else
      } else {
        throw new Error("Please input correct file mode.");
      }

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
