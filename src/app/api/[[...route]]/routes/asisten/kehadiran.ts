import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { KehadiranType } from '../../constants';
import { JWTPayload } from '../../types';

export const kehadiran = new Hono().basePath('/kehadiran');

kehadiran.get('/', async (c) => {
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
      kehadiran: {
        select: {
          laporan: {
            select: {
              id: true,
              jadwal_id: true,
            },
          },
          tipe: true,
          id: true,
        },
      },
    },
  });

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

kehadiran.post(
  '/',
  zValidator(
    'json',
    z.object({
      praktikan_id: z.number().int().min(1, 'Praktikan ID is required'),
      laporan_id: z.number().int().min(1, 'Laporan ID is required'),
      tipe: z.nativeEnum(KehadiranType, {
        errorMap: (_issue, _ctx) => {
          return { message: 'Tipe kehadiran is required' };
        },
      }),
    }),
  ),
  async (c) => {
    const json = c.req.valid('json');

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

    const laporan = await prisma.laporan.findFirst({
      where: {
        id: json.laporan_id,
      },
    });

    if (!laporan) {
      return c.json(
        {
          status: false,
          message: 'Laporan not found',
        },
        404,
      );
    }

    if (!laporan.judul || !laporan.bukti_pertemuan_url) {
      return c.json(
        {
          status: false,
          message: 'Laporan must have a title and meeting proof',
        },
        400,
      );
    }

    const kehadiran = await prisma.kehadiran.findFirst({
      where: {
        laporan_id: json.laporan_id,
        praktikan_id: json.praktikan_id,
      },
    });

    if (kehadiran) {
      return c.json(
        {
          status: false,
          message: 'Detail penilaian already exists',
        },
        409,
      );
    }

    await prisma.kehadiran.create({
      data: {
        tipe: json.tipe,
        laporan_id: json.laporan_id,
        praktikan_id: json.praktikan_id,
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

kehadiran.put(
  '/',
  zValidator(
    'json',
    z.object({
      where: z.object({
        kehadiran_id: z.number().int().min(1, 'Kehadiran ID is required'),
      }),
      update: z.object({
        tipe: z.nativeEnum(KehadiranType, {
          errorMap: (_issue, _ctx) => {
            return { message: 'Tipe kehadiran is required' };
          },
        }),
      }),
    }),
  ),
  async (c) => {
    const json = c.req.valid('json');

    const kehadiran = await prisma.kehadiran.findFirst({
      where: {
        id: json.where.kehadiran_id,
      },
    });

    if (!kehadiran) {
      return c.json(
        {
          status: false,
          message: 'Kehadiran not found',
        },
        404,
      );
    }

    await prisma.kehadiran.update({
      where: {
        id: json.where.kehadiran_id,
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
