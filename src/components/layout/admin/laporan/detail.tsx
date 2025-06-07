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
import { Fragment } from 'react';
import * as XLSX from 'xlsx';

import { LaporanList } from './list/columns';

function exportToExcel() {
  // Ambil tabel HTML
  const table = document.getElementById('tabelku');

  // Konversi ke worksheet
  const worksheet = XLSX.utils.table_to_sheet(table);

  // Buat workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  // Ekspor ke file Excel
  XLSX.writeFile(workbook, 'tabel-export.xlsx');
}
interface Props {
  laporanList: LaporanList;
}

export default function DetailLaporanButton({ laporanList }: Props) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          View
        </DropdownMenuItem>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex items-start justify-start text-start">
          <DrawerTitle>
            Laporan Details for {laporanList.asisten.nama}
          </DrawerTitle>
          <DrawerDescription className="text-start">
            Kelas: {laporanList.kelas.nama} <br />
            Mata Kuliah: {laporanList.mata_kuliah_praktikum.nama}
          </DrawerDescription>
        </DrawerHeader>
        <Table id="tabelku">
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
                          const detail = laporan.detail_penilaian_per_praktikan
                            .find((dp) => dp.praktikan.id === data.praktikan.id)
                            ?.penilaian.find((dp) => dp.tipe === 'responsi');
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DrawerFooter className="flex w-full items-end justify-end">
          <Button
            onClick={exportToExcel}
            variant="outline"
            className="max-w-max"
          >
            Export to Excel
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
