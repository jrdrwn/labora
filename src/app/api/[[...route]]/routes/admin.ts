import prisma from '@db';
import bcrypt from 'bcrypt';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { except } from 'hono/combine';
import { jwt, sign } from 'hono/jwt';
import jwtTypes from 'hono/utils/jwt/types';
import { handle } from 'hono/vercel';

import generateDates from '../utils/generateDates';
import generateSingleDate from '../utils/generateSingleDate';

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
    nama: string;
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
      nama: json.nama ? json.nama : undefined,
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
    nama?: string;
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
      nama: json.nama ? json.nama : undefined,
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

app.get('/mata-kuliah-praktikum', async (c) => {
  const mata_kuliah_praktikum = await prisma.matakuliahpraktikum.findMany({
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    where: {
      nama: {
        search: c.req.query('q') ? String(c.req.query('q')) : undefined,
      },
    },
    select: {
      id: true,
      kode: true,
      nama: true,
    },
  });

  return c.json({
    status: true,
    data: mata_kuliah_praktikum,
  });
});

app.post('/mata-kuliah-praktikum', async (c) => {
  const json = await c.req.json<{
    kode: string;
    nama: string;
  }>();

  await prisma.matakuliahpraktikum.create({
    data: {
      kode: json.kode,
      nama: json.nama,
    },
  });
  return c.json(
    {
      status: true,
    },
    201,
  );
});

app.put('/mata-kuliah-praktikum', async (c) => {
  const json = await c.req.json<{
    matakuliahpraktikum_id: number;
    kode: string;
    nama: string;
  }>();
  const matakuliahpraktikum = await prisma.matakuliahpraktikum.findFirst({
    where: {
      id: json.matakuliahpraktikum_id,
    },
  });
  if (!matakuliahpraktikum) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }
  await prisma.matakuliahpraktikum.update({
    where: {
      id: json.matakuliahpraktikum_id,
    },
    data: {
      kode: json.kode,
      nama: json.nama,
    },
  });

  return c.json({
    status: true,
  });
});

app.delete('/mata-kuliah-praktikum', async (c) => {
  const json = await c.req.json<{
    matakuliahpraktikum_id: number;
  }>();
  const matakuliahpraktikum = await prisma.matakuliahpraktikum.findFirst({
    where: {
      id: json.matakuliahpraktikum_id,
    },
  });
  if (!matakuliahpraktikum) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }
  await prisma.matakuliahpraktikum.delete({
    where: {
      id: json.matakuliahpraktikum_id,
    },
  });

  return c.json({
    status: true,
  });
});

