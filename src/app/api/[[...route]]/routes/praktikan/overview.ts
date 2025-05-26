import prisma from '@db';
import { Hono } from 'hono';

import { JWTPayload } from '../../types';

export const overview = new Hono().basePath('/overview');

overview.get('/:kelasId', async (c) => {
  const jwtPayload = c.get('jwtPayload') as JWTPayload;
  const kelasId = +c.req.param('kelasId');

  // TOFIX
  // Menghitung total nilai praktikan (sementara belum sesuai rumus)

  const kelaspraktikumraw = await prisma.kelaspraktikum.findMany({
    where: {
      id: kelasId,
    },
    select: {
      id: true,
      nama: true,
      asisten: {
        select: {
          id: true,
          nim: true,
          nama: true,
        },
      },
      matakuliahpraktikum: {
        select: {
          id: true,
          kode: true,
          nama: true,
        },
      },
      jadwalpraktikum: {
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
              detailpenilaian: {
                where: {
                  tipe: { not: null },
                  nilai: { not: null },
                  praktikan_id: jwtPayload.sub,
                },
                select: {
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

  const kelaspraktikum = kelaspraktikumraw.map((kelas) => {
    let total_nilai_kelas = 0;
    let sisa_pertemuan = 0;

    kelas.jadwalpraktikum.forEach((jadwal: any) => {
      jadwal.penilaian.forEach((penilaianItem: any) => {
        penilaianItem.detailpenilaian.forEach(
          (detail: { tipe: any; nilai: number | null }) => {
            if (detail.tipe && detail.nilai !== null) {
              total_nilai_kelas += detail.nilai;
            }
          },
        );
      });

      if (jadwal.status && jadwal.status === 'belum_dilaksanakan') {
        sisa_pertemuan += 1;
      }
    });

    return {
      ...kelas,
      total_nilai: total_nilai_kelas,
      sisa_pertemuan,
    };
  });

  return c.json({
    status: true,
    data: {
      kelaspraktikum,
    },
  });
});
