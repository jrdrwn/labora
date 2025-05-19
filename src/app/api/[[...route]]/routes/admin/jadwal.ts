import prisma from '@db';
import { Hono } from 'hono';

import generateDates from '../../utils/generateDates';
import generateSingleDate from '../../utils/generateSingleDate';

export const jadwal = new Hono().basePath('/jadwal');

jadwal.get('/', async (c) => {
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

jadwal.post('/single', async (c) => {
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

jadwal.post('/batch', async (c) => {
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

jadwal.put('/', async (c) => {
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

jadwal.delete('/', async (c) => {
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
