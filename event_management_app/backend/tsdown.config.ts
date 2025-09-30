import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/app.ts'],
  outDir: 'dist',
  format: ['esm'],
  dts: false,
  clean: true,
  sourcemap: false,
  minify: true,
  treeshake: true,
  target: 'es2022',
  copy: [{ from: 'src/db/migrations', to: 'dist/migrations' }],
});
