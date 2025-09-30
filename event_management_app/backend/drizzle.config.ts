// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';
import 'dotenv/config';

export default defineConfig({
  dialect: 'postgresql',
  schema: './src/db/schema/**/*.ts',
  out: './src/db/migrations',
  dbCredentials: { url: process.env.APP_DATABASE_URL! },
});
