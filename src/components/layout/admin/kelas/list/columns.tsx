'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronsUpDown,
  ChevronUp,
  Copy,
  MoreHorizontal,
} from 'lucide-react';
import { toast } from 'sonner';

import DeleteConfirmationButton from '../delete-confirmation';
import EditFormKelasButton from '../edit-form';

export type AsistenKelas = {
  id: number;
  nama: string;
  nim: string;
};

export type MataKuliah = {
  id: number;
  nama: string;
  kode: string;
};

export type Kelas = {
  id: number;
  nama: string;
  kapasitas_praktikan: number;
  asisten: AsistenKelas | null;
  mata_kuliah: MataKuliah;
};

export const columns: ColumnDef<Kelas>[] = [
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
    accessorKey: 'nama',
    header: 'Nama',
  },
  {
    accessorKey: 'mata_kuliah.nama',
    header: 'Mata Kuliah',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'asisten.nama',
    header: 'Asisten',
    cell: ({ row }) => {
      const asisten = row.original.asisten;
      return asisten ? <span>{asisten.nama}</span> : '-';
    },
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'kapasitas_praktikan',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Kapasitas
          <span className="sr-only">Sort by Kapasitas Praktikan</span>
          {{
            asc: <ChevronUp />,
            desc: <ChevronDown />,
          }[column.getIsSorted() as string] || <ChevronsUpDown />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const kapasitas_praktikan = row.original.kapasitas_praktikan;
      return <span className="pl-2">{kapasitas_praktikan}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const kelas = row.original;

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
            <EditFormKelasButton kelas={kelas} />
            <DropdownMenuItem
              onClick={(_e) => {
                navigator.clipboard.writeText(kelas.id.toString());
                toast('ID copied to clipboard', {
                  description: `Kelas ID ${kelas.id} has been copied.`,
                });
              }}
            >
              <Copy />
              Copy ID
            </DropdownMenuItem>
            <DeleteConfirmationButton listKelas={[kelas]} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
