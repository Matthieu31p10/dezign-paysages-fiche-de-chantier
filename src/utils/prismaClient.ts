
// Importation correcte
const { PrismaClient } = require('@prisma/client');

// Prevent multiple instances in development with hot-reload
let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // @ts-ignore: attach to global for dev only
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  // @ts-ignore
  prisma = global.prisma;
}

export default prisma;
