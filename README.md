# vite-plugin-image-prefetch

A simple plugin of vite for prefetch images.

## Install
```shell
pnpm add vite-plugin-image-prefetch -D
```

## Usage

In `vite.config.ts`:

```typescript
import { vitePluginPrefetchImages } from 'vite-plugin-image-prefetch'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    vitePluginPrefetchImages({
      dir: 'images/**/*.{jpg,jpeg,png,svg}'
    })
  ]
})
```
