import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { JWTPayload } from '../../types';

export const ruangan = new Hono().basePath('/ruangan');

ruangan.get('/', async (c) => {
  // TODO: perlu di cek
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const ruang = await prisma.ruangan.findMany({
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    where: {
      nama: {
        search: c.req.query('q') ? String(c.req.query('q')) : undefined,
      },
      admin_id: jwtPayload.sub,
    },
    select: {
      id: true,
      nama: true,
      kapasitas: true,
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

ruangan.post(
  '/',
  zValidator(
    'json',
    z.object({
      nama: z.string().min(1),
      kapasitas: z.record(z.string(), z.number().int().min(0)).default({}),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');

    await prisma.ruangan.create({
      data: {
        nama: json.nama,
        kapasitas: json.kapasitas,
        admin_id: jwtPayload.sub,
      },
    });

    return c.json(
      {
        status: true,
      },
      201,
    );
  },
);

ruangan.put(
  '/',
  zValidator(
    'json',
    z.object({
      where: z.object({
        ruang_id: z.number().int().min(1),
      }),
      update: z.object({
        nama: z.string().min(1).optional(),
        kapasitas: z.record(z.string(), z.number().int().min(0)).optional(),
      }),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');

    const ruang = await prisma.ruangan.findFirst({
      where: {
        id: json.where.ruang_id,
        admin_id: jwtPayload.sub,
      },
    });
    if (!ruang) {
      return c.json({ status: false, message: 'Ruang not found' }, 404);
    }
    await prisma.ruangan.update({
      where: {
        id: json.where.ruang_id,
      },
      data: json.update,
    });

    return c.json({
      status: true,
    });
  },
);

ruangan.delete(
  '/',
  zValidator(
    'json',
    z.object({
      ruang_id: z.coerce.number().int().positive().min(1),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');
    const ruang = await prisma.ruangan.findFirst({
      where: {
        id: json.ruang_id,
        admin_id: jwtPayload.sub,
      },
    });
    if (!ruang) {
      return c.json({ status: false, message: 'Ruang not found' }, 404);
    }
    await prisma.ruangan.delete({
      where: {
        id: json.ruang_id,
      },
    });

    return c.json({
      status: true,
    });
  },
);

ruangan.get('/:id', async (c) => {
  // TODO: perlu di cek
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const ruangId = c.req.param('id');
  const ruang = await prisma.ruangan.findFirst({
    where: {
      id: Number(ruangId),
      admin_id: jwtPayload.sub,
    },
    select: {
      id: true,
      nama: true,
      kapasitas: true,
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
