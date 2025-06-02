import prisma from '@db';
import { Hono } from 'hono';

export const laporan = new Hono().basePath('/laporan');

laporan.get('/', async (c) => {
  const asistenList = await prisma.asisten.findMany({
    include: {
      kelas: {
        include: {
          mata_kuliah: true,
          jadwal: {
            include: {
              ruangan: true,
              laporan: {
                include: {
                  kehadiran: {
                    include: {
                      praktikan: {
                        include: {
                          praktikan_kelas: {
                            include: {
                              kelas: true,
                            },
                          },
                        },
                      },
                    },
                  },
                  penilaian: {
                    include: {
                      praktikan: {
                        include: {
                          praktikan_kelas: true,
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
    for (const kelas of asisten.kelas) {
      const laporanItems = [];

      for (const jadwal of kelas.jadwal) {
        for (const laporan of jadwal.laporan) {
          const detailMap = new Map();

          for (const hadir of laporan.kehadiran) {
            const praktikan = hadir.praktikan;
            if (!praktikan) continue;

            const perangkat =
              praktikan.praktikan_kelas.find((pk) => pk.kelas_id === kelas.id)
                ?.perangkat ?? null;

            detailMap.set(praktikan.id, {
              praktikan: {
                id: praktikan.id,
                nim: praktikan.nim,
                email: praktikan.email,
                nama: praktikan.nama,
                perangkat,
              },
              kehadiran: hadir.tipe,
              penilaian: [],
            });
          }

          for (const nilai of laporan.penilaian) {
            const praktikan = nilai.praktikan;
            if (!praktikan) continue;

            if (!detailMap.has(praktikan.id)) {
              const perangkat =
                praktikan.praktikan_kelas.find((pk) => pk.kelas_id === kelas.id)
                  ?.perangkat ?? null;

              detailMap.set(praktikan.id, {
                praktikan: {
                  id: praktikan.id,
                  nim: praktikan.nim,
                  email: praktikan.email,
                  nama: praktikan.nama,
                  perangkat,
                },
                kehadiran: null,
                penilaian: [],
              });
            }

            detailMap.get(praktikan.id).penilaian.push({
              id: nilai.id,
              tipe: nilai.tipe,
              nilai: nilai.nilai,
            });
          }

          laporanItems.push({
            id: laporan.id,
            judul: laporan.judul,
            bukti_pertemuan: laporan.bukti_pertemuan_url,
            jadwal_praktikum: {
              id: jadwal.id,
              ruang: {
                id: jadwal.ruangan?.id,
                nama: jadwal.ruangan?.nama,
              },
              mulai: jadwal.mulai,
              end: jadwal.selesai,
            },
            detail_penilaian_per_praktikan: Array.from(detailMap.values()),
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
          id: kelas.mata_kuliah?.id ?? null,
          nama: kelas.mata_kuliah?.nama ?? null,
          kode: kelas.mata_kuliah?.kode ?? null,
          kuota_praktikan: kelas.kapasitas_praktikan ?? 0,
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
