
import { PrismaClient as PrismaClientImport } from '@prisma/client';

// Renamed type to avoid confusion
type PrismaClient = PrismaClientImport;

// Prevent multiple instances in development with hot-reload
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClientImport();
} else {
  // @ts-ignore: attach to global for dev only
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClientImport({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;
