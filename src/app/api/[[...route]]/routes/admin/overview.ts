import prisma from '@db';
import { Hono } from 'hono';

export const overview = new Hono().basePath('/overview');

overview.get('/', async (c) => {
  const total_praktikan = await prisma.praktikan.count();
  const total_asisten = await prisma.asisten.count();
  const total_kelas = await prisma.kelaspraktikum.count();
  const total_ruangan = await prisma.ruang.count();

  const jadwal = await prisma.jadwalpraktikum.findMany({
    select: {
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
      id: true,
      mulai: true,
      selesai: true,
      status: true,
    },
  });

  const laporan = await prisma.kelaspraktikum.findMany({
    select: {
      asisten: {
        select: {
          id: true,
          nim: true,
          email: true,
          nama: true,
          status: true,
        },
      },
      id: true,
      nama: true,
      kuota_praktikan: true,
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
    data: {
      total_praktikan,
      total_asisten,
      total_kelas,
      total_ruangan,
      jadwal,
      laporan,
    },
  });
});
