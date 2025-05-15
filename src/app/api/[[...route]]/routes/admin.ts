import prisma from '@db';
import bcrypt from 'bcrypt';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { except } from 'hono/combine';
import { jwt, sign } from 'hono/jwt';
import jwtTypes from 'hono/utils/jwt/types';
import { handle } from 'hono/vercel';

type JWTPayload = jwtTypes.JWTPayload & {
  sub: number;
  role: 'admin' | 'asisten' | 'praktikan';
};

export const app = new Hono().basePath('/admin');

app.use(
  '/*',
  except('*/*/login', async (c, next) => {
    const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);
    const jwtMiddleware = jwt({
      secret: JWT_SECRET,
    });
    return jwtMiddleware(c, next);
  }),
);

app.use(
  '/*',
  except('*/*/login', async (c, next) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    if (jwtPayload.role !== 'admin') {
      return c.json({ status: false, message: 'Unauthorized' }, 401);
    }
    return next();
  }),
);

app.get('/echo', (c) => {
  return c.json({ message: 'Hello from admin!' });
});

app.post('/login', async (c) => {
  const { JWT_SECRET } = env<{ JWT_SECRET: string }>(c);

  const json = await c.req.json<{
    identifier: string;
    password: string;
  }>();

  const user = await prisma.admin.findUnique({
    where: {
      email: json.identifier,
    },
  });

  if (!user) {
    return c.json({ status: false, message: 'User not found' }, 404);
  }

  const match = await bcrypt.compare(json.password, user.password!);

  if (!match) {
    return c.json({ status: false, message: 'Password not match' }, 401);
  }
  const payload = {
    sub: user.id,
    role: 'admin',
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

app.post('/event', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    jenis: 'pendaftaran_asisten' | 'pendaftaran_praktikan' | 'praktikum';
    mulai: Date;
    selesai: Date;
  }>();

  const event = await prisma.event.findFirst({
    where: {
      admin_id: jwtPayload.sub,
      mulai: {
        gte: new Date(json.mulai),
      },
      selesai: {
        lte: new Date(json.selesai),
      },
    },
  });

  if (event) {
    return c.json({ status: false, message: 'Event already exists' }, 400);
  }

  await prisma.event.create({
    data: {
      admin_id: jwtPayload.sub,
      jenis: json.jenis,
      mulai: new Date(json.mulai),
      selesai: new Date(json.selesai),
    },
  });

  return c.json({
    status: true,
  });
});

app.get('/event', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;

  const events = await prisma.event.findMany({
    where: {
      admin_id: jwtPayload.sub,
    },
  });

  return c.json({
    status: true,
    data: events,
  });
});

app.delete('/event/:id', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const eventId = c.req.param('id');
  const event = await prisma.event.findFirst({
    where: {
      id: Number(eventId),
      admin_id: jwtPayload.sub,
    },
  });
  if (!event) {
    return c.json({ status: false, message: 'Event not found' }, 404);
  }

  await prisma.event.delete({
    where: {
      id: Number(eventId),
    },
  });

  return c.json({
    status: true,
  });
});

app.put('/event', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    event_id: number;
    jenis: 'pendaftaran_asisten' | 'pendaftaran_praktikan' | 'praktikum';
    mulai: Date;
    selesai: Date;
  }>();
  let event;
  event = await prisma.event.findFirst({
    where: {
      id: Number(json.event_id),
      admin_id: jwtPayload.sub,
    },
  });
  if (!event) {
    return c.json({ status: false, message: 'Event not found' }, 404);
  }
  event = await prisma.event.findFirst({
    where: {
      id: {
        not: Number(json.event_id),
      },
      admin_id: jwtPayload.sub,
      mulai: {
        gte: new Date(json.mulai),
      },
      selesai: {
        lte: new Date(json.selesai),
      },
    },
  });

  if (event) {
    return c.json({ status: false, message: 'Event already exists' }, 400);
  }

  await prisma.event.update({
    where: {
      id: Number(json.event_id),
    },
    data: {
      jenis: json.jenis,
      mulai: new Date(json.mulai),
      selesai: new Date(json.selesai),
    },
  });

  return c.json({
    status: true,
  });
});

app.get('/ruangan', async (c) => {
  const ruang = await prisma.ruang.findMany({
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    where: {
      nama: {
        search: c.req.query('q') ? String(c.req.query('q')) : undefined,
      },
    },
    select: {
      id: true,
      nama: true,
      kuota: true,
      admin: {
        select: {
          id: true,
          nama: true,
          email: true,
        },
      },
    },
  });

  return c.json({
    status: true,
    data: ruang,
  });
});

