import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { JWTPayload } from '../../types';

export const kelas = new Hono().basePath('/kelas');

kelas.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const kelas = await prisma.kelas.findMany({
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
          jadwal: true,
          praktikan_kelas: true,
        },
      },
      id: true,
      nama: true,
      kapasitas_praktikan: true,
      asisten: {
        select: {
          id: true,
          nama: true,
          nim: true,
        },
      },
      mata_kuliah: {
        select: {
          id: true,
          nama: true,
          kode: true,
        },
      },
    },
  });

  return c.json({
    status: true,
    data: kelas,
  });
});

kelas.post(
  '/',
  zValidator(
    'json',
    z.object({
      nama: z.string().min(1),
      kapasitas_praktikan: z.number().int().min(1),
      mata_kuliah_id: z.number().int().min(1),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');

    const mataKuliah = await prisma.mata_kuliah.findFirst({
      where: {
        id: json.mata_kuliah_id,
        admin_id: jwtPayload.sub,
      },
    });
    if (!mataKuliah) {
      return c.json({ status: false, message: 'Mata Kuliah not found' }, 404);
    }

    await prisma.kelas.create({
      data: {
        nama: json.nama,
        kapasitas_praktikan: json.kapasitas_praktikan,
        mata_kuliah_id: json.mata_kuliah_id,
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

kelas.put(
  '/',
  zValidator(
    'json',
    z.object({
      where: z.object({
        kelas_id: z.coerce.number().int().positive(),
      }),
      update: z.object({
        nama: z.string().min(1).optional(),
        kapasitas_praktikan: z.number().int().min(1).optional(),
        mata_kuliah_id: z.number().int().min(1).optional(),
      }),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');
    const kelas = await prisma.kelas.findFirst({
      where: {
        id: json.where.kelas_id,
        admin_id: jwtPayload.sub,
      },
    });
    if (!kelas) {
      return c.json({ status: false, message: 'Kelas not found' }, 404);
    }
    await prisma.kelas.update({
      where: {
        id: json.where.kelas_id,
        admin_id: jwtPayload.sub,
      },
      data: json.update,
    });

    return c.json(
      {
        status: true,
      },
      202,
    );
  },
);

kelas.delete(
  '/',
  zValidator(
    'json',
    z.object({
      kelas_id: z.coerce.number().int().positive().min(1),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');
    const kelas = await prisma.kelas.findFirst({
      where: {
        id: json.kelas_id,
        admin_id: jwtPayload.sub,
      },
    });
    if (!kelas) {
      return c.json({ status: false, message: 'Kelas not found' }, 404);
    }
    await prisma.kelas.delete({
      where: {
        id: json.kelas_id,
        admin_id: jwtPayload.sub,
      },
    });

    return c.json(
      {
        status: true,
      },
      202,
    );
  },
);

kelas.get('/:id', async (c) => {
  // TODO: perlu di cek lagi
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const kelasId = +c.req.param('id');
  const kelas = await prisma.kelas.findFirst({
    where: {
      id: kelasId,
      admin_id: jwtPayload.sub,
    },
    select: {
      id: true,
      nama: true,
      kapasitas_praktikan: true,
      asisten: {
        select: {
          id: true,
          nama: true,
          nim: true,
        },
      },
      mata_kuliah: {
        select: {
          id: true,
          nama: true,
          kode: true,
        },
      },
    },
  });
  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }
  return c.json({
    status: true,
    data: kelas,
  });
});
