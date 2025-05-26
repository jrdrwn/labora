import prisma from '@db';
import { Hono } from 'hono';

export const laporan = new Hono().basePath('/laporan');

laporan.get('/', async (c) => {
  const asisten = await prisma.asisten.findMany({
    select: {
      id: true,
      nim: true,
      nama: true,
      email: true,
      status: true,
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
          kuota_praktikan: true,
          jadwalpraktikum: {
            select: {
              id: true,
              ruang: {
                select: {
                  id: true,
                  nama: true,
                },
              },
              mulai: true,
              selesai: true,

              penilaian: {
                select: {
                  id: true,
                  judul: true,
                  bukti_pertemuan: true,
                  // detailpenilaian: {
                  //     select: {
                  //         praktikan: {
                  //             select: {
                  //                 id: true,
                  //                 nim: true,
                  //                 email: true,
                  //                 nama: true,
                  //             },
                  //         },
                  //         kehadiran: true,
                  //         penilaian_id: true,
                  //         tipe: true,
                  //         nilai: true,
                  //     },
                  // },
                },
              },
            },
          },
          kelaspraktikumpraktikan: {
            select: {
              praktikan: {
                select: {
                  id: true,
                  nim: true,
                  email: true,
                  nama: true,
                  detailpenilaian: {
                    select: {
                      kehadiran: true,
                      penilaian_id: true,
                      tipe: true,
                      nilai: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return c.json({
    status: true,
    data: {
      asisten,
    },
  });
});
