import { PrismaClient } from "../generated/prisma/client"; 
import { PrismaPg } from "@prisma/adapter-pg"; 
import pg from "pg"; // Ensure this is installed: npm install pg

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
  const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL || process.env.DIRECT_URL,
  });

  // Cast the adapter to 'any' temporarily to bypass the 'connect' property check
  // This is a known workaround when using custom output directories
  const adapter = new PrismaPg(pool) as any;

  return new PrismaClient({
    adapter,
  });
};
// Singleton pattern to prevent multiple instances in development
const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;