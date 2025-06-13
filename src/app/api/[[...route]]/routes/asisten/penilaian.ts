import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { PenilaianType } from '../../constants';
import { JWTPayload } from '../../types';

export const penilaian = new Hono().basePath('/penilaian');

penilaian.get('/', async (c) => {
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

  if (laporan.length === 0) {
    return c.json(
      {
        status: false,
        message: 'No laporan found for this kelas praktikum',
      },
      404,
    );
  }

  const praktikan = await prisma.praktikan.findMany({
    where: {
      praktikan_kelas: {
        some: {
          kelas_id: kelas.id,
        },
      },
    },
    select: {
      id: true,
      nama: true,
      nim: true,
      penilaian: {
        select: {
          laporan: {
            select: {
              id: true,
              jadwal_id: true,
            },
          },
          tipe: true,
          nilai: true,
          id: true,
        },
      },
    },
  });

  if (praktikan.length === 0) {
    return c.json(
      {
        status: false,
        message: 'No praktikan found for this kelas praktikum',
      },
      404,
    );
  }

  return c.json({
    status: true,
    data: {
      asisten,
      kelas,
      praktikan,
      laporan,
    },
  });
});

penilaian.post(
  '/',
  zValidator(
    'json',
    z.object({
      praktikan_id: z.number().int().min(1),
      laporan_id: z.number().int().min(1),
      tipe: z.nativeEnum(PenilaianType, {
        errorMap: (_issue, _ctx) => {
          return { message: 'Tipe penilaian is required' };
        },
      }),
      nilai: z.number().min(0).max(100),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');

    const praktikan = await prisma.praktikan.findFirst({
      where: {
        id: json.praktikan_id,
        praktikan_kelas: {
          some: {
            kelas: {
              asisten_id: jwtPayload.sub,
            },
          },
        },
      },
    });

    if (!praktikan) {
      return c.json(
        {
          status: false,
          message: 'Praktikan tidak ditemukan',
        },
        404,
      );
    }

    const laporan = await prisma.laporan.findFirst({
      where: {
        id: json.laporan_id,
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

    if (!laporan.bukti_pertemuan_url || !laporan.judul) {
      return c.json(
        {
          status: false,
          message: 'Laporan harus memiliki bukti pertemuan dan judul',
        },
        400,
      );
    }

    const penilaian = await prisma.penilaian.findFirst({
      where: {
        laporan_id: json.laporan_id,
        praktikan_id: json.praktikan_id,
        tipe: json.tipe,
      },
    });

    await prisma.penilaian.upsert({
      where: {
        id: penilaian?.id || 0,
      },
      create: {
        laporan_id: json.laporan_id,
        praktikan_id: json.praktikan_id,
        tipe: json.tipe,
        nilai: json.nilai,
      },
      update: {
        nilai: json.nilai,
        tipe: json.tipe,
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
