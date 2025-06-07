'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

import DetailLaporanButton from '../detail';

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
    accessorFn: (row) =>
      row.laporan.filter(
        (laporan) => !laporan.judul || !laporan.bukti_pertemuan,
      ).length > 0
        ? 'Belum'
        : 'Sudah',
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
            <DetailLaporanButton laporanList={laporanList} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
