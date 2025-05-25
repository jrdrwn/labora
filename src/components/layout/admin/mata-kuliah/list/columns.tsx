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
import EditFormMataKuliahButton from '../edit-form';

export type AdminMataKuliah = {
  id: number;
  nama: string;
  email: string;
};

export type MataKuliah = {
  id: number;
  nama: string;
  kode: string;
  admin: AdminMataKuliah;
};

export const columns: ColumnDef<MataKuliah>[] = [
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
    header: 'Nama Mata Kuliah',
  },
  {
    accessorKey: 'kode',
    header: 'Kode',
  },
  {
    accessorKey: 'admin.nama',
    header: 'Admin Mata Kuliah',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const matakuliah = row.original;

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
            <EditFormMataKuliahButton matakuliah={matakuliah} />
            <DropdownMenuItem
              onClick={(_e) => {
                navigator.clipboard.writeText(matakuliah.id.toString());
                toast('ID copied to clipboard', {
                  description: `Mata Kuliah ID ${matakuliah.id} has been copied.`,
                });
              }}
            >
              <Copy />
              Copy ID
            </DropdownMenuItem>
            <DeleteConfirmationButton listMataKuliah={[matakuliah]} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
