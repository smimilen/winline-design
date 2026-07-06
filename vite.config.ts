import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// base: './' — относительные пути, сборка работает на GitHub Pages
// при любом имени репозитория без дополнительной настройки
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
})
