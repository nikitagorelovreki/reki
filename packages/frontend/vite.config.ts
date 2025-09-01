import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Исправление проблемы с хуками React
      jsxRuntime: 'classic',
      // Убедимся, что используется одна версия React
      include: '**/*.{jsx,tsx}',
    }),
  ],
  server: {
    port: 3000,
    strictPort: true, // Не искать другой порт, если 3000 занят
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  // Исправление проблемы с дублированием React
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  // Отключаем оптимизацию зависимостей, чтобы избежать проблем с хуками
  optimizeDeps: {
    include: ['react', 'react-dom', 'antd'],
    force: true,
  },
})
