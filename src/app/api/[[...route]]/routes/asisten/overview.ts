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

  const sisa_pertemuan_praktikum = await prisma.jadwalpraktikum.count({
    where: {
      kelaspraktikum: {
        asisten: {
          id: jwtPayload.sub,
        },
      },
      status: 'belum_dilaksanakan',
    },
  });

  const kelas = await prisma.kelaspraktikum.findFirst({
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

  const ruang = await prisma.ruang.findFirst({
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

  const mata_kuliah_praktikum = await prisma.matakuliahpraktikum.findFirst({
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

  const jadwal_selanjutnya = await prisma.jadwalpraktikum.findFirst({
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
    select: {
      id: true,
      mulai: true,
      selesai: true,
      status: true,
    },
  });

  const jadwal_sendiri_raw = await prisma.jadwalpraktikum.findMany({
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
          asisten: {
            select: {
              id: true,
              nim: true,
              nama: true,
            },
          },
        },
      },
    },
  });

  const jadwal_sendiri = jadwal_sendiri_raw.map((j) => ({
    ruang: j.ruang,
    kelas: {
      id: j.kelaspraktikum?.id,
      nama: j.kelaspraktikum?.nama,
    },
    mata_kuliah_praktikum: j.kelaspraktikum?.matakuliahpraktikum,
    asisten: j.kelaspraktikum?.asisten,
    jadwal: {
      id: j.id,
      mulai: j.mulai,
      selesai: j.selesai,
      status: j.status?.replaceAll('_', ' ') ?? null,
    },
  }));

  const top_raw = await prisma.praktikan.findMany({
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
    select: {
      id: true,
      nim: true,
      nama: true,
      detailpenilaian: {
        select: {
          nilai: true,
        },
      },
    },
  });

  const top_praktikan = top_raw
    .map((p) => ({
      id: p.id,
      nim: p.nim,
      nama: p.nama,
      total_nilai: p.detailpenilaian.reduce((sum, d) => sum + (d.nilai || 0), 0),
    }))
    .sort((a, b) => b.total_nilai - a.total_nilai)
    .slice(0, 5);

  return c.json({
    status: true,
    data: {
      jumlah_praktikan_belum_dinilai,
      sisa_pertemuan_praktikum,
      kelas,
      ruang,
      mata_kuliah_praktikum,
      jadwal_selanjutnya: jadwal_selanjutnya
        ? {
            ...jadwal_selanjutnya,
            status: jadwal_selanjutnya.status?.replaceAll('_', ' ') ?? null,
          }
        : null,
      jadwal_sendiri,
      top_praktikan,
    },
  });
});
