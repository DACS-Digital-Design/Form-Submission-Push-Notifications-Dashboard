import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const connectionString = `${process.env.DATABASE_URL}`

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)

const prisma = globalThis.prismaGlobal ?? new PrismaClient({ 
  adapter,
  // log: ['query', 'info', 'warn', 'error'] 
 })

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma