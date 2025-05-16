
// We need to update the import statement to correctly import PrismaClient
import { PrismaClient as PrismaClientType } from '@prisma/client';

// Prevent multiple instances in development with hot-reload
let prisma: PrismaClientType;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClientType();
} else {
  // @ts-ignore: attach to global for dev only
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClientType({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;
