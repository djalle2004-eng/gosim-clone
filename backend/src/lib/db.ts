import { PrismaClient } from '@prisma/client';

// ─────────────────────────────────────────────────────────────
// Prisma Client Singleton
//
// Prevents multiple PrismaClient instances in development
// by caching one on `globalThis`. In production a fresh
// instance is always created.
// ─────────────────────────────────────────────────────────────

const createPrismaClient = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'warn', 'error']
        : ['warn', 'error'],
  });
};

type PrismaClientSingleton = ReturnType<typeof createPrismaClient>;

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: PrismaClientSingleton | undefined;
}

const prisma: PrismaClientSingleton =
  globalThis.prismaGlobal ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}

export default prisma;

// ─────────────────────────────────────────────────────────────
// Connection helpers
// ─────────────────────────────────────────────────────────────

/** Test DB connectivity — useful in health-check routes. */
export async function testConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

/** Graceful shutdown — call this in process exit handlers. */
export async function disconnectDB(): Promise<void> {
  await prisma.$disconnect();
}
