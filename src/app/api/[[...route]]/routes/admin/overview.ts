import prisma from '@db';
import { Hono } from 'hono';

export const overview = new Hono().basePath('/overview');

overview.get('/', async (c) => {
  // Jumlah total
  const total_praktikan = await prisma.praktikan.count();
  const total_asisten = await prisma.asisten.count();
  const total_kelas = await prisma.kelaspraktikum.count();
  const total_ruangan = await prisma.ruang.count();

  // Ambil dan ubah struktur jadwal
  const jadwalRaw = await prisma.jadwalpraktikum.findMany({
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

  const jadwal = jadwalRaw.map((j) => ({
    ruang: j.ruang,
    kelas: {
      id: j.kelaspraktikum?.id,
      nama: j.kelaspraktikum?.nama,
    },
    mata_kuliah_praktikum: j.kelaspraktikum?.matakuliahpraktikum,
    asisten: j.kelaspraktikum?.asisten,
    detail: {
      id: j.id,
      mulai: j.mulai,
      selesai: j.selesai,
      status: j.status?.replaceAll('_', ' ') ?? null, // ubah format snake_case jadi readable
    },
  }));

  // Ambil dan ubah struktur laporan
  const laporanRaw = await prisma.kelaspraktikum.findMany({
    select: {
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
      asisten: {
        select: {
          id: true,
          nim: true,
          email: true,
          nama: true,
          status: true,
        },
      },
    },
  });

  const laporan = laporanRaw.map((k) => ({
    asisten: k.asisten,
    kelas: {
      id: k.id,
      nama: k.nama,
    },
    mata_kuliah_praktikum: {
      id: k.matakuliahpraktikum?.id,
      nama: k.matakuliahpraktikum?.nama,
      kode: k.matakuliahpraktikum?.kode,
      kuota_praktikan: k.kuota_praktikan,
    },
  }));

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
