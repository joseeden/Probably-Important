import { PrismaClient } from '@/lib/generated/prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Neon's serverless driver talks to Postgres over WebSockets. Node < 22 has no
// global WebSocket, so wire one up for the pool to use.
neonConfig.webSocketConstructor = ws;

const globalForDb = globalThis as unknown as {
  db: PrismaClient | undefined;
};

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });

export const db = globalForDb.db ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;
