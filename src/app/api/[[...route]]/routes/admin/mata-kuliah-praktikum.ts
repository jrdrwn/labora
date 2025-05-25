import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';

export const mataKuliahPraktikum = new Hono().basePath(
  '/mata-kuliah-praktikum',
);

mataKuliahPraktikum.get('/', async (c) => {
  const mata_kuliah_praktikum = await prisma.matakuliahpraktikum.findMany({
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    where: {
      nama: {
        search: c.req.query('q') ? String(c.req.query('q')) : undefined,
      },
    },
    select: {
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
    data: mata_kuliah_praktikum,
  });
});

mataKuliahPraktikum.post('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    kode: string;
    nama: string;
  }>();

  await prisma.matakuliahpraktikum.create({
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
});

mataKuliahPraktikum.put('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    matakuliahpraktikum_id: number;
    kode: string;
    nama: string;
  }>();
  const matakuliahpraktikum = await prisma.matakuliahpraktikum.findFirst({
    where: {
      id: json.matakuliahpraktikum_id,
      admin_id: jwtPayload.sub,
    },
  });
  if (!matakuliahpraktikum) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }
  await prisma.matakuliahpraktikum.update({
    where: {
      id: json.matakuliahpraktikum_id,
      admin_id: jwtPayload.sub,
    },
    data: {
      kode: json.kode,
      nama: json.nama,
    },
  });

  return c.json({
    status: true,
  });
});

mataKuliahPraktikum.delete('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    matakuliahpraktikum_id: number;
  }>();
  const matakuliahpraktikum = await prisma.matakuliahpraktikum.findFirst({
    where: {
      id: json.matakuliahpraktikum_id,
      admin_id: jwtPayload.sub,
    },
  });
  if (!matakuliahpraktikum) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }
  await prisma.matakuliahpraktikum.delete({
    where: {
      id: json.matakuliahpraktikum_id,
      admin_id: jwtPayload.sub,
    },
  });

  return c.json({
    status: true,
  });
});

mataKuliahPraktikum.get('/:id', async (c) => {
  const matakuliahpraktikum_id = c.req.param('id');
  const matakuliahpraktikum = await prisma.matakuliahpraktikum.findFirst({
    where: {
      id: Number(matakuliahpraktikum_id),
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
