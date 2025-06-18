import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@api': path.resolve(__dirname, 'src/api'),
      '@type': path.resolve(__dirname, 'src/type'),
      '@util': path.resolve(__dirname, 'src/util'),
    },
  },
});
