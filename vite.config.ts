import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

export default defineConfig({
  // Vercel автоматически определяет базовый путь
  // Убираем base для Vercel
  // base: '/videohost/',  ← Закомментируй для Vercel
  
  plugins: [ vue(), vueDevTools() ],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173 },
})
