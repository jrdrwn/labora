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

import DetailAsistenButton from '../detail';
import EditFormAsistenButton from '../edit-form';

export type Kelas = {
  id: number;
  nama: string;
  mata_kuliah: MataKuliah;
};

export type MataKuliah = {
  id: number;
  nama: string;
  kode: string;
}

export type Asisten = {
  id: number;
  nama: string;
  nim: string;
  email: string;
  status: string;
  mata_kuliah_pilihan: MataKuliah[];
  komitmen_url: string;
  dokumen_pendukung_url: string;
  kelas: Kelas[];
};

export const columns: ColumnDef<Asisten>[] = [
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
    accessorKey: 'nim',
    header: 'NIM',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'kelas',
    header: 'Kelas',
    cell: ({ row }) => {
      const kelas = row.original.kelas;
      return (
        <div className="flex flex-col">
          {!kelas.length && "-" }
          {kelas.map((k) => (
            <span key={k.id}>{k.nama}</span>
          ))}
        </div>
      );
    },
  },
  {
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
      const asisten = row.original;

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
            <DetailAsistenButton asisten={asisten} />
            <EditFormAsistenButton asisten={asisten} />
            <DropdownMenuItem
              onClick={(_e) => {
                navigator.clipboard.writeText(asisten.id.toString());
                toast('ID copied to clipboard', {
                  description: `Asisten ID ${asisten.id} has been copied.`,
                });
              }}
            >
              <Copy />
              Copy ID
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
