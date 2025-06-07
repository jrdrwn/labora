'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ColumnDef } from '@tanstack/react-table';
import { Info, MoreHorizontal } from 'lucide-react';
import { Fragment } from 'react';
import * as XLSX from 'xlsx';

export interface LaporanList {
  asisten: Asisten;
  kelas: Kelas;
  mata_kuliah_praktikum: MataKuliahPraktikum;
  praktikan: Praktikan[];
  laporan: Laporan[];
}

export interface Praktikan {
  praktikan: {
    id: number;
    nim: string;
    email: string;
    nama: string;
  };
  perangkat?: string;
}

export interface Asisten {
  id: number;
  nim: string;
  email: string;
  nama: string;
  status?: string;
  perangkat?: string;
}

export interface Kelas {
  id: number;
  nama: string;
}

export interface Laporan {
  id: number;
  judul: null | string;
  bukti_pertemuan: null | string;
  jadwal_praktikum: JadwalPraktikum;
  detail_penilaian_per_praktikan: DetailPenilaianPerPraktikan[];
}

export interface DetailPenilaianPerPraktikan {
  praktikan: Asisten;
  kehadiran: string;
  penilaian: Penilaian[];
}

export interface Penilaian {
  id: number;
  tipe: string;
  nilai: number;
}

export interface JadwalPraktikum {
  id: number;
  ruang: Kelas;
  mulai: Date;
  end: Date;
}

export interface MataKuliahPraktikum {
  id: number;
  nama: string;
  kode: string;
  kuota_praktikan: number;
}
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
export const columns: ColumnDef<LaporanList>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'asisten.nama',
    header: 'Nama',
  },
  {
    accessorKey: 'kelas.nama',
    header: 'Kelas',
  },
  {
    accessorKey: 'mata_kuliah_praktikum.nama',
    header: 'Mata Kuliah',
  },
  {
    // TODO: Implement a custom filter for status
    accessorKey: 'status',
    header: 'Status',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const laporanList = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Drawer>
              <DrawerTrigger asChild>
                <DropdownMenuItem
                  onSelect={(e) => e.preventDefault()}
                >
                  View
                </DropdownMenuItem>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader className='flex justify-start items-start text-start'>
                  <DrawerTitle>
                    Laporan Details for {laporanList.asisten.nama}
                  </DrawerTitle>
                  <DrawerDescription className='text-start'>
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
                          colSpan={
                            idx === laporanList.laporan.length - 1 ? 2 : 4
                          }
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
                            <TableHead className="text-center">
                              Kehadiran
                            </TableHead>
                            <TableHead className="text-center">
                              Responsi
                            </TableHead>
                          </Fragment>
                        ) : (
                          <Fragment key={laporan.id}>
                            <TableHead className="text-center">
                              Kehadiran
                            </TableHead>
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
                                      (dp) =>
                                        dp.praktikan.id === data.praktikan.id,
                                    )?.kehadiran;
                                  return detail ? (
                                    <span className="italic">{detail}</span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      ?
                                    </span>
                                  );
                                })()}
                              </TableCell>
                              <TableCell className="text-center">
                                {(() => {
                                  const detail =
                                    laporan.detail_penilaian_per_praktikan
                                      .find(
                                        (dp) =>
                                          dp.praktikan.id === data.praktikan.id,
                                      )
                                      ?.penilaian.find(
                                        (dp) => dp.tipe === 'responsi',
                                      );
                                  return detail ? (
                                    <span className="italic">
                                      {detail.nilai}
                                    </span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      ?
                                    </span>
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
                                      (dp) =>
                                        dp.praktikan.id === data.praktikan.id,
                                    )?.kehadiran;
                                  return detail ? (
                                    <span className="italic">{detail}</span>
                                  ) : (
                                    <span className="text-muted-foreground">
                                      ?
                                    </span>
                                  );
                                })()}
                              </TableCell>
                              {['pretest', 'laporan', 'praktikum'].map(
                                (tipe) => {
                                  const detail =
                                    laporan.detail_penilaian_per_praktikan
                                      .find(
                                        (dp) =>
                                          dp.praktikan.id === data.praktikan.id,
                                      )
                                      ?.penilaian.find(
                                        (dp) => dp.tipe === tipe,
                                      );
                                  return (
                                    <TableCell
                                      key={laporan.id + '-' + tipe}
                                      className="text-center"
                                    >
                                      {detail ? (
                                        <span className="italic">
                                          {detail.nilai}
                                        </span>
                                      ) : (
                                        <span className="text-muted-foreground">
                                          ?
                                        </span>
                                      )}
                                    </TableCell>
                                  );
                                },
                              )}
                            </Fragment>
                          ),
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <DrawerFooter className='flex justify-end w-full items-end'>
                  <Button onClick={exportToExcel} variant="outline" className='max-w-max'>
                    Export to Excel
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
