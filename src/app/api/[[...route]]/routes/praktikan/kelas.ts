import prisma from '@db';
import prismaCloud from '@db/cloud';
import { getKRSBaruByNIM } from '@sql/cloud';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';

export const kelas = new Hono().basePath('/kelas');

kelas.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;

  const kelas = await prisma.kelaspraktikum.findMany({
    where: {
      kelaspraktikumpraktikan: {
        some: {
          praktikan_id: jwtPayload.sub,
        },
      },
    },
    select: {
      id: true,
      nama: true,
    },
  });

  return c.json({
    status: true,
    data: kelas,
  });
});

kelas.get('/pre', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;

  const praktikan = await prisma.praktikan.findFirst({
    where: {
      id: jwtPayload.sub,
    },
  });
  if (!praktikan) {
    return c.json({ status: false, message: 'Praktikan not found' }, 404);
  }

  const krs = await prismaCloud.$queryRawTyped(
    getKRSBaruByNIM(praktikan.nim!, praktikan.nim!),
  );

  if (krs.length < 1) {
    return c.json({ status: false, message: 'KRS not found' }, 404);
  }

  const mata_kuliah_praktikum = await prisma.matakuliahpraktikum.findMany({
    where: {
      kode: {
        in: krs.map((k) => k.mkkurKode),
      },
    },
    select: {
      id: true,
      nama: true,
      kode: true,
      kelaspraktikum: {
        select: {
          kelaspraktikumpraktikan: {
            select: {
              id: true,
              perangkat: true,
              praktikan_id: true,
            },
          },
          id: true,
          nama: true,
          kuota_praktikan: true,
          jadwalpraktikum: {
            select: {
              id: true,
              mulai: true,
              selesai: true,
              status: true,
              ruang: {
                select: {
                  id: true,
                  nama: true,
                  kuota: true,
                },
              },
            },
          },
          asisten: {
            select: {
              id: true,
              nama: true,
              nim: true,
            },
          },
        },
      },
    },
  });

  return c.json({
    status: true,
    data: mata_kuliah_praktikum,
  });
});
