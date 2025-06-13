import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Info } from 'lucide-react';
import Link from 'next/link';
import { Fragment, useRef, useState } from 'react';
import * as XLSX from 'xlsx';

import { extractDate, extractTime } from '@/lib/utils';
import { LaporanList } from './list/columns';

interface Props {
  laporanList: LaporanList;
}

export default function DetailLaporanButton({ laporanList }: Props) {
  const [tabActive, setTabActive] = useState<
    'penilaian_kehadiran' | 'judul_bukti'
  >('penilaian_kehadiran');
  const penilaianKehadiranRef = useRef(null);
  const judulBuktiRef = useRef(null);
  function exportToExcel() {
    // Ambil tabel HTML
    const penilaianKehadiranTable =
      penilaianKehadiranRef.current as unknown as HTMLTableElement;
    const judulBuktiTable =
      judulBuktiRef.current as unknown as HTMLTableElement;

    // Konversi ke worksheet
    const worksheet1 = XLSX.utils.table_to_sheet(penilaianKehadiranTable);
    const worksheet2 = XLSX.utils.table_to_sheet(judulBuktiTable);

    // Buat workbook
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet1, 'Penilaian');
    XLSX.utils.book_append_sheet(workbook, worksheet2, 'Pertemuan');

    // Ekspor ke file Excel
    XLSX.writeFile(
      workbook,
      `laporan-${laporanList.kelas.id}-${laporanList.kelas.nama}-${laporanList.asisten.nim}-${laporanList.asisten.nama}-${laporanList.mata_kuliah_praktikum.nama}.xlsx`,
    );
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View
        </DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader hidden>
          <DrawerTitle></DrawerTitle>
          <DrawerDescription></DrawerDescription>
        </DrawerHeader>
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant={
                  tabActive === 'penilaian_kehadiran' ? 'default' : 'ghost'
                }
                onClick={() => setTabActive('penilaian_kehadiran')}
              >
                Penilaian Kehadiran
              </Button>
              <Button
                variant={tabActive === 'judul_bukti' ? 'default' : 'ghost'}
                onClick={() => setTabActive('judul_bukti')}
              >
                Judul & Bukti
              </Button>
            </div>
            <Button
              onClick={exportToExcel}
              variant="outline"
              className="max-w-max"
            >
              Export to Excel
            </Button>
          </div>
          <Table
            hidden={tabActive !== 'penilaian_kehadiran'}
            ref={penilaianKehadiranRef}
          >
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
                {laporanList.laporan.map((laporan, idx) => (
                  <TableHead
                    key={laporan.jadwal_praktikum.id}
                    className="text-center"
                    colSpan={idx === laporanList.laporan.length - 1 ? 2 : 4}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <Info className="size-3" />

                      <span className="font-medium">
                        {`Pertemuan ${idx + 1}`}
                      </span>
                    </div>
                  </TableHead>
                ))}
                <TableHead className="text-center" rowSpan={2}>
                  Total Nilai Pretest
                </TableHead>
                <TableHead className="text-center" rowSpan={2}>
                  Total Nilai Praktikum
                </TableHead>
                <TableHead className="text-center" rowSpan={2}>
                  Total Laporan
                </TableHead>
                <TableHead className="text-center" rowSpan={2}>
                  Hasil Responsi
                </TableHead>
                <TableHead className="text-center" rowSpan={2}>
                  Total Nilai Akhir
                </TableHead>
              </TableRow>
              <TableRow>
                {laporanList.laporan.map((laporan, idx) =>
                  idx === laporanList.laporan.length - 1 ? (
                    <Fragment key={laporan.id + '-responsi'}>
                      <TableHead className="text-center">Kehadiran</TableHead>
                      <TableHead className="text-center">Responsi</TableHead>
                    </Fragment>
                  ) : (
                    <Fragment key={laporan.id}>
                      <TableHead className="text-center">Kehadiran</TableHead>
                      {['pretest', 'laporan', 'praktikum'].map((tipe) => (
                        <TableHead
                          key={laporan.id + '-' + tipe}
                          className="text-center capitalize"
                        >
                          {tipe}
                        </TableHead>
                      ))}
                    </Fragment>
                  ),
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {laporanList.praktikan.map((data, idx) => (
                <TableRow key={data.praktikan.id}>
                  <TableCell className="text-center font-medium">
                    {idx + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    {data.praktikan.nim}
                  </TableCell>
                  <TableCell className="text-center">
                    {data.praktikan.nama}
                  </TableCell>
                  {laporanList.laporan.map((laporan, jidx) =>
                    jidx === laporanList.laporan.length - 1 ? (
                      <Fragment key={laporan.id + '-responsi'}>
                        <TableCell className="text-center">
                          {(() => {
                            const detail =
                              laporan.detail_penilaian_per_praktikan.find(
                                (dp) => dp.praktikan.id === data.praktikan.id,
                              )?.kehadiran;
                            return detail ? (
                              <span className="italic">{detail}</span>
                            ) : (
                              <span className="text-muted-foreground">?</span>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="text-center">
                          {(() => {
                            const detail =
                              laporan.detail_penilaian_per_praktikan
                                .find(
                                  (dp) => dp.praktikan.id === data.praktikan.id,
                                )
                                ?.penilaian.find(
                                  (dp) => dp.tipe === 'responsi',
                                );
                            return detail ? (
                              <span className="italic">{detail.nilai}</span>
                            ) : (
                              <span className="text-muted-foreground">?</span>
                            );
                          })()}
                        </TableCell>
                      </Fragment>
                    ) : (
                      <Fragment key={laporan.id}>
                        <TableCell className="text-center">
                          {(() => {
                            const detail =
                              laporan.detail_penilaian_per_praktikan.find(
                                (dp) => dp.praktikan.id === data.praktikan.id,
                              )?.kehadiran;
                            return detail ? (
                              <span className="italic">{detail}</span>
                            ) : (
                              <span className="text-muted-foreground">?</span>
                            );
                          })()}
                        </TableCell>
                        {['pretest', 'laporan', 'praktikum'].map((tipe) => {
                          const detail = laporan.detail_penilaian_per_praktikan
                            .find((dp) => dp.praktikan.id === data.praktikan.id)
                            ?.penilaian.find((dp) => dp.tipe === tipe);
                          return (
                            <TableCell
                              key={laporan.id + '-' + tipe}
                              className="text-center"
                            >
                              {detail ? (
                                <span className="italic">{detail.nilai}</span>
                              ) : (
                                <span className="text-muted-foreground">?</span>
                              )}
                            </TableCell>
                          );
                        })}
                      </Fragment>
                    ),
                  )}
                  <TableCell className="text-center">
                    {(
                      (RataRataNilaiPerTipe({
                        laporanList,
                        tipe: 'pretest',
                        praktikanId: data.praktikan.id,
                      }) *
                        5) /
                      100
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {(
                      (RataRataNilaiPerTipe({
                        laporanList,
                        tipe: 'praktikum',
                        praktikanId: data.praktikan.id,
                      }) *
                        30) /
                      100
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {(
                      (RataRataNilaiPerTipe({
                        laporanList,
                        tipe: 'laporan',
                        praktikanId: data.praktikan.id,
                      }) *
                        15) /
                      100
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {(
                      (RataRataNilaiPerTipe({
                        laporanList,
                        tipe: 'responsi',
                        praktikanId: data.praktikan.id,
                      }) *
                        50) /
                      100
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-center">
                    {(
                      (RataRataNilaiPerTipe({
                        laporanList,
                        tipe: 'pretest',
                        praktikanId: data.praktikan.id,
                      }) *
                        5) /
                        100 +
                      (RataRataNilaiPerTipe({
                        laporanList,
                        tipe: 'praktikum',
                        praktikanId: data.praktikan.id,
                      }) *
                        30) /
                        100 +
                      (RataRataNilaiPerTipe({
                        laporanList,
                        tipe: 'laporan',
                        praktikanId: data.praktikan.id,
                      }) *
                        15) /
                        100 +
                      (RataRataNilaiPerTipe({
                        laporanList,
                        tipe: 'responsi',
                        praktikanId: data.praktikan.id,
                      }) *
                        50) /
                        100
                    ).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table hidden={tabActive !== 'judul_bukti'} ref={judulBuktiRef}>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">No</TableHead>
                <TableHead className="text-center">Judul</TableHead>
                <TableHead className="text-center">Bukti</TableHead>
                <TableHead className="text-center">Jadwal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {laporanList.laporan.map((laporan, idx) => (
                <TableRow key={laporan.id}>
                  <TableCell className="text-center">{idx + 1}</TableCell>
                  <TableCell className="text-center">{laporan.judul}</TableCell>
                  <TableCell className="text-center">
                    {laporan.bukti_pertemuan ? (
                      <Link
                        href={laporan.bukti_pertemuan}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="italic hover:underline"
                      >
                        Lihat Bukti
                      </Link>
                    ) : (
                      'Tidak ada bukti'
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {extractDate(laporan.jadwal_praktikum.mulai)}{' '}
                    {extractTime(laporan.jadwal_praktikum.mulai)} -{' '}
                    {extractTime(laporan.jadwal_praktikum.end)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <DrawerFooter className="flex w-full items-end justify-end"></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function RataRataNilaiPerTipe({
  laporanList,
  tipe,
  praktikanId,
}: {
  laporanList: LaporanList;
  tipe: 'pretest' | 'laporan' | 'praktikum' | 'responsi';
  praktikanId: number;
}) {
  if (tipe === 'responsi') {
    // Untuk responsi, kita hanya menghitung nilai dari laporan terakhir
    const laporanTerakhir = laporanList.laporan[laporanList.laporan.length - 1];
    const detail = laporanTerakhir.detail_penilaian_per_praktikan.find(
      (dp) => dp.praktikan.id === praktikanId,
    );
    const nilaiResponsi = detail?.penilaian.find(
      (p) => p.tipe === 'responsi',
    )?.nilai;
    return nilaiResponsi ? nilaiResponsi : 0;
  }

  const totalNilai = laporanList.laporan.reduce((total, laporan) => {
    return (
      total +
      laporan.detail_penilaian_per_praktikan
        .filter((dp) => dp.praktikan.id === praktikanId)
        .reduce((subTotal, dp) => {
          const nilai = dp.penilaian.find((p) => p.tipe === tipe)?.nilai;
          return subTotal + (nilai ? nilai : 0);
        }, 0)
    );
  }, 0);

  const totalPertemuan = laporanList.laporan.length - 1; // Mengurangi 1 karena responsi tidak dihitung dalam perhitungan rata-rata

  return totalPertemuan > 0 ? totalNilai / totalPertemuan : 0;
}
