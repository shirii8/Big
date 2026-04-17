import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Use the direct (non-pooled) URL for CLI commands (migrate, db push)
    // PgBouncer on port 6543 doesn't support DDL needed for migrations
    url: env('DIRECT_URL'),
  },
  migrations: {
    // Switch from ts-node to tsx
    seed: 'npx tsx ./prisma/seed.ts',
  },
});