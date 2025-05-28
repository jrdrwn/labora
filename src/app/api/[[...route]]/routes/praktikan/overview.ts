import prisma from '@db';
import { Hono } from 'hono';
import { JWTPayload } from '../../types';

export const overview = new Hono().basePath('/overview');

overview.get('/:kelasId', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const kelasId = +c.req.param('kelasId');

  const kelas = await prisma.kelaspraktikum.findFirst({
    where: { id: kelasId },
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
      jadwalpraktikum: {
        orderBy: { mulai: 'asc' },
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
          penilaian: {
            select: {
              id: true,
              detailpenilaian: {
                where: {
                  praktikan_id: jwtPayload.sub,
                  nilai: { not: null },
                  tipe: { not: null },
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
  const penilaian = [];
  const jadwal_sendiri = [];
  let jadwal_selanjutnya = null;

  for (const jadwal of kelas.jadwalpraktikum) {
    const ruang = jadwal.ruang;

    // Data untuk jadwal_sendiri
    jadwal_sendiri.push({
      ruang,
      kelas: {
        id: kelas.id,
        nama: kelas.nama,
      },
      mata_kuliah_praktikum: kelas.matakuliahpraktikum,
      asisten: kelas.asisten,
      jadwal: {
        id: jadwal.id,
        mulai: jadwal.mulai,
        selesai: jadwal.selesai,
        status: jadwal.status?.replaceAll('_', ' ') ?? null,
      },
    });

    // Cek jadwal_selanjutnya (pertama yg belum dilaksanakan)
    if (jadwal.status === 'belum_dilaksanakan' && !jadwal_selanjutnya) {
      jadwal_selanjutnya = {
        id: jadwal.id,
        mulai: jadwal.mulai,
        selesai: jadwal.selesai,
        status: jadwal.status.replaceAll('_', ' '),
      };
    }

    // Cek penilaian
    for (const pen of jadwal.penilaian) {
      const detail = pen.detailpenilaian.map((d) => {
        total_nilai += d.nilai || 0;
        return {
          id: d.id,
          tipe: d.tipe,
          nilai: d.nilai,
        };
      });

      if (detail.length > 0) {
        penilaian.push({
          id: pen.id,
          detail,
        });
      }
    }

    // Hitung sisa pertemuan
    if (jadwal.status === 'belum_dilaksanakan') {
      sisa_pertemuan_praktikum++;
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
      ruang: kelas.jadwalpraktikum[0]?.ruang ?? null,
      mata_kuliah_praktikum: kelas.matakuliahpraktikum,
      jadwal_selanjutnya,
      jadwal_sendiri,
      penilaian,
    },
  });
});
