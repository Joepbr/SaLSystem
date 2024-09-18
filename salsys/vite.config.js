import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  /*
  build: {
    manifest: true,
    rollupOptions: {
      input: './src/main.jsx',
    },
  },
  
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    fs: {
      strict: false
    },
    historyApiFallback: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
  */
})