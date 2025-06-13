import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';

export const overview = new Hono().basePath('/overview');

overview.get('/', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;

  const laporan = await prisma.laporan.findMany({
    where: {
      NOT: {
        judul: null,
        bukti_pertemuan_url: null,
      },
      jadwal: {
        kelas: {
          asisten_id: jwtPayload.sub,
        },
      },
    },
    select: {
      id: true,
      judul: true,
      bukti_pertemuan_url: true,
      penilaian: {
        select: { nilai: true, tipe: true },
      },
    },
  });
  const jumlah_praktikan = await prisma.praktikan.count({
    where: {
      praktikan_kelas: {
        some: {
          kelas: {
            asisten_id: jwtPayload.sub,
          },
        },
      },
    },
  });

  const jumlah_praktikan_belum_dinilai = laporan
    .map((l) =>
      l.penilaian.length
        ? l.penilaian.length % jumlah_praktikan
        : jumlah_praktikan,
    )
    .sort((a, b) => b - a)[0];

  // Sisa jadwal yang belum dilaksanakan
  const sisa_pertemuan_praktikum = await prisma.jadwal.count({
    where: {
      kelas: {
        asisten_id: jwtPayload.sub,
      },
      is_dilaksanakan: false,
    },
  });

  // Kelas milik asisten
  const kelas = await prisma.kelas.findFirst({
    where: {
      asisten_id: jwtPayload.sub,
    },
    select: {
      id: true,
      nama: true,
    },
  });

  // Ruangan yang digunakan oleh jadwal milik asisten
  const ruang = await prisma.ruangan.findFirst({
    where: {
      jadwal: {
        some: {
          kelas: {
            asisten_id: jwtPayload.sub,
          },
        },
      },
    },
    select: {
      id: true,
      nama: true,
    },
  });

  // Mata kuliah dari kelas asisten
  const mata_kuliah_praktikum = await prisma.mata_kuliah.findFirst({
    where: {
      kelas: {
        some: {
          asisten_id: jwtPayload.sub,
        },
      },
    },
    select: {
      id: true,
      kode: true,
      nama: true,
    },
  });

  // Jadwal praktikum berikutnya
  const jadwal_selanjutnya = await prisma.jadwal.findFirst({
    where: {
      kelas: {
        asisten_id: jwtPayload.sub,
      },
      is_dilaksanakan: false,
    },
    orderBy: {
      mulai: 'asc',
    },
    select: {
      id: true,
      mulai: true,
      selesai: true,
      is_dilaksanakan: true,
    },
  });

  // Semua jadwal asisten
  const jadwal_sendiri_raw = await prisma.jadwal.findMany({
    where: {
      kelas: {
        asisten_id: jwtPayload.sub,
      },
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
          mata_kuliah: {
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
    ruang: j.ruangan,
    kelas: {
      id: j.kelas?.id,
      nama: j.kelas?.nama,
    },
    mata_kuliah_praktikum: j.kelas?.mata_kuliah,
    asisten: j.kelas?.asisten,
    detail: {
      id: j.id,
      mulai: j.mulai,
      selesai: j.selesai,
      is_dilaksanakan: j.is_dilaksanakan,
    },
  }));

  // Top 5 praktikan berdasarkan total nilai
  const top_raw = await prisma.praktikan.findMany({
    where: {
      praktikan_kelas: {
        some: {
          kelas: {
            asisten_id: jwtPayload.sub,
          },
        },
      },
      penilaian: {
        some: {
          nilai: {
            not: null,
          },
        },
      },
    },
    select: {
      id: true,
      nim: true,
      nama: true,
      penilaian: {
        where: {
          laporan: {
            jadwal: {
              kelas: {
                asisten_id: jwtPayload.sub,
              },
            },
          },
        },
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
      total_nilai: p.penilaian.reduce((sum, d) => sum + (d.nilai || 0), 0),
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
            id: jadwal_selanjutnya.id,
            mulai: jadwal_selanjutnya.mulai,
            selesai: jadwal_selanjutnya.selesai,
            status: jadwal_selanjutnya.is_dilaksanakan
              ? 'sudah dilaksanakan'
              : 'belum dilaksanakan',
          }
        : null,
      jadwal_sendiri,
      top_praktikan,
    },
  });
});
