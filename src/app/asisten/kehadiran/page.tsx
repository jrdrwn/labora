'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { useGetCookie } from 'cookies-next/client';
import { Eye, Info, Pencil } from 'lucide-react';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function KehadiranPage() {
  const _cookies = useGetCookie();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [detailKehadiran, setdetailKehadiran] =
    useState<DetailKehadiran | null>(null);

  const getDetailKehadiran = useCallback(async () => {
    const res = await fetch(`/api/asisten/kehadiran`, {
      headers: {
        authorization: `Bearer ${_cookies('token')}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(
        `Error: ${json.message || 'Gagal mengambil detail kehadiran'}`,
      );
      setdetailKehadiran(null);
    }
    setdetailKehadiran(json.data);
  }, [_cookies]);

  useEffect(() => {
    getDetailKehadiran();
  }, [getDetailKehadiran, mode]);

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
                    <TableHead className="text-center">No</TableHead>
                    <TableHead className="text-center">NIM</TableHead>
                    <TableHead className="text-center">Nama</TableHead>
                    {detailKehadiran?.kelas.jadwal.map((jadwal, idx) => (
                      <TableHead key={jadwal.id} className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Info className="size-3" />
                          {detailKehadiran.laporan
                            .filter(
                              (laporan) => laporan.jadwal.id === jadwal.id,
                            )
                            .map((laporan) => (
                              <Fragment key={laporan.id}>
                                <span className="font-medium">
                                  {`Pertemuan ${idx + 1}`}
                                </span>
                              </Fragment>
                            ))}
                          {detailKehadiran.laporan.filter(
                            (laporan) => laporan.jadwal.id === jadwal.id,
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
                  {detailKehadiran?.praktikan.map((praktikan, idx) => (
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
                      {detailKehadiran?.laporan.map((laporan) => {
                        return (
                          <EditCell
                            key={laporan.id}
                            laporan={laporan}
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
                    <TableHead className="text-center">No</TableHead>
                    <TableHead className="text-center">NIM</TableHead>
                    <TableHead className="text-center">Nama</TableHead>
                    {detailKehadiran?.kelas.jadwal.map((jadwal, idx) => (
                      <TableHead key={jadwal.id} className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Info className="size-3" />
                          {detailKehadiran.laporan
                            .filter(
                              (laporan) => laporan.jadwal.id === jadwal.id,
                            )
                            .map((laporan) => (
                              <Fragment key={laporan.id}>
                                <span className="font-medium">
                                  {`Pertemuan ${idx + 1}`}
                                </span>
                              </Fragment>
                            ))}
                          {detailKehadiran.laporan.filter(
                            (laporan) => laporan.jadwal.id === jadwal.id,
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
                  {detailKehadiran?.praktikan.map((praktikan, idx) => (
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
                      {detailKehadiran.kelas.jadwal.map((jadwal) => {
                        const kehadiran = praktikan.kehadiran.find(
                          (dp) => dp.laporan.jadwal_id === jadwal.id,
                        );
                        return (
                          <TableCell key={jadwal.id} className="text-center">
                            {kehadiran ? (
                              <span className="italic">{kehadiran.tipe}</span>
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
  laporan,
  praktikan,
}: {
  laporan: Laporan;
  praktikan: Praktikan;
}) {
  const _cookies = useGetCookie();
  const [tipe, setTipe] = useState<string | null>();

  useEffect(() => {
    const kehadiran = praktikan.kehadiran.find(
      (dp) => dp.laporan.id === laporan.id,
    );
    if (kehadiran) {
      setTipe(kehadiran.tipe);
    } else {
      setTipe(null);
    }
  }, [laporan, praktikan]);

  async function handleTipeChange(value: string) {
    let res;
    if (!value) return;
    if (!tipe) {
      res = await fetch(`/api/asisten/kehadiran`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${_cookies('token')}`,
        },
        body: JSON.stringify({
          laporan_id: laporan.id,
          praktikan_id: praktikan.id,
          tipe: value,
        }),
      });
    } else {
      res = await fetch(`/api/asisten/kehadiran`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${_cookies('token')}`,
        },
        body: JSON.stringify({
          where: {
            kehadiran_id: praktikan.kehadiran.find(
              (dp) => dp.laporan.id === laporan.id,
            )?.id,
          },
          update: {
            tipe: value,
          },
        }),
      });
    }

    const json = await res.json();
    if (!res.ok) {
      toast.error(`Error: ${json.message || 'Gagal mengubah kehadiran'}`);
      return;
    }
    setTipe(value);
    toast.success('Kehadiran berhasil diubah');
  }

  return (
    <TableCell className="text-center">
      <Select
        onValueChange={handleTipeChange}
        value={tipe ? tipe.toLocaleLowerCase() : '?'}
      >
        <SelectTrigger className="mx-auto !h-auto w-full max-w-30 border-none py-0 shadow-none">
          <SelectValue placeholder="Pilih Kehadiran" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="?" disabled>
            ?
          </SelectItem>
          <SelectItem value="hadir">Hadir</SelectItem>
          <SelectItem value="izin">Izin</SelectItem>
          <SelectItem value="alpha">Alpha</SelectItem>
        </SelectContent>
      </Select>
    </TableCell>
  );
}

export interface DetailKehadiran {
  asisten: Asisten;
  kelas: Kelas;
  praktikan: Praktikan[];
  laporan: Laporan[];
}

export interface Asisten {
  id: number;
  nim: string;
  email: string;
  nama: string;
  status: string;
  komitmen_url: string;
  dokumen_pendukung_url: string;
  event_id: number;
  mata_kuliah_pilihan: string[];
}

export interface Kelas {
  id: number;
  nama: string;
  kapasitas_praktikan: number;
  mata_kuliah_id: number;
  asisten_id: number;
  admin_id: number;
  jadwal: Jadwal[];
}

export interface Jadwal {
  id: number;
  mulai: Date;
  selesai: Date;
}

export interface Laporan {
  id: number;
  judul: null | string;
  bukti_pertemuan_url: null | string;
  jadwal: Jadwal;
}

export interface Praktikan {
  id: number;
  nama: string;
  nim: string;
  kehadiran: {
    id: number;
    tipe: string;
    laporan: {
      id: number;
      jadwal_id: number;
    };
  }[];
}
