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
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';

import { extractDate, extractTime } from '@/lib/utils';
import EditFormLaporanButton from '../edit-form';

export interface Laporan {
  id: number;
  judul: string;
  bukti_pertemuan_url: string;
  jadwal: Jadwal;
}

export interface Jadwal {
  id: number;
  mulai: Date;
  selesai: Date;
  is_dilaksanakan: boolean;
}

export const columns: ColumnDef<Laporan>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          ID
          <span className="sr-only">Sort by ID</span>
          {{
            asc: <ChevronUp />,
            desc: <ChevronDown />,
          }[column.getIsSorted() as string] || <ChevronsUpDown />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const id = row.original.id;
      return <span className="pl-2">{id}</span>;
    },
  },
  {
    accessorKey: 'judul',
    header: 'Judul',
    cell: ({ row }) => {
      const judul = row.original.judul;
      return <span>{judul ? judul : '-'}</span>;
    },
  },
  {
    id: 'bukti pertemuan',
    accessorKey: 'bukti_pertemuan_url',
    header: 'Bukti Pertemuan',
    cell: ({ row }) => {
      const url = row.original.bukti_pertemuan_url;
      return (
        <Link
          href={url ? url : '#'}
          target="_blank"
          className="italic hover:underline"
        >
          {url ? 'Lihat Bukti' : 'Tidak Ada Bukti'}
        </Link>
      );
    },
  },
  {
    id: 'status',
    accessorKey: 'jadwal.is_dilaksanakan',
    accessorFn: (row) =>
      row.jadwal.is_dilaksanakan ? 'Sudah Dilaksanakan' : 'Belum Dilaksanakan',
    header: 'Status',
    cell: ({ row }) => {
      const isDilaksanakan = row.original.jadwal?.is_dilaksanakan;
      return (
        <span>
          {isDilaksanakan ? 'Sudah Dilaksanakan' : 'Belum Dilaksanakan'}
        </span>
      );
    },
  },
  {
    accessorKey: 'jadwal',
    header: 'Jadwal',
    cell: ({ row }) => {
      const jadwal = row.original.jadwal;
      return (
        <span>
          {jadwal
            ? `${extractDate(jadwal.mulai)} /  ${extractTime(jadwal.mulai)} - ${extractTime(jadwal.selesai)}`
            : '-'}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const laporan = row.original;

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
            <EditFormLaporanButton laporan={laporan} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
