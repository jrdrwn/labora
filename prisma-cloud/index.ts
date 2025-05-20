import { PrismaClient } from '../node_modules/.prisma/cloud';

const globalForPrisma = global as unknown as { prismaCloud: PrismaClient };

export const prismaCloud = globalForPrisma.prismaCloud || new PrismaClient();

if (process.env.NODE_ENV !== 'production')
  globalForPrisma.prismaCloud = prismaCloud;

export default prismaCloud;
