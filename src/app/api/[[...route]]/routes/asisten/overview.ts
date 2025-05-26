import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';

export const overview = new Hono().basePath('/overview');

overview.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;

  const jumlah_praktikan_belum_dinilai = await prisma.praktikan.count({
    where: {
      kelaspraktikumpraktikan: {
        some: {
          kelaspraktikum: {
            asisten: {
              id: jwtPayload.sub,
            },
          },
        },
      },
      detailpenilaian: {
        some: {
          tipe: { not: null },
          nilai: null,
        },
      },
    },
  });

  const sisa_pertemuan = await prisma.jadwalpraktikum.count({
    where: {
      kelaspraktikum: {
        asisten: {
          id: jwtPayload.sub,
        },
      },
      status: { not: null },
    },
  });

  const kelaspraktikum = await prisma.kelaspraktikum.findMany({
    where: {
      asisten: {
        id: jwtPayload.sub,
      },
    },
    select: {
      id: true,
      nama: true,
    },
  });

  const ruangan = await prisma.ruang.findMany({
    where: {
      jadwalpraktikum: {
        some: {
          kelaspraktikum: {
            asisten: {
              id: jwtPayload.sub,
            },
          },
        },
      },
    },
    select: {
      id: true,
      nama: true,
    },
  });

  const matakuliahpraktikum = await prisma.matakuliahpraktikum.findMany({
    where: {
      kelaspraktikum: {
        some: {
          asisten: {
            id: jwtPayload.sub,
          },
        },
      },
    },
    select: {
      id: true,
      kode: true,
      nama: true,
    },
  });

  const jadwal_selanjutnnya = await prisma.jadwalpraktikum.findFirst({
    where: {
      kelaspraktikum: {
        asisten: {
          id: jwtPayload.sub,
        },
      },
      status: 'belum_dilaksanakan',
    },
    orderBy: {
      mulai: 'asc',
    },
  });

  const jadwal_sendiri = await prisma.jadwalpraktikum.findMany({
    where: {
      kelaspraktikum: {
        asisten: {
          id: jwtPayload.sub,
        },
      },
    },
    select: {
      id: true,
      mulai: true,
      selesai: true,
      status: true,
    },
  });

  const top_praktikan = await prisma.praktikan.findMany({
    where: {
      kelaspraktikumpraktikan: {
        some: {
          kelaspraktikum: {
            asisten: {
              id: jwtPayload.sub,
            },
          },
        },
      },
      detailpenilaian: {
        some: {
          tipe: { not: null },
          nilai: { not: null },
        },
      },
    },
    orderBy: {
      detailpenilaian: {
        _count: 'desc',
      },
    },
    take: 5,
    select: {
      id: true,
      nama: true,
      nim: true,
      detailpenilaian: {
        select: {
          tipe: true,
          nilai: true,
        },
      },
    },
  });

  return c.json({
    status: true,
    data: {
      jumlah_praktikan_belum_dinilai,
      sisa_pertemuan,
      kelaspraktikum,
      ruangan,
      matakuliahpraktikum,
      jadwal_selanjutnnya,
      jadwal_sendiri,
      top_praktikan,
    },
  });
});
