import prisma from '@db';
import { Hono } from 'hono';

export const ruangan = new Hono().basePath('/ruangan');

ruangan.get('/', async (c) => {
  const ruang = await prisma.ruangan.findMany({});

  return c.json({
    status: true,
    data: ruang,
  });
});
