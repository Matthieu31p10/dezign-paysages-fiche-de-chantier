
import { PrismaClient } from '@prisma/client';

// Évite plusieurs instances en mode développement avec hot-reload
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore: attach to global for dev only
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;