app.get('/mata-kuliah-praktikum/:id', async (c) => {
  const matakuliahpraktikum_id = c.req.param('id');
  const matakuliahpraktikum = await prisma.matakuliahpraktikum.findFirst({
    where: {
      id: Number(matakuliahpraktikum_id),
    },
    select: {
      id: true,
      kode: true,
      nama: true,
    },
  });
  if (!matakuliahpraktikum) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }

  return c.json({
    status: true,
    data: matakuliahpraktikum,
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

app.get('/jadwal', async (c) => {
  const jadwal = await prisma.jadwalpraktikum.findMany({
    skip: c.req.query('offset') ? Number(c.req.query('offset')) : 0,
    take: c.req.query('limit') ? Number(c.req.query('limit')) : 10,
    select: {
      id: true,
      mulai: true,
      selesai: true,
      status: true,
      ruang: {
        select: {
          id: true,
          nama: true,
        },
      },
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
    data: jadwal,
  });
});

app.post('/jadwal/single', async (c) => {
  const json = await c.req.json<{
    kelas_praktikum_id: number;
    ruang_id: number;
    tanggal_mulai: Date;
    jam_mulai: string;
    jam_selesai: string;
    hari: number;
  }>();

  const ruang = await prisma.ruang.findFirst({
    where: {
      id: json.ruang_id,
    },
  });

  if (!ruang) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }
  const kelas = await prisma.kelaspraktikum.findFirst({
    where: {
      id: json.kelas_praktikum_id,
    },
  });

  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }

  const date = generateSingleDate(
    json.tanggal_mulai,
    json.jam_mulai,
    json.jam_selesai,
  );
  const endDate = new Date(date.selesai);
  const startDate = new Date(date.mulai);
  startDate.setSeconds(startDate.getSeconds() + 1);
  endDate.setSeconds(endDate.getSeconds() - 1);
  const existingBookings = await prisma.jadwalpraktikum.findMany({
    where: {
      ruang_id: json.ruang_id,
      mulai: {
        lte: endDate,
      },
      selesai: {
        gte: startDate,
      },
    },
  });

  if (existingBookings.length > 0) {
    return c.json({ status: false, message: 'Ruang sudah terdaftar' }, 400);
  }
  // cek jika event sudah ada
  const event = await prisma.event.findFirst({
    where: {
      jenis: 'praktikum',
      mulai: {
        lte: startDate,
      },
      selesai: {
        gte: endDate,
      },
    },
  });

  if (!event) {
    return c.json({ status: false, message: 'Jadwal diluar event' }, 404);
  }

  await prisma.jadwalpraktikum.create({
    data: {
      kelas_praktikum_id: json.kelas_praktikum_id,
      ruang_id: json.ruang_id,
      mulai: date.mulai,
      selesai: date.selesai,
    },
  });

  return c.json(
    {
      status: true,
    },
    201,
  );
});

app.post('/jadwal/batch', async (c) => {
  const json = await c.req.json<{
    kelas_praktikum_id: number;
    ruang_id: number;
    tanggal_mulai: Date;
    jam_mulai: string;
    jam_selesai: string;
    hari: number;
    jumlah_pertemuan: number;
  }>();

  const ruang = await prisma.ruang.findFirst({
    where: {
      id: json.ruang_id,
    },
  });
  if (!ruang) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }

  const kelas = await prisma.kelaspraktikum.findFirst({
    where: {
      id: json.kelas_praktikum_id,
    },
  });
  if (!kelas) {
    return c.json({ status: false, message: 'Kelas not found' }, 404);
  }

  const meetingsDates = generateDates(
    json.tanggal_mulai,
    json.jam_mulai,
    json.jam_selesai,
    json.jumlah_pertemuan,
  );

  const existingBookings = await prisma.jadwalpraktikum.findMany({
    where: {
      ruang_id: json.ruang_id,
      OR: meetingsDates.map((date) => {
        const endDate = new Date(date.selesai);
        const startDate = new Date(date.mulai);
        startDate.setSeconds(startDate.getSeconds() + 1);
        endDate.setSeconds(endDate.getSeconds() - 1);
        return {
          mulai: {
            lte: endDate,
          },
          selesai: {
            gte: startDate,
          },
        };
      }),
    },
  });

  if (existingBookings.length > 0) {
    return c.json({ status: false, message: 'Ruang sudah terdaftar' }, 400);
  }

  // cek jika event sudah ada
  const event = await prisma.event.findFirst({
    where: {
      jenis: 'praktikum',
      mulai: {
        lte: meetingsDates[0].mulai,
      },
      selesai: {
        gte: meetingsDates[meetingsDates.length - 1].selesai,
      },
    },
  });

  if (!event) {
    return c.json({ status: false, message: 'Jadwal diluar event' }, 404);
  }

  await prisma.jadwalpraktikum.createMany({
    data: meetingsDates.map((date) => ({
      kelas_praktikum_id: json.kelas_praktikum_id,
      ruang_id: json.ruang_id,
      mulai: date.mulai,
      selesai: date.selesai,
    })),
  });

  return c.json(
    {
      status: true,
    },
    201,
  );
});

app.put('/jadwal', async (c) => {
  const json = await c.req.json<{
    jadwal_id: number;
    ruang_id?: number;
    tanggal_mulai: Date;
    jam_mulai: string;
    jam_selesai: string;
  }>();
  const jadwal = await prisma.jadwalpraktikum.findFirst({
    where: {
      id: json.jadwal_id,
    },
  });
  if (!jadwal) {
    return c.json({ status: false, message: 'Jadwal not found' }, 404);
  }

  const ruang = await prisma.ruang.findFirst({
    where: {
      id: json.ruang_id,
    },
  });
  if (!ruang) {
    return c.json({ status: false, message: 'Ruang not found' }, 404);
  }

  const date = generateSingleDate(
    json.tanggal_mulai,
    json.jam_mulai,
    json.jam_selesai,
  );

  const endDate = new Date(date.selesai);
  const startDate = new Date(date.mulai);
  startDate.setSeconds(startDate.getSeconds() + 1);
  endDate.setSeconds(endDate.getSeconds() - 1);

  const existingBookings = await prisma.jadwalpraktikum.findMany({
    where: {
      ruang_id: json.ruang_id,
      mulai: {
        lte: endDate,
      },
      selesai: {
        gte: startDate,
      },
    },
  });

  if (existingBookings.length > 0) {
    return c.json({ status: false, message: 'Ruang sudah terdaftar' }, 400);
  }

  // cek jika event sudah ada
  const event = await prisma.event.findFirst({
    where: {
      jenis: 'praktikum',
      mulai: {
        lte: date.mulai,
      },
      selesai: {
        gte: date.selesai,
      },
    },
  });

  if (!event) {
    return c.json({ status: false, message: 'Jadwal diluar event' }, 404);
  }

  let data;
  if (json.ruang_id) {
    data = {
      ruang_id: json.ruang_id,
      mulai: date.mulai,
      selesai: date.selesai,
    };
  } else {
    data = {
      mulai: date.mulai,
      selesai: date.selesai,
    };
  }

  await prisma.jadwalpraktikum.update({
    where: {
      id: json.jadwal_id,
    },
    data,
  });

  return c.json(
    {
      status: true,
    },
    202,
  );
});

app.delete('/jadwal', async (c) => {
  const json = await c.req.json<{
    jadwal_id: number;
  }>();
  const jadwal = await prisma.jadwalpraktikum.findFirst({
    where: {
      id: json.jadwal_id,
    },
  });
  if (!jadwal) {
    return c.json({ status: false, message: 'Jadwal not found' }, 404);
  }
  await prisma.jadwalpraktikum.delete({
    where: {
      id: json.jadwal_id,
    },
  });

  return c.json(
    {
      status: true,
    },
    202,
  );
});

app.get('/jadwal/single/:id', async (c) => {
  const jadwalId = +c.req.param('id');
  const jadwal = await prisma.jadwalpraktikum.findFirst({
    where: {
      id: jadwalId,
    },
    select: {
      id: true,
      mulai: true,
      selesai: true,
      status: true,
      ruang: {
        select: {
          id: true,
          nama: true,
        },
      },
      kelaspraktikum: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });
  if (!jadwal) {
    return c.json({ status: false, message: 'Jadwal not found' }, 404);
  }
  return c.json({
    status: true,
    data: jadwal,
  });
});

app.get('/jadwal/batch', async (c) => {
  const ruangId = c.req.query('ruangId') ? +c.req.query('ruangId')! : undefined;
  const kelasId = c.req.query('kelasId') ? +c.req.query('kelasId')! : undefined;
  const jadwal = await prisma.jadwalpraktikum.findMany({
    where: {
      ruang_id: ruangId,
      kelas_praktikum_id: kelasId,
    },
    select: {
      id: true,
      mulai: true,
      selesai: true,
      status: true,
      ruang: {
        select: {
          id: true,
          nama: true,
        },
      },
      kelaspraktikum: {
        select: {
          id: true,
          nama: true,
        },
      },
    },
  });

  if (!jadwal) {
    return c.json({ status: false, message: 'Jadwal not found' }, 404);
  }

  return c.json({
    status: true,
    data: jadwal,
  });
});

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
