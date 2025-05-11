
import { PrismaClient } from '@prisma/client';

// Create a browser-compatible mock client
const createMockPrismaClient = () => {
  return {
    workLog: {
      findMany: async () => {
        console.log('Mock: Loading work logs');
        // Return mock data or empty array
        return [];
      },
      findUnique: async () => {
        console.log('Mock: Finding unique work log');
        return null;
      },
      create: async (data) => {
        console.log('Mock: Creating work log', data);
        return data.data;
      },
      update: async (data) => {
        console.log('Mock: Updating work log', data);
        return data.data;
      },
      deleteMany: async () => {
        console.log('Mock: Deleting work logs');
        return { count: 0 };
      }
    },
    consumable: {
      findMany: async () => {
        console.log('Mock: Loading consumables');
        return [];
      },
      create: async (data) => {
        console.log('Mock: Creating consumable', data);
        return data.data;
      },
      deleteMany: async () => {
        console.log('Mock: Deleting consumables');
        return { count: 0 };
      }
    }
  };
};

// Determine if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Use real PrismaClient in Node.js environment, mock in browser
let prisma: any;

if (!isBrowser) {
  // Server-side (Node.js) - use actual PrismaClient
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    // Prevent multiple instances in development with hot-reload
    // @ts-ignore
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
  // Browser - use mock client
  console.log('Using mock Prisma client for browser environment');
  prisma = createMockPrismaClient();
}

export default prisma;
