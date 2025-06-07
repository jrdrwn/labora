import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { JWTPayload } from '../../types';

export const laporan = new Hono().basePath('/laporan');

laporan.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const asisten = await prisma.asisten.findFirst({
    where: {
      id: jwtPayload.sub,
    },
  });

  if (!asisten) {
    return c.json(
      {
        status: false,
        message: 'Asisten not found',
      },
      404,
    );
  }

  const kelas = await prisma.kelas.findFirst({
    where: {
      asisten_id: asisten.id,
    },
    include: {
      jadwal: {
        select: {
          id: true,
          mulai: true,
          selesai: true,
        },
      },
    },
  });

  if (!kelas) {
    return c.json(
      {
        status: false,
        message: 'Kelas praktikum not found',
      },
      404,
    );
  }

  const laporan = await prisma.laporan.findMany({
    where: {
      jadwal: {
        kelas_id: kelas.id,
      },
    },
    select: {
      id: true,
      judul: true,
      bukti_pertemuan_url: true,
      jadwal: {
        select: {
          id: true,
          mulai: true,
          selesai: true,
        },
      },
    },
  });

  return c.json({
    status: true,
    data: laporan,
  });
});

laporan.put(
  '/',
  zValidator(
    'json',
    z.object({
      where: z.object({
        laporan_id: z.coerce.number().int().positive(),
      }),
      update: z.object({
        judul: z.string().optional(),
        bukti_pertemuan_url: z.string().url().optional(),
      }),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');

    const laporan = await prisma.laporan.findFirst({
      where: {
        id: json.where.laporan_id,
        jadwal: {
          kelas: {
            asisten_id: jwtPayload.sub,
          },
        },
      },
    });

    if (!laporan) {
      return c.json(
        {
          status: false,
          message: 'laporan tidak ditemukan',
        },
        404,
      );
    }

    await prisma.laporan.update({
      where: {
        id: json.where.laporan_id,
      },
      data: json.update,
    });

    return c.json(
      {
        status: true,
      },
      201,
    );
  },
);
