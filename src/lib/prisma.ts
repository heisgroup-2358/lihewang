import { PrismaClient } from "@/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrisma> };

function createPrisma() {
  if (process.env.DATABASE_URL?.startsWith("postgresql")) {
    const pg = require("pg");
    const { PrismaPg } = require("@prisma/adapter-pg");
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    return new PrismaClient({ adapter: new PrismaPg(pool) }) as any;
  }
  return new PrismaClient({} as any) as any;
}

export const prisma = globalForPrisma.prisma ?? createPrisma() as any;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
