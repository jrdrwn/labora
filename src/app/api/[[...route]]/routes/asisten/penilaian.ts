import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';

export const penilaian = new Hono().basePath('/penilaian');

penilaian.get('v2', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const asisten = await prisma.asisten.findFirst({
    where: {
      id: jwtPayload.sub,
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

  const kelasPraktikum = await prisma.kelaspraktikum.findFirst({
    where: {
      asisten_id: asisten.id,
    },

    include: {
      jadwalpraktikum: {
        select: {
          id: true,
          mulai: true,
          selesai: true,
        },
      },
    },
  });
  if (!kelasPraktikum) {
    return c.json(
      {
        status: false,
        message: 'Kelas praktikum not found',
      },
      404,
    );
  }

  const penilaian = await prisma.penilaian.findMany({
    where: {
      jadwalpraktikum: {
        kelas_praktikum_id: kelasPraktikum.id,
      },
    },
    include: {
      jadwalpraktikum: {
        select: {
          id: true,
          mulai: true,
          selesai: true,
        },
      },
    },
  });

  if (penilaian.length === 0) {
    return c.json(
      {
        status: false,
        message: 'No penilaian found for this kelas praktikum',
      },
      404,
    );
  }

  const praktikan = await prisma.praktikan.findMany({
    where: {
      kelaspraktikumpraktikan: {
        some: {
          kelas_praktikum_id: kelasPraktikum.id,
        },
      },
    },
    select: {
      id: true,
      nama: true,
      nim: true,
      detailpenilaian: {
        where: {
          kehadiran: {
            equals: null,
          },
        },
        select: {
          penilaian: {
            select: {
              id: true,
              jadwal_praktikum_id: true,
            },
          },
          tipe: true,
          nilai: true,
          id: true,
        },
      },
    },
  });

  if (praktikan.length === 0) {
    return c.json(
      {
        status: false,
        message: 'No praktikan found for this kelas praktikum',
      },
      404,
    );
  }

  return c.json({
    status: true,
    data: {
      asisten,
      kelasPraktikum,
      praktikan,
      penilaian,
    },
  });
});

penilaian.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const jadwalpraktikum = await prisma.jadwalpraktikum.findMany({
    where: {
      kelaspraktikum: {
        asisten_id: jwtPayload.sub,
      },
    },
  });
  const per_pertemuan = await prisma.penilaian.findMany({
    where: {
      OR: jadwalpraktikum.map((jp) => ({
        jadwal_praktikum_id: jp.id,
      })),
    },
    select: {
      id: true,
      judul: true,
      bukti_pertemuan: true,
      jadwalpraktikum: {
        select: {
          id: true,
          mulai: true,
          selesai: true,
        },
      },
    },
  });

  const per_praktikan = await prisma.praktikan.findMany({
    where: {
      kelaspraktikumpraktikan: {
        some: {
          kelaspraktikum: {
            asisten_id: jwtPayload.sub,
          },
        },
      },
    },
    select: {
      id: true,
      nim: true,
      nama: true,
      detailpenilaian: {
        where: {
          kehadiran: {
            equals: null,
          },
        },
        select: {
          penilaian: {
            select: {
              id: true,
            },
          },
          id: true,
          nilai: true,
          tipe: true,
        },
      },
    },
  });

  return c.json({
    status: true,
    data: {
      per_pertemuan,
      per_praktikan,
    },
  });
});

penilaian.post('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    judul: string;
    jadwal_praktikum_id: number;
  }>();

  const jadwalpraktikum = await prisma.jadwalpraktikum.findFirst({
    where: {
      id: json.jadwal_praktikum_id,
      kelaspraktikum: {
        asisten_id: jwtPayload.sub,
      },
    },
  });

  if (!jadwalpraktikum) {
    return c.json(
      {
        status: false,
        message: 'Jadwal praktikum tidak ditemukan',
      },
      404,
    );
  }

  const penilaian = await prisma.penilaian.findFirst({
    where: {
      jadwal_praktikum_id: json.jadwal_praktikum_id,
    },
  });

  if (penilaian) {
    return c.json(
      {
        status: false,
        message: 'Penilaian sudah ada',
      },
      400,
    );
  }

  await prisma.penilaian.create({
    data: {
      judul: json.judul,
      jadwal_praktikum_id: json.jadwal_praktikum_id,
    },
  });

  return c.json(
    {
      status: true,
    },
    201,
  );
});

penilaian.put('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    penilaian_id: number;
    judul?: string;
    bukti_pertemuan_url?: string;
  }>();

  const penilaian = await prisma.penilaian.findFirst({
    where: {
      id: json.penilaian_id,
      jadwalpraktikum: {
        kelaspraktikum: {
          asisten_id: jwtPayload.sub,
        },
      },
    },
  });

  if (!penilaian) {
    return c.json(
      {
        status: false,
        message: 'Penilaian tidak ditemukan',
      },
      404,
    );
  }

  await prisma.penilaian.update({
    where: {
      id: json.penilaian_id,
    },
    data: {
      judul: json.judul,
      bukti_pertemuan: json.bukti_pertemuan_url,
    },
  });

  return c.json(
    {
      status: true,
    },
    201,
  );
});

penilaian.post('/detail', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const json = await c.req.json<{
    praktikan_id: number;
    penilaian_id: number;
    tipe: 'pretest' | 'praktikum' | 'laporan' | 'responsi';
    nilai: number;
  }>();

  const praktikan = await prisma.praktikan.findFirst({
    where: {
      id: json.praktikan_id,
      kelaspraktikumpraktikan: {
        some: {
          kelaspraktikum: {
            asisten_id: jwtPayload.sub,
          },
        },
      },
    },
  });

  if (!praktikan) {
    return c.json(
      {
        status: false,
        message: 'Praktikan tidak ditemukan',
      },
      404,
    );
  }

  const penilaian = await prisma.penilaian.findFirst({
    where: {
      id: json.penilaian_id,
    },
  });

  if (!penilaian) {
    return c.json(
      {
        status: false,
        message: 'Penilaian tidak ditemukan',
      },
      404,
    );
  }

  const detailPenilaian = await prisma.detailpenilaian.findFirst({
    where: {
      penilaian_id: json.penilaian_id,
      praktikan_id: json.praktikan_id,
      tipe: json.tipe,
    },
  });

  await prisma.detailpenilaian.upsert({
    where: {
      id: detailPenilaian?.id || 0,
    },
    create: {
      penilaian_id: json.penilaian_id,
      praktikan_id: json.praktikan_id,
      tipe: json.tipe,
      nilai: json.nilai,
    },
    update: {
      nilai: json.nilai,
      tipe: json.tipe,
    },
  });
  return c.json(
    {
      status: true,
    },
    201,
  );
});
