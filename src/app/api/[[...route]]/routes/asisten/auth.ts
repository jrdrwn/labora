import prisma from '@db';
import prismaCloud from '@db/cloud';
import { zValidator } from '@hono/zod-validator';
import { checkMahasiswa } from '@sql/cloud';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { sign } from 'hono/jwt';
import { z } from 'zod';

import { AsistenStatus, EventType, Role } from '../../constants';
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

    const asisten = await prisma.asisten.upsert({
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
      sub: asisten.id,
      role: Role.ASISTEN,
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
      mata_kuliah_praktikum: z
        .array(z.string())
        .min(1, 'Mata kuliah praktikum is required'),
      komitmen_url: z.string().url('Komitmen URL must be a valid URL'),
      dokumen_pendukung_url: z.string().optional(),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');
    const asisten = await prisma.asisten.findFirst({
      where: {
        id: jwtPayload.sub,
      },
    });
    if (!asisten) {
      return c.json({ status: false, message: 'Asisten not found' }, 404);
    }

    const event = await prisma.event.findFirst({
      where: {
        jenis: EventType.pendaftaran_asisten,
        is_aktif: true,
      },
      orderBy: {
        mulai: 'desc',
      },
    });
    if (!event) {
      return c.json({ status: false, message: 'Event not found' }, 404);
    }

    await prisma.asisten.update({
      where: {
        id: jwtPayload.sub,
      },
      data: {
        event_id: event.id,
        status: AsistenStatus.diproses,
        mata_kuliah_pilihan: json.mata_kuliah_praktikum,
        komitmen_url: json.komitmen_url,
        dokumen_pendukung_url: json.dokumen_pendukung_url,
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

  const asisten = await prisma.asisten.findFirst({
    where: {
      id: jwtPayload.sub,
    },
    select: {
      id: true,
      nim: true,
      nama: true,
      email: true,
      status: true,
      mata_kuliah_pilihan: true,
      dokumen_pendukung_url: true,
      komitmen_url: true,
      event: true,
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

  // Data respons yang akan dikembalikan
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const responseData: any = {
    ...asisten,
  };

  const mata_kuliah = await prisma.mata_kuliah.findMany({
    where: {
      kode: {
        in: asisten.mata_kuliah_pilihan as string[],
      },
    },
    select: {
      id: true,
      nama: true,
      kode: true,
    },
  });
  responseData.mata_kuliah_pilihan = mata_kuliah;

  if (asisten.status === 'diterima') {
    const kelas = await prisma.kelas.findMany({
      where: {
        asisten_id: asisten.id,
      },
      include: {
        mata_kuliah: true,
      },
    });

    responseData.kelas = kelas.map((k) => ({
      id: k.id,
      nama: k.nama,
      mata_kuliah: {
        id: k.mata_kuliah?.id,
        nama: k.mata_kuliah?.nama,
        kode: k.mata_kuliah?.kode,
      },
    }));
  }

  return c.json({ status: true, data: responseData }, 200);
});

auth.get('/mata-kuliah', async (c) => {
  const mataKuliah = await prisma.mata_kuliah.findMany({
    select: {
      id: true,
      nama: true,
      kode: true,
    },
  });

  // TODO: filter mata kuliah berdasarkan data asisten

  return c.json({ status: true, data: mataKuliah }, 200);
});
