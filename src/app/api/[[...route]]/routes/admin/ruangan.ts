import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from './types';

export const ruangan = new Hono().basePath('/ruangan');

ruangan.get('/', async (c) => {
  const ruang = await prisma.ruang.findMany({
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    where: {
      nama: {
        search: c.req.query('q') ? String(c.req.query('q')) : undefined,
      },
    },
    select: {
      id: true,
      nama: true,
      kuota: true,
      admin: {
        select: {
          id: true,
          nama: true,
          email: true,
        },
      },
    },
  });

  return c.json({
    status: true,
    data: ruang,
  });
});

ruangan.post('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    nama: string;
    kuota: Record<string, number>;
  }>();

  await prisma.ruang.create({
    data: {
      nama: json.nama,
      kuota: json.kuota,
      admin_id: jwtPayload.sub,
    },
  });

  return c.json(
    {
      status: true,
    },
    201,
  );
});

ruangan.put('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    ruang_id: number;
    nama: string;
    kuota: Record<string, number>;
  }>();
  const ruang = await prisma.ruang.findFirst({
    where: {
      id: json.ruang_id,
      admin_id: jwtPayload.sub,
    },
  });
  if (!ruang) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }
  await prisma.ruang.update({
    where: {
      id: json.ruang_id,
    },
    data: {
      nama: json.nama,
      kuota: json.kuota,
    },
  });

  return c.json({
    status: true,
  });
});

ruangan.delete('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    ruang_id: number;
  }>();
  const ruang = await prisma.ruang.findFirst({
    where: {
      id: json.ruang_id,
      admin_id: jwtPayload.sub,
    },
  });
  if (!ruang) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }
  await prisma.ruang.delete({
    where: {
      id: json.ruang_id,
    },
  });

  return c.json({
    status: true,
  });
});

ruangan.get('/:id', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const ruangId = c.req.param('id');
  const ruang = await prisma.ruang.findFirst({
    where: {
      id: Number(ruangId),
      admin_id: jwtPayload.sub,
    },
    select: {
      id: true,
      nama: true,
      kuota: true,
      admin: {
        select: {
          id: true,
          nama: true,
          email: true,
        },
      },
    },
  });
  if (!ruang) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }

  return c.json({
    status: true,
    data: ruang,
  });
});
