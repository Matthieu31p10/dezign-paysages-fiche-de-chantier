
import { PrismaClient } from '@prisma/client';

// Use a stub PrismaClient for browser environments
const PrismaClientStub = {
  workLog: {
    findMany: async () => [],
    findUnique: async () => null,
    create: async (data) => data.data,
    update: async (data) => data.data,
    deleteMany: async () => ({ count: 0 }),
  },
  consumable: {
    findMany: async () => [],
    create: async (data) => data.data,
    deleteMany: async () => ({ count: 0 }),
  },
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Create the appropriate client based on environment
let prisma: any;

if (!isBrowser) {
  // Server environment
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
} else {
  // Browser environment - use stub
  console.warn('Using PrismaClient stub for browser environment. Database operations will not work.');
  prisma = PrismaClientStub;
}

export default prisma;
