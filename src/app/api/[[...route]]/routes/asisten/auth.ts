import prisma from '@db';
import prismaCloud from '@db/cloud';
import { checkMahasiswa } from '@sql/cloud';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { sign } from 'hono/jwt';

import { JWTPayload } from '../../types';

export const auth = new Hono().basePath('/');

auth.post('/login', async (c) => {
  const { JWT_SECRET, CLOUD_KEY } = env<{
    JWT_SECRET: string;
    CLOUD_KEY: string;
  }>(c);

  const json = await c.req.json<{
    nim: string;
    password: string;
  }>();

  const cloudUser = await prismaCloud.$queryRawTyped(
    checkMahasiswa(json.nim, json.password, CLOUD_KEY),
  );

  if (cloudUser.length < 1) {
    return c.json({ status: false, message: 'User not found' }, 404);
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
    role: 'asisten',
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24, // 1 day
  };

  const token = await sign(payload, JWT_SECRET);

  return c.json({
    status: true,
    data: {
      token,
    },
  });
});

auth.post('/register', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    mata_kuliah_praktikum: string[];
    komitmen_url: string;
  }>();
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
      jenis: 'pendaftaran_asisten',
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
      status: 'pending',
      pre_mata_kuliah_praktikum: json.mata_kuliah_praktikum,
      komitmen_url: json.komitmen_url,
    },
  });
  return c.json(
    {
      status: true,
    },
    201,
  );
});
