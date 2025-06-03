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
import EditFormJadwalButton from '../edit-form';

export type Ruangan = {
  id: number;
  nama: string;
};

export type Kelas = {
  id: number;
  nama: string;
};

export type Jadwal = {
  id: number;
  mulai: Date;
  selesai: Date;
  is_dilaksanakan: boolean;
  ruangan: Ruangan;
  kelas: Kelas;
};

export const columns: ColumnDef<Jadwal>[] = [
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
    accessorKey: 'ruangan.nama',
    header: 'Ruangan',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'kelas.nama',
    header: 'Kelas',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'is_dilaksanakan',
    header: 'Status',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const isDilaksanakan = row.original.is_dilaksanakan;
      return (
        <span className="capitalize">
          {isDilaksanakan ?  'Sudah': 'Belum'}
        </span>
      );
    },
  },
  {
    accessorKey: 'mulai',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Mulai
          {{
            asc: <ChevronUp />,
            desc: <ChevronDown />,
          }[column.getIsSorted() as string] || <ChevronsUpDown />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const mulai = new Date(row.original.mulai);
      return (
        <span>
          {mulai.toLocaleDateString(navigator.language, {
            year: '2-digit',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      );
    },
  },
  {
    accessorKey: 'selesai',
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Selesai
          {{
            asc: <ChevronUp />,
            desc: <ChevronDown />,
          }[column.getIsSorted() as string] || <ChevronsUpDown />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const selesai = new Date(row.original.selesai);
      return (
        <span>
          {selesai.toLocaleDateString(navigator.language, {
            year: '2-digit',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const jadwal = row.original;

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
            <EditFormJadwalButton jadwal={jadwal} />
            <DropdownMenuItem
              onClick={(_e) => {
                navigator.clipboard.writeText(jadwal.id.toString());
                toast('ID copied to clipboard', {
                  description: `Jadwal ID ${jadwal.id} has been copied.`,
                });
              }}
            >
              <Copy />
              Copy ID
            </DropdownMenuItem>
            <DeleteConfirmationButton listJadwal={[jadwal]} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
