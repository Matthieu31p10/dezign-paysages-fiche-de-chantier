
import { PrismaClient } from '@prisma/client';

// Create a more robust browser-compatible mock client
const createMockPrismaClient = () => {
  console.log('Creating mock Prisma client for browser environment');
  
  return {
    workLog: {
      findMany: async () => {
        console.log('Mock: Loading work logs');
        // Try to return data from localStorage if available
        try {
          const storedData = localStorage.getItem('workLogs');
          if (storedData) {
            return JSON.parse(storedData);
          }
        } catch (e) {
          console.error('Error accessing localStorage:', e);
        }
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
        try {
          const storedData = localStorage.getItem('savedConsumables');
          if (storedData) {
            return JSON.parse(storedData);
          }
        } catch (e) {
          console.error('Error accessing localStorage:', e);
        }
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

// Safe check for browser environment
const isBrowser = typeof window !== 'undefined' && !('process' in window);

// Initialize prisma with appropriate client
let prisma;

if (isBrowser) {
  // We're in a browser
  console.log('Browser environment detected, using mock Prisma client');
  prisma = createMockPrismaClient();
} else {
  // We're in a Node.js environment
  try {
    if (process.env.NODE_ENV === 'production') {
      prisma = new PrismaClient();
    } else {
      // Prevent multiple instances during development
      if (!global.prisma) {
        global.prisma = new PrismaClient({
          log: ['query', 'info', 'warn', 'error'],
        });
      }
      prisma = global.prisma;
    }
  } catch (e) {
    console.error('Error initializing Prisma client:', e);
    // Fallback to mock client if Prisma initialization fails
    prisma = createMockPrismaClient();
  }
}

export default prisma;
