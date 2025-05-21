import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';
import generateSingleDate from '../../utils/generateSingleDate';

export const jadwal = new Hono().basePath('/jadwal');

jadwal.put('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
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
      kelaspraktikum: {
        asisten_id: jwtPayload.sub,
      },
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
      id: {
        not: json.jadwal_id,
      },
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

jadwal.get('/single/:id', async (c) => {
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
          asisten: {
            select: {
              id: true,
              nama: true,
              nim: true,
            },
          },
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

jadwal.get('/batch', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const ruangId = c.req.query('ruangId') ? +c.req.query('ruangId')! : undefined;
  const kelasId = c.req.query('kelasId') ? +c.req.query('kelasId')! : undefined;
  const me = c.req.query('me') ? c.req.query('me')! : undefined;

  let where;

  if (me) {
    where = {
      kelaspraktikum: {
        asisten_id: jwtPayload.sub,
      },
    };
  } else {
    where = {
      ruang_id: ruangId,
      kelas_praktikum_id: kelasId,
    };
  }

  const jadwal = await prisma.jadwalpraktikum.findMany({
    where,
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
          matakuliahpraktikum: {
            select: {
              id: true,
              kode: true,
              nama: true,
            },
          },
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
