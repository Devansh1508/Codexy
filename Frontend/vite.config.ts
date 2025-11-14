import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import type { ViteDevServer } from 'vite'
import type { IncomingMessage, ServerResponse } from 'http'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'add-cross-origin-headers',
      configureServer(server: ViteDevServer) {
        server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
          next()
        })
      }
    }
  ],
  // Run Vite in normal dev server mode so the `vite` CLI can start the HTTP server.
  // `middlewareMode: true` makes Vite expect an external HTTP server (causes
  // "HTTP server not available" when running `vite` directly). Leave server
  // empty here so the CLI can manage the dev server.
  server: {}
})
