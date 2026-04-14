import { PrismaClient } from "../generated/prisma";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const db = globalThis.prismaGlobal ?? prismaClientSingleton();

export const prisma = db;
export default db; // This fixes the Turbopack "Export default" error

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = db;
}