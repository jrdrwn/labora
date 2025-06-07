import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { JWTPayload } from '../../types';

export const mataKuliah = new Hono().basePath('/mata-kuliah');

mataKuliah.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const mata_kuliah = await prisma.mata_kuliah.findMany({
    // skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    // take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    where: {
      nama: {
        search: c.req.query('q') ? String(c.req.query('q')) : undefined,
      },
      admin_id: jwtPayload.sub,
    },
    select: {
      _count: {
        select: {
          kelas: true,
        },
      },
      id: true,
      kode: true,
      nama: true,
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
    data: mata_kuliah,
  });
});

mataKuliah.post(
  '/',
  zValidator(
    'json',
    z.object({
      kode: z.string().nonempty(),
      nama: z.string().nonempty(),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');

    const existingMataKuliah = await prisma.mata_kuliah.findFirst({
      where: {
        kode: json.kode,
      },
    });

    if (existingMataKuliah) {
      return c.json(
        { status: false, message: 'Mata kuliah with this kode already exists' },
        409,
      );
    }

    await prisma.mata_kuliah.create({
      data: {
        kode: json.kode,
        nama: json.nama,
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

mataKuliah.put(
  '/',
  zValidator(
    'json',
    z.object({
      where: z.object({
        mata_kuliah_id: z.coerce.number().int().positive(),
      }),
      update: z.object({
        kode: z.string().nonempty().optional(),
        nama: z.string().nonempty().optional(),
      }),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');
    const matakuliahpraktikum = await prisma.mata_kuliah.findFirst({
      where: {
        id: json.where.mata_kuliah_id,
        admin_id: jwtPayload.sub,
      },
    });
    if (!matakuliahpraktikum) {
      return c.json({ status: false, message: 'Mata kuliah not found' }, 404);
    }
    await prisma.mata_kuliah.update({
      where: {
        id: json.where.mata_kuliah_id,
        admin_id: jwtPayload.sub,
      },
      data: json.update,
    });

    return c.json({
      status: true,
    });
  },
);

mataKuliah.delete(
  '/',
  zValidator(
    'json',
    z.object({
      mata_kuliah_id: z.coerce.number().int().positive(),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');
    const matakuliahpraktikum = await prisma.mata_kuliah.findFirst({
      where: {
        id: json.mata_kuliah_id,
        admin_id: jwtPayload.sub,
      },
    });
    if (!matakuliahpraktikum) {
      return c.json({ status: false, message: 'Mata kuliah not found' }, 404);
    }
    await prisma.mata_kuliah.delete({
      where: {
        id: json.mata_kuliah_id,
        admin_id: jwtPayload.sub,
      },
    });

    return c.json({
      status: true,
    });
  },
);

mataKuliah.get('/:id', async (c) => {
  // TODO: perlu di cek
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const matakuliahpraktikum_id = c.req.param('id');
  const matakuliahpraktikum = await prisma.mata_kuliah.findFirst({
    where: {
      id: Number(matakuliahpraktikum_id),
      admin_id: jwtPayload.sub,
    },
    select: {
      id: true,
      kode: true,
      nama: true,
    },
  });
  if (!matakuliahpraktikum) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }

  return c.json({
    status: true,
    data: matakuliahpraktikum,
  });
});
