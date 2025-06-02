import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { JWTPayload } from '../../types';
import generateSingleDate from '../../utils/generateSingleDate';

export const jadwal = new Hono().basePath('/jadwal');

jadwal.put(
  '/',
  zValidator(
    'json',
    z.object({
      where: z.object({
        jadwal_id: z.number().int().positive(),
      }),
      update: z.object({
        ruang_id: z.number().int().positive().optional(),
        tanggal_mulai: z.string(),
        jam_mulai: z
          .string()
          .refine((val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
            message: 'Invalid time format',
          }),
        jam_selesai: z
          .string()
          .refine((val) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(val), {
            message: 'Invalid time format',
          }),
      }),
    }),
  ),
  async (c) => {
    const jwtPayload = c.get('jwtPayload') as JWTPayload;
    const json = c.req.valid('json');

    const jadwal = await prisma.jadwal.findFirst({
      where: {
        id: json.where.jadwal_id,
        kelas: {
          asisten_id: jwtPayload.sub,
        },
      },
    });
    if (!jadwal) {
      return c.json({ status: false, message: 'Jadwal not found' }, 404);
    }

    if (jadwal.is_dilaksanakan) {
      return c.json(
        { status: false, message: 'Jadwal sudah dilaksanakan' },
        400,
      );
    }

    const ruang = await prisma.ruangan.findFirst({
      where: {
        id: json.update.ruang_id,
      },
    });
    if (!ruang) {
      return c.json({ status: false, message: 'Ruang not found' }, 404);
    }

    const date = generateSingleDate(
      json.update.tanggal_mulai as unknown as Date,
      json.update.jam_mulai,
      json.update.jam_selesai,
    );

    const endDate = new Date(date.selesai);
    const startDate = new Date(date.mulai);
    startDate.setSeconds(startDate.getSeconds() + 1);
    endDate.setSeconds(endDate.getSeconds() - 1);

    const existingBookings = await prisma.jadwal.findMany({
      where: {
        id: {
          not: json.where.jadwal_id,
        },
        ruang_id: json.update.ruang_id,
        mulai: {
          lte: endDate,
        },
        selesai: {
          gte: startDate,
        },
      },
    });

    if (existingBookings.length > 0) {
      return c.json({ status: false, message: 'Jadwal sudah ada' }, 400);
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
    if (json.update.ruang_id) {
      data = {
        ruang_id: json.update.ruang_id,
        mulai: date.mulai,
        selesai: date.selesai,
      };
    } else {
      data = {
        mulai: date.mulai,
        selesai: date.selesai,
      };
    }

    await prisma.jadwal.update({
      where: {
        id: json.where.jadwal_id,
      },
      data,
    });

    return c.json(
      {
        status: true,
      },
      202,
    );
  },
);

jadwal.get('/single/:id', async (c) => {
  const jadwalId = +c.req.param('id');
  const jadwal = await prisma.jadwal.findFirst({
    where: {
      id: jadwalId,
    },
    select: {
      id: true,
      mulai: true,
      selesai: true,
      is_dilaksanakan: true,
      ruangan: {
        select: {
          id: true,
          nama: true,
        },
      },
      kelas: {
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

jadwal.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const ruangId = c.req.query('ruangId') ? +c.req.query('ruangId')! : undefined;
  const kelasId = c.req.query('kelasId') ? +c.req.query('kelasId')! : undefined;
  const me = c.req.query('me') ? c.req.query('me')! : undefined;

  let where;

  if (me) {
    where = {
      kelas: {
        asisten_id: jwtPayload.sub,
      },
    };
  } else {
    where = {
      ruang_id: ruangId,
      kelas_id: kelasId,
    };
  }

  const jadwal = await prisma.jadwal.findMany({
    where,
    select: {
      id: true,
      mulai: true,
      selesai: true,
      is_dilaksanakan: true,
      ruangan: {
        select: {
          id: true,
          nama: true,
        },
      },
      kelas: {
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
          mata_kuliah: {
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
