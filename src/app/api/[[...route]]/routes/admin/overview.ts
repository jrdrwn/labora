import prisma from '@db';
import { Hono } from 'hono';

export const overview = new Hono().basePath('/overview');

overview.get('/', async (c) => {
  // Jumlah total
  const total_praktikan = await prisma.praktikan.count();
  const total_asisten = await prisma.asisten.count();
  const total_kelas = await prisma.kelas.count();
  const total_ruangan = await prisma.ruangan.count();

  // Ambil dan ubah struktur jadwal
  const jadwalRaw = await prisma.jadwal.findMany({
    where: {
      kelas: {
        asisten_id: {
          not: null,
        },
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

  const jadwal = jadwalRaw.map((j) => ({
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

  // Ambil dan ubah struktur laporan
  const laporanRaw = await prisma.kelas.findMany({
    where: {
      NOT: {
        asisten_id: null,
      },
    },
    select: {
      id: true,
      nama: true,
      kapasitas_praktikan: true,
      mata_kuliah: {
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
      id: k.mata_kuliah?.id,
      nama: k.mata_kuliah?.nama,
      kode: k.mata_kuliah?.kode,
      kapasitas_praktikan: k.kapasitas_praktikan,
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
