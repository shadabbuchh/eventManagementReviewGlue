import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  test: {
    /* Where to look for tests */
    include: [
      // 'tests/unit/**/*.test.ts',
      // 'tests/integration/**/*.int.test.ts',
      // 'tests/e2e/**/*.e2e.test.ts',
      'tests/unit/**/*.ts',
      'tests/integration/**/*.ts',
      'tests/e2e/**/*.ts',
      // '!tests/_templates/**'
    ],
    exclude: ['**/*.template.ts', '**/__templates__/**'],

    globals: true,
    environment: 'node',
    /* One‑time bootstrap file */
    setupFiles: 'tests/vitest.setup.ts',

    /* Coverage (optional) */
    coverage: {
      provider: 'istanbul', // uses @vitest/coverage-istanbul
      reporter: ['text', 'html'],
      all: true,
      exclude: ['tests/**', 'dist/**'],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
