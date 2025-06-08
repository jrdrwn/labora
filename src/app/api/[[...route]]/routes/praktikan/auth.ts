import prisma from '@db';
import prismaCloud from '@db/cloud';
import { zValidator } from '@hono/zod-validator';
import { checkMahasiswa } from '@sql/cloud';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { sign } from 'hono/jwt';
import { z } from 'zod';

import { EventType, Perangkat } from '../../constants';
import { JWTPayload } from '../../types';

export const auth = new Hono().basePath('/');

auth.post(
  '/login',
  zValidator(
    'json',
    z.object({
      nim: z.string().nonempty(),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long'),
    }),
  ),
  async (c) => {
    const { JWT_SECRET, CLOUD_KEY } = env<{
      JWT_SECRET: string;
      CLOUD_KEY: string;
    }>(c);

    const json = c.req.valid('json');

    const cloudUser = await prismaCloud.$queryRawTyped(
      checkMahasiswa(json.nim, json.password, CLOUD_KEY),
    );

    if (cloudUser.length < 1) {
      return c.json({ status: false, message: 'User not found' }, 404);
    }

    if (!cloudUser[0].email) {
      return c.json(
        {
          status: false,
          message: 'Email tidak ada, tolong isi email pada siuber',
        },
        404,
      );
    }

    const praktikan = await prisma.praktikan.upsert({
      where: {
        nim: cloudUser[0].nim,
      },
      create: {
        nim: cloudUser[0].nim,
        nama: cloudUser[0].nama,
        email: cloudUser[0].email,
      },
      update: {
        nama: cloudUser[0].nama,
        email: cloudUser[0].email,
      },
    });

    const payload = {
      sub: praktikan.id,
      role: 'praktikan',
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
    };

    const token = await sign(payload, JWT_SECRET);

    return c.json({
      status: true,
      data: {
        token,
      },
    });
  },
);

auth.post(
  '/register',
  zValidator(
    'json',
    z.object({
      mata_kuliah_praktikum_id: z.number().int().positive(),
      kelas_praktikum_id: z.number().int().positive(),
      perangkat: z.nativeEnum(Perangkat),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');
    const event = await prisma.event.findFirst({
      where: {
        jenis: EventType.pendaftaran_praktikan,
      },
      orderBy: {
        mulai: 'desc',
      },
    });
    if (!event) {
      return c.json({ status: false, message: 'Event not found' }, 404);
    }

    const mataKuliahPraktikum = await prisma.mata_kuliah.findFirst({
      where: {
        id: json.mata_kuliah_praktikum_id,
        kelas: {
          some: {
            id: json.kelas_praktikum_id,
          },
        },
      },
    });

    if (!mataKuliahPraktikum) {
      return c.json(
        { status: false, message: 'Mata kuliah praktikum not found' },
        404,
      );
    }

    await prisma.praktikan.update({
      where: {
        id: jwtPayload.sub,
      },
      data: {
        event_id: event.id,
      },
    });

    const oldDIfferentKelas = await prisma.praktikan_kelas.findMany({
      where: {
        praktikan_id: jwtPayload.sub,
        kelas: {
          NOT: {
            id: json.kelas_praktikum_id,
          },
          mata_kuliah_id: json.mata_kuliah_praktikum_id,
        },
      },
    });

    if (oldDIfferentKelas.length) {
      await prisma.praktikan_kelas.deleteMany({
        where: {
          id: {
            in: oldDIfferentKelas.map((k) => k.id),
          },
        },
      });
    }

    const kelasPraktikumPraktikan = await prisma.praktikan_kelas.findFirst({
      where: {
        praktikan_id: jwtPayload.sub,
        kelas_id: json.kelas_praktikum_id,
      },
    });

    await prisma.praktikan_kelas.upsert({
      where: {
        id: kelasPraktikumPraktikan?.id || 0,
      },
      create: {
        praktikan_id: jwtPayload.sub,
        kelas_id: json.kelas_praktikum_id,
        perangkat: json.perangkat,
      },
      update: {
        kelas_id: json.kelas_praktikum_id,
        perangkat: json.perangkat,
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

auth.get('/me', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;

  const praktikan = await prisma.praktikan.findFirst({
    where: {
      id: jwtPayload.sub,
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

  const event = praktikan.event_id
    ? await prisma.event.findFirst({ where: { id: praktikan.event_id } })
    : null;

  // Ambil relasi kelas yang diikuti praktikan
  const kelasPraktikan = await prisma.praktikan_kelas.findMany({
    where: {
      praktikan_id: praktikan.id,
    },
    include: {
      kelas: {
        include: {
          mata_kuliah: true,
        },
      },
    },
  });

  const kelas = kelasPraktikan.map((kp) => ({
    id: kp.kelas?.id,
    nama: kp.kelas?.nama,
    mata_kuliah: {
      id: kp.kelas?.mata_kuliah?.id,
      nama: kp.kelas?.mata_kuliah?.nama,
      kode: kp.kelas?.mata_kuliah?.kode,
      perangkat: kp.perangkat,
    },
  }));

  return c.json(
    {
      status: true,
      data: {
        event_id: event?.id ?? null,
        kelas,
      },
    },
    200,
  );
});
