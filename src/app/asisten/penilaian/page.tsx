'use client';

import CreateFormKehadiran from '@/components/layout/asisten/penilaian/create-form-kehadiran';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from '@/components/ui/expansions/responsive-modal';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Edit, Eye, Info, Pencil } from 'lucide-react';
import { Fragment, useEffect, useState } from 'react';

export default function PenilaianPage() {
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  return (
    <section className="m-8 flex flex-col gap-4 pb-8">
      <div className="flex items-center justify-between">
        <div></div>
        <Button onClick={() => setMode(mode === 'view' ? 'edit' : 'view')}>
          {mode === 'view' ? (
            <>
              <Pencil />
              Edit Mode
            </>
          ) : (
            <>
              <Eye />
              View Mode
            </>
          )}
        </Button>
      </div>
      <div className="">
        <Card className="w-full">
          <CardContent>
            {mode === 'edit' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center" rowSpan={2}>
                      No
                    </TableHead>
                    <TableHead className="text-center" rowSpan={2}>
                      NIM
                    </TableHead>
                    <TableHead className="text-center" rowSpan={2}>
                      Nama
                    </TableHead>
                    {JADWAL_PRAKTIKUM_FAKE.map((jadwal, idx) => (
                      <EditHead jadwal={jadwal} key={jadwal.id} idx={idx} />
                    ))}
                  </TableRow>
                  <TableRow>
                    {JADWAL_PRAKTIKUM_FAKE.map((jadwal, idx) =>
                      idx === JADWAL_PRAKTIKUM_FAKE.length - 1 ? (
                        <TableHead
                          key={jadwal.id + '-responsi'}
                          className="text-center px-4"
                        >
                          Responsi
                        </TableHead>
                      ) : (
                        ['pretest', 'laporan', 'praktikum'].map((tipe) => (
                          <TableHead
                            key={jadwal.id + '-' + tipe}
                            className="text-center capitalize px-4"
                          >
                            {tipe}
                          </TableHead>
                        ))
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PRAKTIKAN_FAKE.map((praktikan, idx) => (
                    <TableRow key={praktikan.id}>
                      <TableCell className="text-center font-medium">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        {praktikan.nim}
                      </TableCell>
                      <TableCell className="text-center">
                        {praktikan.nama}
                      </TableCell>
                      {JADWAL_PRAKTIKUM_FAKE.map((jadwal, jidx) =>
                        jidx === JADWAL_PRAKTIKUM_FAKE.length - 1 ? (
                          <EditCell
                            key={jadwal.id + '-responsi'}
                            jadwalId={jadwal.id}
                            praktikan={praktikan}
                            tipe='responsi'
                          />
                        ) : (
                          ['pretest', 'laporan', 'praktikum'].map((tipe) => (
                            <EditCell
                              key={jadwal.id + '-' + tipe}
                              jadwalId={jadwal.id}
                              praktikan={{
                                ...praktikan,
                                // Optionally, you can pass tipe to EditCell if you want to filter by tipe
                              }}
                              tipe={tipe}
                            />
                          ))
                        ),
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {mode === 'view' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center" rowSpan={2}>
                      No
                    </TableHead>
                    <TableHead className="text-center" rowSpan={2}>
                      NIM
                    </TableHead>
                    <TableHead className="text-center" rowSpan={2}>
                      Nama
                    </TableHead>
                    {JADWAL_PRAKTIKUM_FAKE.map((jadwal, idx) => (
                      <TableHead
                        key={jadwal.id}
                        className="text-center"
                        colSpan={
                          idx === JADWAL_PRAKTIKUM_FAKE.length - 1 ? 1 : 3
                        }
                      >
                        <div className="flex items-center justify-center gap-1.5">
                          <Info className="size-3" />
                          {PENILAIAN_FAKE.filter(
                            (penilaian) =>
                              penilaian.jadwal_praktikum.id === jadwal.id,
                          ).map((penilaian) => (
                            <Fragment key={penilaian.id}>
                              <span className="font-medium">
                                {penilaian.judul}
                              </span>
                            </Fragment>
                          ))}
                          {PENILAIAN_FAKE.filter(
                            (penilaian) =>
                              penilaian.jadwal_praktikum.id === jadwal.id,
                          ).length === 0 && (
                            <span className="text-muted-foreground">
                              Penilaian belum diatur
                            </span>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                  <TableRow>
                    {JADWAL_PRAKTIKUM_FAKE.map((jadwal, idx) =>
                      idx === JADWAL_PRAKTIKUM_FAKE.length - 1 ? (
                        <TableHead
                          key={jadwal.id + '-responsi'}
                          className="text-center"
                        >
                          Responsi
                        </TableHead>
                      ) : (
                        ['pretest', 'laporan', 'praktikum'].map((tipe) => (
                          <TableHead
                            key={jadwal.id + '-' + tipe}
                            className="text-center capitalize"
                          >
                            {tipe}
                          </TableHead>
                        ))
                      ),
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PRAKTIKAN_FAKE.map((praktikan, idx) => (
                    <TableRow key={praktikan.id}>
                      <TableCell className="text-center font-medium">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="text-center">
                        {praktikan.nim}
                      </TableCell>
                      <TableCell className="text-center">
                        {praktikan.nama}
                      </TableCell>
                      {JADWAL_PRAKTIKUM_FAKE.map((jadwal, jidx) =>
                        jidx === JADWAL_PRAKTIKUM_FAKE.length - 1 ? (
                          <TableCell
                            key={jadwal.id + '-responsi'}
                            className="text-center"
                          >
                            {(() => {
                              const detail = praktikan.detailpenilaian.find(
                                (dp) =>
                                  dp.penilaian.jadwal_praktikum_id ===
                                    jadwal.id && dp.tipe === 'responsi',
                              );
                              return detail ? (
                                <span className="italic">{detail.nilai}</span>
                              ) : (
                                <span className="text-muted-foreground">?</span>
                              );
                            })()}
                          </TableCell>
                        ) : (
                          ['pretest', 'laporan', 'praktikum'].map((tipe) => {
                            const detail = praktikan.detailpenilaian.find(
                              (dp) =>
                                dp.penilaian.jadwal_praktikum_id ===
                                  jadwal.id && dp.tipe === tipe,
                            );
                            return (
                              <TableCell
                                key={jadwal.id + '-' + tipe}
                                className="text-center"
                              >
                                {detail ? (
                                  <span className="italic">{detail.nilai}</span>
                                ) : (
                                  <span className="text-muted-foreground">
                                    ?
                                  </span>
                                )}
                              </TableCell>
                            );
                          })
                        ),
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function EditCell({
  jadwalId,
  praktikan,
  tipe
}: {
  jadwalId: number;
  praktikan: Praktikan;
  tipe: string
}) {
  const [penilaian, setPenilaian] = useState<number>(0);

  useEffect(() => {
    const detailPenilaian = praktikan.detailpenilaian.find(
      (dp) => dp.penilaian.jadwal_praktikum_id === jadwalId && dp.tipe === tipe,
    );
    if (detailPenilaian) {
      setPenilaian(detailPenilaian.nilai);
    } else {
      setPenilaian(0);
    }
  }, [jadwalId, praktikan.detailpenilaian, tipe]);

  return (
    <TableCell className="text-center">
      <Input
        type="number"
        onChange={(event) => {
          setPenilaian(+event.target.value);
        }}
        value={penilaian.toString()}
        className="mx-auto !h-auto max-w-full text-center w-full border-none py-0 shadow-none p-0 rounded-none outline-none  focus-visible:outline-none focus-visible:ring-0"
        max={100}
        min={0}
      />
    </TableCell>
  );
}

function EditHead({ jadwal, idx }: { jadwal: JadwalPraktikum; idx: number }) {
  return (
    <TableHead
      key={jadwal.id}
      className="text-center"
      colSpan={idx === JADWAL_PRAKTIKUM_FAKE.length - 1 ? 1 : 3}
    >
      <ResponsiveModal>
        <ResponsiveModalTrigger asChild>
          <Button variant={'outline'} size={'sm'}>
            <div className="flex items-center justify-center gap-1.5">
              <Edit className="size-3" />
              {PENILAIAN_FAKE.filter(
                (penilaian) => penilaian.jadwal_praktikum.id === jadwal.id,
              ).map((penilaian) => (
                <Fragment key={penilaian.id}>
                  <span className="font-medium">{penilaian.judul}</span>
                </Fragment>
              ))}
              {PENILAIAN_FAKE.filter(
                (penilaian) => penilaian.jadwal_praktikum.id === jadwal.id,
              ).length === 0 && (
                <span className="text-muted-foreground">
                  Kehadiran belum diatur
                </span>
              )}
            </div>
          </Button>
        </ResponsiveModalTrigger>
        <ResponsiveModalContent>
          <ResponsiveModalHeader className="mb-4">
            <ResponsiveModalTitle>Edit Kehadiran</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              Untuk mengatur informasi kehadiran praktikan pada jadwal praktikum
              ini.
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
          <CreateFormKehadiran
            data={{
              jadwal_praktikum_id: jadwal.id,
            }}
          />
        </ResponsiveModalContent>
      </ResponsiveModal>
    </TableHead>
  );
}

interface JadwalPraktikum {
  id: number;
  mulai: string;
  selesai: string;
}

interface Penilaian {
  id: number;
  judul: string;
  bukti_pertemuan: string;
  jadwal_praktikum: JadwalPraktikum;
}

interface Praktikan {
  id: number;
  nama: string;
  nim: string;
  detailpenilaian: {
    id: number;
    tipe: string;
    nilai: number;
    penilaian: {
      id: number;
      jadwal_praktikum_id: number;
    };
  }[];
}

const JADWAL_PRAKTIKUM_FAKE: JadwalPraktikum[] = [
  { id: 301, mulai: '2025-06-01 08:00', selesai: '2025-06-01 10:00' },
  { id: 302, mulai: '2025-06-02 09:00', selesai: '2025-06-02 11:00' },
  { id: 303, mulai: '2025-06-03 13:00', selesai: '2025-06-03 15:00' },
  { id: 304, mulai: '2025-06-04 10:00', selesai: '2025-06-04 12:00' },
  { id: 305, mulai: '2025-06-05 14:00', selesai: '2025-06-05 16:00' },
  { id: 306, mulai: '2025-06-06 18:00', selesai: '2025-06-06 20:00' },
];

const PENILAIAN_FAKE: Penilaian[] = [
  {
    id: 201,
    judul: 'Pertemuan 1',
    bukti_pertemuan: 'bukti1.jpg',
    jadwal_praktikum: JADWAL_PRAKTIKUM_FAKE[0],
  },
  {
    id: 202,
    judul: 'Pertemuan 2',
    bukti_pertemuan: 'bukti2.jpg',
    jadwal_praktikum: JADWAL_PRAKTIKUM_FAKE[1],
  },
  {
    id: 203,
    judul: 'Pertemuan 3',
    bukti_pertemuan: 'bukti3.jpg',
    jadwal_praktikum: JADWAL_PRAKTIKUM_FAKE[2],
  },
  {
    id: 204,
    judul: 'Pertemuan 4',
    bukti_pertemuan: 'bukti4.jpg',
    jadwal_praktikum: JADWAL_PRAKTIKUM_FAKE[3],
  },
  {
    id: 205,
    judul: 'Pertemuan 5',
    bukti_pertemuan: 'bukti5.jpg',
    jadwal_praktikum: JADWAL_PRAKTIKUM_FAKE[4],
  },
  {
    id: 206,
    judul: 'Pertemuan 5',
    bukti_pertemuan: 'bukti5.jpg',
    jadwal_praktikum: JADWAL_PRAKTIKUM_FAKE[5],
  },
];

const PRAKTIKAN_FAKE: Praktikan[] = [
  {
    id: 1,
    nama: 'Budi Santoso',
    nim: '220001',
    detailpenilaian: [
      // Jadwal 1-5: praktikum, pretest, laporan
      ...[0, 1, 2, 3, 4].flatMap((jadwalIdx) => [
        {
          id: 100 + jadwalIdx * 3 + 1,
          tipe: 'praktikum',
          nilai: 80 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 100 + jadwalIdx * 3 + 2,
          tipe: 'pretest',
          nilai: 70 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 100 + jadwalIdx * 3 + 3,
          tipe: 'laporan',
          nilai: 75 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
      ]),
      // Jadwal 6: responsi
      {
        id: 200,
        tipe: 'responsi',
        nilai: 85,
        penilaian: {
          id: PENILAIAN_FAKE[5].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[5].jadwal_praktikum.id,
        },
      },
    ],
  },
  {
    id: 2,
    nama: 'Siti Aminah',
    nim: '220002',
    detailpenilaian: [
      ...[0, 1, 2, 3, 4].flatMap((jadwalIdx) => [
        {
          id: 110 + jadwalIdx * 3 + 1,
          tipe: 'praktikum',
          nilai: 78 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 110 + jadwalIdx * 3 + 2,
          tipe: 'pretest',
          nilai: 68 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 110 + jadwalIdx * 3 + 3,
          tipe: 'laporan',
          nilai: 72 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
      ]),
      {
        id: 210,
        tipe: 'responsi',
        nilai: 90,
        penilaian: {
          id: PENILAIAN_FAKE[5].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[5].jadwal_praktikum.id,
        },
      },
    ],
  },
  {
    id: 3,
    nama: 'Rizky Pratama',
    nim: '220003',
    detailpenilaian: [
      ...[0, 1, 2, 3, 4].flatMap((jadwalIdx) => [
        {
          id: 120 + jadwalIdx * 3 + 1,
          tipe: 'praktikum',
          nilai: 65 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 120 + jadwalIdx * 3 + 2,
          tipe: 'pretest',
          nilai: 60 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 120 + jadwalIdx * 3 + 3,
          tipe: 'laporan',
          nilai: 70 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
      ]),
      {
        id: 220,
        tipe: 'responsi',
        nilai: 80,
        penilaian: {
          id: PENILAIAN_FAKE[5].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[5].jadwal_praktikum.id,
        },
      },
    ],
  },
  {
    id: 4,
    nama: 'Dewi Lestari',
    nim: '220004',
    detailpenilaian: [
      ...[0, 1, 2, 3, 4].flatMap((jadwalIdx) => [
        {
          id: 130 + jadwalIdx * 3 + 1,
          tipe: 'praktikum',
          nilai: 88 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 130 + jadwalIdx * 3 + 2,
          tipe: 'pretest',
          nilai: 77 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 130 + jadwalIdx * 3 + 3,
          tipe: 'laporan',
          nilai: 80 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
      ]),
      {
        id: 230,
        tipe: 'responsi',
        nilai: 95,
        penilaian: {
          id: PENILAIAN_FAKE[5].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[5].jadwal_praktikum.id,
        },
      },
    ],
  },
  {
    id: 5,
    nama: 'Andi Wijaya',
    nim: '220005',
    detailpenilaian: [
      ...[0, 1, 2, 3, 4].flatMap((jadwalIdx) => [
        {
          id: 140 + jadwalIdx * 3 + 1,
          tipe: 'praktikum',
          nilai: 70 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 140 + jadwalIdx * 3 + 2,
          tipe: 'pretest',
          nilai: 65 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
        {
          id: 140 + jadwalIdx * 3 + 3,
          tipe: 'laporan',
          nilai: 68 + jadwalIdx,
          penilaian: {
            id: PENILAIAN_FAKE[jadwalIdx].id,
            jadwal_praktikum_id: PENILAIAN_FAKE[jadwalIdx].jadwal_praktikum.id,
          },
        },
      ]),
      {
        id: 240,
        tipe: 'responsi',
        nilai: 75,
        penilaian: {
          id: PENILAIAN_FAKE[5].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[5].jadwal_praktikum.id,
        },
      },
    ],
  },
];
