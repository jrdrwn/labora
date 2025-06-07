'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function DetailTable() {
  const _cookies = useGetCookie();
  const [mode, setMode] = useState<'view' | 'edit'>('view');
  const [detailPenilaian, setdetailPenilaian] =
    useState<DetailPenilaian | null>(null);

  const getDetailPenilaian = useCallback(async () => {
    const res = await fetch(`/api/asisten/penilaian`, {
      headers: {
        authorization: `Bearer ${_cookies('token')}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(
        `Error: ${json.message || 'Gagal mengambil detail penilaian'}`,
      );
      setdetailPenilaian(null);
    }
    setdetailPenilaian(json.data);
  }, [_cookies]);

  useEffect(() => {
    getDetailPenilaian();
  }, [getDetailPenilaian, mode]);
  return (
    <>
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
            {mode === 'edit' && <EditTable detailPenilaian={detailPenilaian} />}
            {mode === 'view' && <ViewTable detailPenilaian={detailPenilaian} />}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function MakeTableHeader({
  detailPenilaian,
}: {
  detailPenilaian: DetailPenilaian | null;
}) {
  return (
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
        {detailPenilaian?.kelas.jadwal.map((jadwal, idx) => (
          <TableHead
            key={jadwal.id}
            className="text-center"
            colSpan={idx === detailPenilaian?.kelas.jadwal.length - 1 ? 1 : 3}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Info className="size-3" />
              {detailPenilaian.laporan
                .filter((laporan) => laporan.jadwal.id === jadwal.id)
                .map((penilaian) => (
                  <Fragment key={penilaian.id}>
                    <span className="font-medium">
                      {`Pertemuan ${idx + 1}`}
                    </span>
                  </Fragment>
                ))}
              {detailPenilaian.laporan.filter(
                (laporan) => laporan.jadwal.id === jadwal.id,
              ).length === 0 && (
                <span className="text-muted-foreground">
                  Laporan belum diatur
                </span>
              )}
            </div>
          </TableHead>
        ))}
      </TableRow>
      <TableRow>
        {detailPenilaian?.kelas.jadwal.map((jadwal, idx) =>
          idx === detailPenilaian?.kelas.jadwal.length - 1 ? (
            <TableHead key={jadwal.id + '-responsi'} className="text-center">
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
  );
}

function MakeListPraktikanTableCell({
  praktikan,
  idx,
}: {
  praktikan: Praktikan;
  idx: number;
}) {
  return (
    <>
      <TableCell className="text-center font-medium">{idx + 1}</TableCell>
      <TableCell className="text-center">{praktikan.nim}</TableCell>
      <TableCell className="text-center">{praktikan.nama}</TableCell>
    </>
  );
}

function ViewTable({
  detailPenilaian,
}: {
  detailPenilaian: DetailPenilaian | null;
}) {
  return (
    <Table>
      <MakeTableHeader detailPenilaian={detailPenilaian} />
      <TableBody>
        {detailPenilaian?.praktikan.map((praktikan, idx) => (
          <TableRow key={praktikan.id}>
            <MakeListPraktikanTableCell praktikan={praktikan} idx={idx} />
            {detailPenilaian?.kelas.jadwal.map((jadwal, jidx) =>
              jidx === detailPenilaian?.kelas.jadwal.length - 1 ? (
                <TableCell
                  key={jadwal.id + '-responsi'}
                  className="text-center"
                >
                  {(() => {
                    const detail = praktikan.penilaian.find(
                      (dp) =>
                        dp.laporan.jadwal_id === jadwal.id &&
                        dp.tipe === 'responsi',
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
                  const detail = praktikan.penilaian.find(
                    (dp) =>
                      dp.laporan.jadwal_id === jadwal.id && dp.tipe === tipe,
                  );
                  return (
                    <TableCell
                      key={jadwal.id + '-' + tipe}
                      className="text-center"
                    >
                      {detail ? (
                        <span className="italic">{detail.nilai}</span>
                      ) : (
                        <span className="text-muted-foreground">?</span>
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
  );
}

function EditTable({
  detailPenilaian,
}: {
  detailPenilaian: DetailPenilaian | null;
}) {
  return (
    <Table>
      <MakeTableHeader detailPenilaian={detailPenilaian} />
      <TableBody>
        {detailPenilaian?.praktikan.map((praktikan, idx) => (
          <TableRow key={praktikan.id}>
            <MakeListPraktikanTableCell praktikan={praktikan} idx={idx} />
            {detailPenilaian?.laporan.map((laporan, jidx) =>
              jidx === detailPenilaian?.laporan.length - 1 ? (
                <EditCell
                  key={laporan.id + '-responsi'}
                  laporan={laporan}
                  praktikan={praktikan}
                  tipe="responsi"
                />
              ) : (
                ['pretest', 'laporan', 'praktikum'].map((tipe) => (
                  <EditCell
                    key={laporan.id + '-' + tipe}
                    laporan={laporan}
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
  );
}

function EditCell({
  laporan,
  praktikan,
  tipe,
}: {
  laporan: LaporanElement;
  praktikan: Praktikan;
  tipe: string;
}) {
  const _cookies = useGetCookie();
  const [nilai, setNilai] = useState<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const penilaian = praktikan.penilaian.find(
      (dp) => dp.laporan.id === laporan.id && dp.tipe === tipe,
    );
    if (penilaian) {
      setNilai(penilaian.nilai);
    } else {
      setNilai(0);
    }
  }, [laporan.id, praktikan.penilaian, tipe]);

  const handleTipeChange = async (value: number) => {
    if (!value && value !== 0) return;
    const res = await fetch(`/api/asisten/penilaian`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${_cookies('token')}`,
      },
      body: JSON.stringify({
        laporan_id: laporan.id,
        praktikan_id: praktikan.id,
        tipe,
        nilai: value,
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      toast.error(`Error: ${json.message || 'Gagal mengubah penilaian'}`);
      return;
    }
    setNilai(value);
    toast.success('penilaian berhasil diubah');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setNilai(isNaN(value) ? 0 : value);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (!isNaN(value)) {
        handleTipeChange(value);
      }
    }, 600); // 600ms delay
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      const value = parseFloat((e.target as HTMLInputElement).value);
      if (!isNaN(value)) {
        handleTipeChange(value);
      }
    }
  };

  return (
    <TableCell className="text-center">
      <Input
        type="number"
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        value={nilai.toString()}
        className="mx-auto !h-auto w-full max-w-full rounded-none border-none p-0 py-0 text-center shadow-none outline-none focus-visible:ring-0 focus-visible:outline-none"
        max={100}
        min={0}
      />
    </TableCell>
  );
}

export interface DetailPenilaian {
  asisten: Asisten;
  kelas: Kelas;
  praktikan: Praktikan[];
  laporan: LaporanElement[];
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

export interface LaporanElement {
  id: number;
  jadwal_id: number;
  judul: null | string;
  bukti_pertemuan_url: null | string;
  jadwal: Jadwal;
}

export interface Praktikan {
  id: number;
  nama: string;
  nim: string;
  penilaian: Penilaian[];
}

export interface Penilaian {
  laporan: PenilaianLaporan;
  tipe: string;
  nilai: number;
  id: number;
}

export interface PenilaianLaporan {
  id: number;
  jadwal_id: number;
}
