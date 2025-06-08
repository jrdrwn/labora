import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';

export const overview = new Hono().basePath('/overview');

overview.get('/:kelasId', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const kelasId = +c.req.param('kelasId');

  const kelas = await prisma.kelas.findFirst({
    where: { id: kelasId },
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
      jadwal: {
        orderBy: { mulai: 'asc' },
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
          laporan: {
            select: {
              id: true,
              kehadiran: {
                where: {
                  praktikan_id: jwtPayload.sub,
                },
              },
              penilaian: {
                where: {
                  praktikan_id: jwtPayload.sub,
                  nilai: { not: null },
                },
                select: {
                  id: true,
                  tipe: true,
                  nilai: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!kelas) {
    return c.json({ status: false, message: 'Kelas tidak ditemukan' }, 404);
  }

  let total_nilai = 0;
  let sisa_pertemuan_praktikum = 0;
  let ruangUtama = null;
  let jadwal_selanjutnya = null;
  const penilaian_kehadiran = [];
  const jadwal_sendiri = [];

  for (const jadwal of kelas.jadwal) {
    const ruang = jadwal.ruangan;

    // Set ruang pertama (default)
    if (!ruangUtama && ruang) {
      ruangUtama = ruang;
    }

    // Tambahkan ke jadwal_sendiri
    jadwal_sendiri.push({
      ruang,
      kelas: {
        id: kelas.id,
        nama: kelas.nama,
      },
      mata_kuliah_praktikum: kelas.mata_kuliah,
      asisten: kelas.asisten,
      detail: {
        id: jadwal.id,
        mulai: jadwal.mulai,
        selesai: jadwal.selesai,
        is_dilaksanakan: jadwal.is_dilaksanakan,
      },
    });

    // Cek jadwal selanjutnya (belum dilaksanakan dan pertama ditemukan)
    if (!jadwal.is_dilaksanakan && !jadwal_selanjutnya) {
      jadwal_selanjutnya = {
        id: jadwal.id,
        mulai: jadwal.mulai,
        selesai: jadwal.selesai,
        is_dilaksanakan: jadwal.is_dilaksanakan,
      };
    }

    // Hitung sisa pertemuan
    if (!jadwal.is_dilaksanakan) {
      sisa_pertemuan_praktikum++;
    }

    // Ambil penilaian dari laporan di jadwal ini
    for (const laporan of jadwal.laporan) {
      const detail = laporan.penilaian.map((p) => {
        total_nilai += p.nilai || 0;
        return {
          id: p.id,
          tipe: p.tipe,
          nilai: p.nilai,
        };
      });

      penilaian_kehadiran.push({
        id: laporan.id,
        kehadiran: laporan.kehadiran[0]?.tipe,
        jadwal: {
          id: jadwal.id,
          mulai: jadwal.mulai,
          selesai: jadwal.selesai,
        },
        detail,
      });
    }
  }

  return c.json({
    status: true,
    data: {
      total_nilai,
      sisa_pertemuan_praktikum,
      kelas: {
        id: kelas.id,
        nama: kelas.nama,
      },
      ruang: ruangUtama,
      mata_kuliah_praktikum: kelas.mata_kuliah,
      jadwal_selanjutnya,
      jadwal_sendiri,
      penilaian_kehadiran,
    },
  });
});
