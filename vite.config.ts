import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    // Workers serves whatever is here; `wrangler.jsonc` points at the same path.
    outDir: 'dist',
    emptyOutDir: true,
  },
})
