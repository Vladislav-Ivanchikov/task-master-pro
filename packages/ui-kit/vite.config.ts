// packages/ui-kit/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjected from 'vite-plugin-css-injected-by-js'; // Плагин для инжекции стилей

export default defineConfig({
  plugins: [react(), cssInjected()],
  build: {
    lib: {
      entry: './src/index.ts', // основной файл для экспорта
      name: 'UiKit',
      fileName: 'index',
      formats: ['es', 'umd'], // Экспортируем в два формата: es и umd
    },
    rollupOptions: {
      external: ['react', 'react-dom'], // Убираем React и ReactDOM как внешние зависимости
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
});
