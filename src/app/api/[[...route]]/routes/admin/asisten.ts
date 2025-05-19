import prisma from '@db';
import { Hono } from 'hono';

export const asisten = new Hono().basePath('/asisten');

asisten.get('/', async (c) => {
  const asisten = await prisma.asisten.findMany({
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    where: {
      nama: {
        search: c.req.query('q') ? String(c.req.query('q')) : undefined,
      },
    },
    select: {
      id: true,
      nim: true,
      nama: true,
      email: true,
      status: true,
      kelaspraktikum: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });

  return c.json({
    status: true,
    data: asisten,
  });
});

asisten.put('/', async (c) => {
  const json = await c.req.json<{
    status?: 'pending' | 'diterima' | 'ditolak';
    kelas_id: number;
    asisten_id: number;
  }>();

  const asisten = await prisma.asisten.findFirst({
    where: {
      id: json.asisten_id,
    },
  });

  if (!asisten) {
    return c.json({ status: false, message: 'Asisten not found' }, 404);
  }

  const kelas = await prisma.kelaspraktikum.findFirst({
    where: {
      id: json.kelas_id,
    },
  });

  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }

  await prisma.kelaspraktikum.update({
    where: {
      id: json.kelas_id,
    },
    data: {
      asisten_id: json.asisten_id,
    },
  });

  await prisma.asisten.update({
    where: {
      id: json.asisten_id,
    },
    data: {
      status: json.status,
    },
  });

  return c.json({
    status: true,
  });
});

asisten.delete('/', async (c) => {
  const json = await c.req.json<{
    asisten_id: number;
  }>();
  const asisten = await prisma.asisten.findFirst({
    where: {
      id: json.asisten_id,
    },
  });
  if (!asisten) {
    return c.json({ status: false, message: 'Asisten not found' }, 404);
  }

  const kelas = await prisma.kelaspraktikum.findFirst({
    where: {
      asisten_id: json.asisten_id,
    },
  });

  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }

  await prisma.kelaspraktikum.update({
    where: {
      id: kelas!.id,
    },
    data: {
      asisten_id: null,
    },
  });

  await prisma.asisten.delete({
    where: {
      id: json.asisten_id,
    },
  });

  return c.json(
    {
      status: true,
    },
    202,
  );
});

asisten.get('/:id', async (c) => {
  const asistenId = +c.req.param('id');
  const asisten = await prisma.asisten.findFirst({
    where: {
      id: asistenId,
    },
    select: {
      id: true,
      nim: true,
      nama: true,
      email: true,
      status: true,
      kelaspraktikum: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });
  if (!asisten) {
    return c.json({ status: false, message: 'Asisten not found' }, 404);
  }
  return c.json({
    status: true,
    data: asisten,
  });
});
