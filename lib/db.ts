import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL,
  });

  // THE FIX: Cast to 'any' to bypass the internal type-mismatch
  const adapter = new PrismaPg(pool) as any;

  return new PrismaClient({
    adapter,
  });
};

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ALWAYS use named exports for Next.js API routes
export { prisma };