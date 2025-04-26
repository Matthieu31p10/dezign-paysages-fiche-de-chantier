
import { PrismaClient } from '@prisma/client';

// Configuration avec Prisma Accelerate
const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'info', 'warn', 'error'] 
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL || "prisma+postgres://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZTI5ZGJiY2YtMWJiNi00Nzg1LTg5NjMtOTdjZmRmMzFkNmIwIiwidGVuYW50X2lkIjoiMTYxYTk5ZThiYjQ1Mjk4ZjNlODBhM2Y1OTExOGQ4MWU1YTIyOGI4MGQ0ODk3ODlkYWE1NjEyYWRlYjM4NTFlMiIsImludGVybmFsX3NlY3JldCI6IjFkNjI2NzI0LTRiMzQtNDVmNS05NDIxLTJhODYzYWM3NjM1NCJ9.9V3vyshlBITo388eJBLx6exv0TwCbI4RbVjlUbzBhMI"
      }
    }
  });
};

// Type pour le global en TypeScript
declare global {
  var prisma: undefined | ReturnType<typeof prismaClientSingleton>;
}

// Utiliser une instance PrismaClient globale pour éviter trop de connexions en développement
const prisma = global.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
