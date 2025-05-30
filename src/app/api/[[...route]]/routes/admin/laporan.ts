import prisma from '@db';
import { Hono } from 'hono';

export const laporan = new Hono().basePath('/laporan');

laporan.get('/', async (c) => {
  const asistenList = await prisma.asisten.findMany({
    select: {
      id: true,
      nim: true,
      email: true,
      nama: true,
      status: true,
      kelaspraktikum: {
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
          jadwalpraktikum: {
            select: {
              id: true,
              mulai: true,
              selesai: true,
              ruang: {
                select: {
                  id: true,
                  nama: true,
                },
              },
              penilaian: {
                select: {
                  id: true,
                  judul: true,
                  bukti_pertemuan: true,
                  detailpenilaian: {
                    select: {
                      kehadiran: true,
                      tipe: true,
                      nilai: true,
                      penilaian_id: true,
                      praktikan: {
                        select: {
                          id: true,
                          nim: true,
                          email: true,
                          nama: true,
                          kelaspraktikumpraktikan: {
                            select: {
                              perangkat: true,
                            },
                            where: {
                              kelas_praktikum_id: {
                                not: null,
                              },
                            },
                          },
                        },
                      },
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

  const result = [];

  for (const asisten of asistenList) {
    for (const kelas of asisten.kelaspraktikum) {
      const laporanItems = [];

      for (const jadwal of kelas.jadwalpraktikum) {
        for (const penilaian of jadwal.penilaian) {
          const detailPenilaianMap = new Map();

          for (const dp of penilaian.detailpenilaian) {
            const praktikan = dp.praktikan;
            if (!praktikan) continue;
            const praktikanId = praktikan.id;

            if (!detailPenilaianMap.has(praktikanId)) {
              detailPenilaianMap.set(praktikanId, {
                praktikan: {
                  id: praktikan.id,
                  nim: praktikan.nim,
                  email: praktikan.email,
                  nama: praktikan.nama,
                  perangkat: praktikan.kelaspraktikumpraktikan[0]?.perangkat ?? null,
                },
                kehadiran: dp.kehadiran,
                penilaian: [],
              });
            }

            if (dp.tipe && dp.nilai !== null) {
              detailPenilaianMap.get(praktikanId).penilaian.push({
                id: dp.penilaian_id,
                tipe: dp.tipe,
                nilai: dp.nilai,
              });
            }
          }

          laporanItems.push({
            id: penilaian.id,
            judul: penilaian.judul,
            bukti_pertemuan: penilaian.bukti_pertemuan,
            jadwal_praktikum: {
              id: jadwal.id,
              ruang: jadwal.ruang,
              mulai: jadwal.mulai,
              end: jadwal.selesai,
            },
            detail_penilaian_per_praktikan: [...detailPenilaianMap.values()],
          });
        }
      }

      result.push({
        asisten: {
          id: asisten.id,
          nim: asisten.nim,
          email: asisten.email,
          nama: asisten.nama,
          status: asisten.status,
        },
        kelas: {
          id: kelas.id,
          nama: kelas.nama,
        },
        mata_kuliah_praktikum: {
          id: kelas.matakuliahpraktikum?.id ?? null,
          nama: kelas.matakuliahpraktikum?.nama ?? null,
          kode: kelas.matakuliahpraktikum?.kode ?? null,
          kuota_praktikan: kelas.kuota_praktikan,
        },
        laporan: laporanItems,
      });
    }
  }

  return c.json({
    status: true,
    data: result,
  });
});
