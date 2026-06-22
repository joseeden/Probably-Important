import { defineConfig, env } from 'prisma/config';

// Prisma 7 no longer auto-loads .env for the CLI; load it ourselves.
process.loadEnvFile();

// Prisma 7 moves the connection URL out of schema.prisma. The datasource here is
// used by CLI commands (migrate, studio); the runtime client uses the Neon
// driver adapter in lib/db.ts.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: env('DATABASE_URL'),
  },
});
