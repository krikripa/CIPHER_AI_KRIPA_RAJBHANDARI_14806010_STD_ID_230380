// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,       // allows `test` and `expect` without importing
    environment: 'jsdom', // simulates a browser environment
  },
});