app.post('/ruangan', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    nama: string;
    kuota: Record<string, number>;
  }>();

  await prisma.ruang.create({
    data: {
      nama: json.nama,
      kuota: json.kuota,
      admin_id: jwtPayload.sub,
    },
  });

  return c.json(
    {
      status: true,
    },
    201,
  );
});

app.put('/ruangan', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    ruang_id: number;
    nama: string;
    kuota: Record<string, number>;
  }>();
  const ruang = await prisma.ruang.findFirst({
    where: {
      id: json.ruang_id,
      admin_id: jwtPayload.sub,
    },
  });
  if (!ruang) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }
  await prisma.ruang.update({
    where: {
      id: json.ruang_id,
    },
    data: {
      nama: json.nama,
      kuota: json.kuota,
    },
  });

  return c.json({
    status: true,
  });
});

app.delete('/ruangan', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    ruang_id: number;
  }>();
  const ruang = await prisma.ruang.findFirst({
    where: {
      id: json.ruang_id,
      admin_id: jwtPayload.sub,
    },
  });
  if (!ruang) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }
  await prisma.ruang.delete({
    where: {
      id: json.ruang_id,
    },
  });

  return c.json({
    status: true,
  });
});

app.get('/ruangan/:id', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const ruangId = c.req.param('id');
  const ruang = await prisma.ruang.findFirst({
    where: {
      id: Number(ruangId),
      admin_id: jwtPayload.sub,
    },
    select: {
      id: true,
      nama: true,
      kuota: true,
      admin: {
        select: {
          id: true,
          nama: true,
          email: true,
        },
      },
    },
  });
  if (!ruang) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }

  return c.json({
    status: true,
    data: ruang,
  });
});

app.get('/kelas', async (c) => {
  const kelas = await prisma.kelaspraktikum.findMany({
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    where: {
      nama: {
        search: c.req.query('q') ? String(c.req.query('q')) : undefined,
      },
    },
    select: {
      id: true,
      nama: true,
      kuota_praktikan: true,
      asisten: {
        select: {
          id: true,
          nama: true,
          nim: true,
        },
      },
      matakuliahpraktikum: {
        select: {
          id: true,
          nama: true,
          kode: true,
        },
      },
    },
  });

  return c.json({
    status: true,
    data: kelas,
  });
});

app.post('/kelas', async (c) => {
  const json = await c.req.json<{
    nama: string;
    kuota_praktikan: number;
    mata_kuliah_praktikum: number;
  }>();

  await prisma.kelaspraktikum.create({
    data: {
      nama: json.nama,
      kuota_praktikan: json.kuota_praktikan,
      mata_kuliah_praktikum_id: json.mata_kuliah_praktikum,
    },
  });

  return c.json(
    {
      status: true,
    },
    201,
  );
});

app.put('/kelas', async (c) => {
  const json = await c.req.json<{
    kelas_id: number;
    nama: string;
    kuota_praktikan: number;
    mata_kuliah_praktikum: number;
  }>();
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
      nama: json.nama,
      kuota_praktikan: json.kuota_praktikan,
      mata_kuliah_praktikum_id: json.mata_kuliah_praktikum,
    },
  });

  return c.json(
    {
      status: true,
    },
    202,
  );
});

app.delete('/kelas', async (c) => {
  const json = await c.req.json<{
    kelas_id: number;
  }>();
  const kelas = await prisma.kelaspraktikum.findFirst({
    where: {
      id: json.kelas_id,
    },
  });
  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }
  await prisma.kelaspraktikum.delete({
    where: {
      id: json.kelas_id,
    },
  });

  return c.json(
    {
      status: true,
    },
    202,
  );
});

app.get('/kelas/:id', async (c) => {
  const kelasId = +c.req.param('id');
  const kelas = await prisma.kelaspraktikum.findFirst({
    where: {
      id: kelasId,
    },
    select: {
      id: true,
      nama: true,
      kuota_praktikan: true,
      asisten: {
        select: {
          id: true,
          nama: true,
          nim: true,
        },
      },
      matakuliahpraktikum: {
        select: {
          id: true,
          nama: true,
          kode: true,
        },
      },
    },
  });
  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }
  return c.json({
    status: true,
    data: kelas,
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
