import { PrismaClient } from "@prisma/client";

// 1. Create a function that returns a new Prisma Client instance
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// 2. Define the global type for the Prisma instance
declare global {
  // Using 'prismaGlobal' helps avoid conflicts with other local variables named 'prisma'
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

// 3. Check if we already have a connection saved in the global space
// If not, create a new one using the singleton function above
const db = globalThis.prismaGlobal ?? prismaClientSingleton();

// 4. Export 'db' so you can use it in your API routes and Server Actions
export const prisma = db;

// 5. In development mode, save the connection to the global object
// This prevents Next.js from creating a new connection every time you save a file
if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}