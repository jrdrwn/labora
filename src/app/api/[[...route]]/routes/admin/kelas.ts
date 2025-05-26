import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';

export const kelas = new Hono().basePath('/kelas');

kelas.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const kelas = await prisma.kelaspraktikum.findMany({
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
      kuota_praktikan: true,
      asisten: {
        select: {
          id: true,
          nama: true,
          nim: true,
        },
      },
      matakuliahpraktikum: {
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

kelas.post('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    nama: string;
    kuota_praktikan: number;
    mata_kuliah_praktikum: number;
  }>();

  await prisma.kelaspraktikum.create({
    data: {
      nama: json.nama,
      kuota_praktikan: json.kuota_praktikan,
      mata_kuliah_praktikum_id: json.mata_kuliah_praktikum,
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

kelas.put('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    kelas_id: number;
    nama: string;
    kuota_praktikan: number;
    mata_kuliah_praktikum: number;
  }>();
  const kelas = await prisma.kelaspraktikum.findFirst({
    where: {
      id: json.kelas_id,
      admin_id: jwtPayload.sub,
    },
  });
  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }
  await prisma.kelaspraktikum.update({
    where: {
      id: json.kelas_id,
      admin_id: jwtPayload.sub,
    },
    data: {
      nama: json.nama,
      kuota_praktikan: json.kuota_praktikan,
      mata_kuliah_praktikum_id: json.mata_kuliah_praktikum,
    },
  });

  return c.json(
    {
      status: true,
    },
    202,
  );
});

kelas.delete('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    kelas_id: number;
  }>();
  const kelas = await prisma.kelaspraktikum.findFirst({
    where: {
      id: json.kelas_id,
      admin_id: jwtPayload.sub,
    },
  });
  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }
  await prisma.kelaspraktikum.delete({
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
});

kelas.get('/:id', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const kelasId = +c.req.param('id');
  const kelas = await prisma.kelaspraktikum.findFirst({
    where: {
      id: kelasId,
      admin_id: jwtPayload.sub,
    },
    select: {
      id: true,
      nama: true,
      kuota_praktikan: true,
      asisten: {
        select: {
          id: true,
          nama: true,
          nim: true,
        },
      },
      matakuliahpraktikum: {
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
