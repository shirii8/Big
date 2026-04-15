import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  datasource: {
    url: env('DATABASE_URL'),
  },
  migrations: {
    // Switch from ts-node to tsx
    seed: 'npx tsx ./prisma/seed.ts',
  },
});