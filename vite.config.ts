import { defineConfig } from 'vite'

// Vite rejects a Host header it was not told to expect, and a MagicDNS name is
// exactly that — so previewing a build from a phone on the tailnet answers 403
// until `.ts.net` is allowed. Worth keeping: checking a build on the device it
// is written for is the normal case here, not an exception.
const TAILNET = ['.ts.net']

export default defineConfig({
  server: { allowedHosts: TAILNET },
  preview: { allowedHosts: TAILNET },
  build: {
    // Workers serves whatever is here; `wrangler.jsonc` points at the same path.
    outDir: 'dist',
    emptyOutDir: true,
  },
})
