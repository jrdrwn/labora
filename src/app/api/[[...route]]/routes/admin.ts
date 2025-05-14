import prisma from '@db';
import bcrypt from 'bcrypt';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { except } from 'hono/combine';
import { jwt, sign } from 'hono/jwt';
import { handle } from 'hono/vercel';

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
  const jwtPayload = c.get('jwtPayload') as { sub: number; role: string };
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
  const jwtPayload = c.get('jwtPayload') as { sub: number; role: string };

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
  const jwtPayload = c.get('jwtPayload') as { sub: number; role: string };
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
  const jwtPayload = c.get('jwtPayload') as { sub: number; role: string };
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

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
