import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'
import tailwind from '@tailwindcss/vite'
import path from 'node:path'

export default defineConfig({
  plugins: [react(), tailwind()],
  test: {
    globals: true,
    environment: 'jsdom',
    pool: 'vmThreads',
    server: {
      deps: {
        inline: [
          "react-router",
          "react-router-dom",
          "react-router/dom"
        ]
      }
    }
  },
  resolve: {
    alias: {
      '@App': path.resolve(__dirname, 'src/App'),
      '@atoms': path.resolve(__dirname, 'src/components/atoms'),
      '@molecules': path.resolve(__dirname, 'src/components/molecules'),
      '@organisms': path.resolve(__dirname, 'src/components/organisms'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@templates': path.resolve(__dirname, 'src/templates'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@lib': path.resolve(__dirname, 'src/lib'),
      '@auth': path.resolve(__dirname, 'src/auth'),
      '@dev': path.resolve(__dirname, 'src/dev'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
})