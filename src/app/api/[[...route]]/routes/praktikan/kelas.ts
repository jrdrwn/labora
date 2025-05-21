import prisma from '@db';
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
