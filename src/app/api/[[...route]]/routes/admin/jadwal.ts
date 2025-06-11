import prisma from '@db';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';

import { EventType } from '../../constants';
import generateDates from '../../utils/generateDates';
import generateSingleDate from '../../utils/generateSingleDate';

export const jadwal = new Hono().basePath('/jadwal');

jadwal.post(
  '/',
  zValidator(
    'json',
    z.object({
      kelas_id: z.number().int().min(1),
      ruang_id: z.number().int().min(1),
      tanggal_mulai: z.coerce.date(),
      jam_mulai: z.string().min(1),
      jam_selesai: z.string().min(1),
      jumlah_pertemuan: z.number().int().min(1).default(1),
    }),
  ),
  async (c) => {
    const json = c.req.valid('json');

    if (json.jam_mulai === json.jam_selesai) {
      return c.json(
        {
          status: false,
          message: 'Jam mulai dan jam selesai tidak boleh sama',
        },
        400,
      );
    }

    if (json.jam_mulai > json.jam_selesai) {
      return c.json(
        {
          status: false,
          message: 'Jam mulai tidak boleh lebih besar dari jam selesai',
        },
        400,
      );
    }

    const ruang = await prisma.ruangan.findFirst({
      where: {
        id: json.ruang_id,
      },
    });
    if (!ruang) {
      return c.json({ status: false, message: 'Ruang not found' }, 404);
    }

    const kelas = await prisma.kelas.findFirst({
      where: {
        id: json.kelas_id,
      },
    });
    if (!kelas) {
      return c.json({ status: false, message: 'Kelas not found' }, 404);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if((ruang.kapasitas as any).mahasiswa <= kelas.kapasitas_praktikan!) {
      return c.json(
        {
          status: false,
          message: 'Ruang tidak cukup untuk menampung jumlah praktikan',
        },
        400,
      );
    }

    const meetingsDates = generateDates(
      json.tanggal_mulai,
      json.jam_mulai,
      json.jam_selesai,
      json.jumlah_pertemuan,
    );

    const existingBookings = await prisma.jadwal.findMany({
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
        jenis: EventType.praktikum,
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

    await prisma.jadwal.createMany({
      data: meetingsDates.map((date) => ({
        kelas_id: json.kelas_id,
        ruang_id: json.ruang_id,
        mulai: date.mulai,
        selesai: date.selesai,
      })),
    });

    const jadwal = await prisma.jadwal.findMany({
      where: {
        kelas_id: json.kelas_id,
        ruang_id: json.ruang_id,
        mulai: {
          in: meetingsDates.map((date) => date.mulai),
        },
      },
      select: {
        id: true,
      },
    });

    await prisma.laporan.createMany({
      data: jadwal.map((j) => ({
        jadwal_id: j.id,
      })),
    });

    return c.json(
      {
        status: true,
      },
      201,
    );
  },
);

jadwal.put(
  '/',
  zValidator(
    'json',
    z.object({
      where: z.object({
        jadwal_id: z.coerce.number().int().positive(),
      }),
      update: z.object({
        ruang_id: z.coerce.number().int().positive().optional(),
        tanggal_mulai: z.coerce.date(),
        jam_mulai: z.string().min(1),
        jam_selesai: z.string().min(1),
      }),
    }),
  ),
  async (c) => {
    const json = c.req.valid('json');
    const jadwal = await prisma.jadwal.findFirst({
      where: {
        id: json.where.jadwal_id,
      },
    });
    if (!jadwal) {
      return c.json({ status: false, message: 'Jadwal not found' }, 404);
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
      json.update.tanggal_mulai,
      json.update.jam_mulai,
      json.update.jam_selesai,
    );

    const endDate = new Date(date.selesai);
    const startDate = new Date(date.mulai);
    startDate.setSeconds(startDate.getSeconds() + 1);
    endDate.setSeconds(endDate.getSeconds() - 1);

    const existingBookings = await prisma.jadwal.findMany({
      where: {
        ruang_id: json.update.ruang_id,
        id: {
          not: json.where.jadwal_id,
        },
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

    const existingJadwal = await prisma.jadwal.findMany({
      where: {
        kelas_id: jadwal.kelas_id,
        mulai: {
          equals: date.mulai,
        },
        selesai: {
          equals: date.selesai,
        },
      },
    });

    if (existingJadwal.length > 1) {
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

jadwal.delete(
  '/',
  zValidator(
    'json',
    z.object({
      jadwal_id: z.coerce.number().int().positive().min(1),
    }),
  ),
  async (c) => {
    const json = c.req.valid('json');
    const jadwal = await prisma.jadwal.findFirst({
      where: {
        id: json.jadwal_id,
      },
    });
    if (!jadwal) {
      return c.json({ status: false, message: 'Jadwal not found' }, 404);
    }
    await prisma.jadwal.delete({
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
  },
);

jadwal.get('/single/:id', async (c) => {
  // TODO: cek
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
  const ruangId = c.req.query('ruangId') ? +c.req.query('ruangId')! : undefined;
  const kelasId = c.req.query('kelasId') ? +c.req.query('kelasId')! : undefined;
  const jadwal = await prisma.jadwal.findMany({
    where: {
      ruang_id: ruangId,
      kelas_id: kelasId,
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
