import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';

export const kehadiran = new Hono().basePath('/kehadiran');

kehadiran.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const jadwalpraktikum = await prisma.jadwalpraktikum.findMany({
    where: {
      kelaspraktikum: {
        asisten_id: jwtPayload.sub,
      },
    },
  });
  const penilaian = await prisma.penilaian.findMany({
    where: {
      OR: jadwalpraktikum.map((jp) => ({
        jadwal_praktikum_id: jp.id,
      })),
    },
    select: {
      id: true,
      jadwalpraktikum: {
        select: {
          id: true,
          mulai: true,
          selesai: true,
        },
      },
      detailpenilaian: {
        where: {
          kehadiran: {
            not: null,
          },
        },
        select: {
          id: true,
          kehadiran: true,
          praktikan: {
            select: {
              id: true,
              nim: true,
              nama: true,
            },
          },
        },
      },
    },
  });

  return c.json({
    status: true,
    data: penilaian,
  });
});

kehadiran.post('/', async (c) => {
  const json = await c.req.json<{
    praktikan_id: number;
    penilaian_id: number;
    detail: 'hadir' | 'izin' | 'alpha';
  }>();

  const praktikan = await prisma.praktikan.findFirst({
    where: {
      id: json.praktikan_id,
    },
  });

  if (!praktikan) {
    return c.json(
      {
        status: false,
        message: 'Praktikan not found',
      },
      404,
    );
  }

  const penilaian = await prisma.penilaian.findFirst({
    where: {
      id: json.penilaian_id,
    },
  });

  if (!penilaian) {
    return c.json(
      {
        status: false,
        message: 'Penilaian not found',
      },
      404,
    );
  }

  const detailPenilaian = await prisma.detailpenilaian.findFirst({
    where: {
      penilaian_id: json.penilaian_id,
      praktikan_id: json.praktikan_id,
    },
  });

  if (detailPenilaian) {
    return c.json(
      {
        status: false,
        message: 'Detail penilaian already exists',
      },
      409,
    );
  }

  await prisma.detailpenilaian.create({
    data: {
      kehadiran: json.detail,
      penilaian_id: json.penilaian_id,
      praktikan_id: json.praktikan_id,
    },
  });

  return c.json(
    {
      status: true,
    },
    201,
  );
});

kehadiran.put('/', async (c) => {
  const json = await c.req.json<{
    detail_penilaian_id: number;
    detail: 'hadir' | 'izin' | 'alpha';
  }>();

  const detailPenilaian = await prisma.detailpenilaian.findFirst({
    where: {
      id: json.detail_penilaian_id,
    },
  });

  if (!detailPenilaian) {
    return c.json(
      {
        status: false,
        message: 'Detail penilaian not found',
      },
      404,
    );
  }

  await prisma.detailpenilaian.update({
    where: {
      id: json.detail_penilaian_id,
    },
    data: {
      kehadiran: json.detail,
    },
  });

  return c.json(
    {
      status: true,
    },
    202,
  );
});
