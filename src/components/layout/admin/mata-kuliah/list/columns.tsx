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

import DeleteConfirmationButton from '../delete-confirmation';
import EditFormMataKuliahButton from '../edit-form';

export type Admin = {
  id: number;
  nama: string;
  email: string;
};

export type MataKuliah = {
  id: number;
  nama: string;
  kode: string;
  admin: Admin;
  _count: {
    kelas: number;
  };
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
    id: 'ID',
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
    id: 'Nama Admin',
    accessorKey: 'admin.nama',
    header: 'Nama Admin',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'Kelas',
    accessorKey: '_count.kelas',
    header: 'Kelas Terkait',
    cell: ({ row }) => {
      const kelasCount = row.original._count.kelas;
      return <span className="pl-2">{kelasCount}</span>;
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
            <DeleteConfirmationButton listMataKuliah={[matakuliah]} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
