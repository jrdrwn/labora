'use client';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

export default function KehadiranPage() {
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
      <div className="grid grid-cols-4 gap-2">
        <Card className="col-span-1">
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">No</TableHead>
                  <TableHead className="text-center">NIM</TableHead>
                  <TableHead className="text-center">Nama</TableHead>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardContent>
            {mode === 'edit' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    {JADWAL_PRAKTIKUM_FAKE.map((jadwal) => (
                      <EditHead jadwal={jadwal} key={jadwal.id} />
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PRAKTIKAN_FAKE.map((praktikan) => (
                    <TableRow key={praktikan.id}>
                      {JADWAL_PRAKTIKUM_FAKE.map((jadwal) => {
                        return (
                          <EditCell
                            key={jadwal.id}
                            jadwalId={jadwal.id}
                            praktikan={praktikan}
                          />
                        );
                      })}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
            {mode === 'view' && (
              <Table>
                <TableHeader>
                  <TableRow>
                    {JADWAL_PRAKTIKUM_FAKE.map((jadwal) => (
                      <TableHead key={jadwal.id} className="text-center">
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
                              Kehadiran belum diatur
                            </span>
                          )}
                        </div>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {PRAKTIKAN_FAKE.map((praktikan) => (
                    <TableRow key={praktikan.id}>
                      {JADWAL_PRAKTIKUM_FAKE.map((jadwal) => {
                        const detailPenilaian = praktikan.detailpenilaian.find(
                          (dp) =>
                            dp.penilaian.jadwal_praktikum_id === jadwal.id,
                        );
                        return (
                          <TableCell key={jadwal.id} className="text-center">
                            {detailPenilaian ? (
                              <span className="italic">
                                {detailPenilaian.kehadiran}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">?</span>
                            )}
                          </TableCell>
                        );
                      })}
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
}: {
  jadwalId: number;
  praktikan: Praktikan;
}) {
  const [kehadiran, setKehadiran] = useState<string | null>();

  useEffect(() => {
    const detailPenilaian = praktikan.detailpenilaian.find(
      (dp) => dp.penilaian.jadwal_praktikum_id === jadwalId,
    );
    if (detailPenilaian) {
      setKehadiran(detailPenilaian.kehadiran);
    } else {
      setKehadiran(null);
    }
  }, [jadwalId, praktikan.detailpenilaian]);

  return (
    <TableCell className="text-center">
      <Select
        onValueChange={(value) => {
          setKehadiran(value);
        }}
        value={kehadiran ? kehadiran.toLocaleLowerCase() : '?'}
      >
        <SelectTrigger className="mx-auto !h-auto w-full max-w-30 border-none py-0 shadow-none">
          <SelectValue placeholder="Pilih Kehadiran" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="?">?</SelectItem>
          <SelectItem value="hadir">Hadir</SelectItem>
          <SelectItem value="izin">Izin</SelectItem>
          <SelectItem value="sakit">Sakit</SelectItem>
          <SelectItem value="alpha">Alpha</SelectItem>
        </SelectContent>
      </Select>
    </TableCell>
  );
}

function EditHead({ jadwal }: { jadwal: JadwalPraktikum }) {
  return (
    <TableHead key={jadwal.id} className="text-center">
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
          <ResponsiveModalHeader>
            <ResponsiveModalTitle>Edit Kehadiran</ResponsiveModalTitle>
            <ResponsiveModalDescription>
              Untuk mengatur informasi kehadiran praktikan pada jadwal praktikum
              ini.
            </ResponsiveModalDescription>
          </ResponsiveModalHeader>
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
    kehadiran: string;
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
      {
        id: 101,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[0].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[0].jadwal_praktikum.id,
        },
      },
      {
        id: 102,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[1].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[1].jadwal_praktikum.id,
        },
      },
      {
        id: 103,
        kehadiran: 'Izin',
        penilaian: {
          id: PENILAIAN_FAKE[2].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[2].jadwal_praktikum.id,
        },
      },
      {
        id: 104,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[3].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[3].jadwal_praktikum.id,
        },
      },
      {
        id: 105,
        kehadiran: 'Alpha',
        penilaian: {
          id: PENILAIAN_FAKE[4].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[4].jadwal_praktikum.id,
        },
      },
    ],
  },
  {
    id: 2,
    nama: 'Siti Aminah',
    nim: '220002',
    detailpenilaian: [
      {
        id: 106,
        kehadiran: 'Izin',
        penilaian: {
          id: PENILAIAN_FAKE[0].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[0].jadwal_praktikum.id,
        },
      },
      {
        id: 107,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[1].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[1].jadwal_praktikum.id,
        },
      },
      {
        id: 108,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[2].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[2].jadwal_praktikum.id,
        },
      },
      {
        id: 109,
        kehadiran: 'Alpha',
        penilaian: {
          id: PENILAIAN_FAKE[3].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[3].jadwal_praktikum.id,
        },
      },
      {
        id: 110,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[4].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[4].jadwal_praktikum.id,
        },
      },
    ],
  },
  {
    id: 3,
    nama: 'Rizky Pratama',
    nim: '220003',
    detailpenilaian: [
      {
        id: 111,
        kehadiran: 'Alpha',
        penilaian: {
          id: PENILAIAN_FAKE[0].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[0].jadwal_praktikum.id,
        },
      },
      {
        id: 112,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[1].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[1].jadwal_praktikum.id,
        },
      },
      {
        id: 113,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[2].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[2].jadwal_praktikum.id,
        },
      },
      {
        id: 114,
        kehadiran: 'Sakit',
        penilaian: {
          id: PENILAIAN_FAKE[3].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[3].jadwal_praktikum.id,
        },
      },
      {
        id: 115,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[4].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[4].jadwal_praktikum.id,
        },
      },
    ],
  },
  {
    id: 4,
    nama: 'Dewi Lestari',
    nim: '220004',
    detailpenilaian: [
      {
        id: 116,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[0].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[0].jadwal_praktikum.id,
        },
      },
      {
        id: 117,
        kehadiran: 'Sakit',
        penilaian: {
          id: PENILAIAN_FAKE[1].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[1].jadwal_praktikum.id,
        },
      },
      {
        id: 118,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[2].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[2].jadwal_praktikum.id,
        },
      },
      {
        id: 119,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[3].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[3].jadwal_praktikum.id,
        },
      },
      {
        id: 120,
        kehadiran: 'Izin',
        penilaian: {
          id: PENILAIAN_FAKE[4].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[4].jadwal_praktikum.id,
        },
      },
    ],
  },
  {
    id: 5,
    nama: 'Andi Wijaya',
    nim: '220005',
    detailpenilaian: [
      {
        id: 121,
        kehadiran: 'Sakit',
        penilaian: {
          id: PENILAIAN_FAKE[0].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[0].jadwal_praktikum.id,
        },
      },
      {
        id: 122,
        kehadiran: 'Alpha',
        penilaian: {
          id: PENILAIAN_FAKE[1].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[1].jadwal_praktikum.id,
        },
      },
      {
        id: 123,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[2].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[2].jadwal_praktikum.id,
        },
      },
      {
        id: 124,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[3].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[3].jadwal_praktikum.id,
        },
      },
      {
        id: 125,
        kehadiran: 'Hadir',
        penilaian: {
          id: PENILAIAN_FAKE[4].id,
          jadwal_praktikum_id: PENILAIAN_FAKE[4].jadwal_praktikum.id,
        },
      },
    ],
  },
];
