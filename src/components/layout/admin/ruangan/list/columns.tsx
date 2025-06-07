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
import EditFormRuanganButton from '../edit-form';

export type Admin = {
  id: number;
  nama: string;
  email: string;
};

export type Ruangan = {
  id: number;
  nama: string;
  kapasitas: Record<string, number>;
  admin: Admin;
  _count: {
    jadwal: number;
  };
};

export const columns: ColumnDef<Ruangan>[] = [
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
    header: 'Nama Ruangan',
  },
  {
    accessorKey: 'admin.nama',
    header: 'Nama Admin',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'Kuota Komputer',
    accessorKey: 'kuota.komputer',
    accessorFn: (row) => row.kapasitas.komputer,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Kuota Komputer
          <span className="sr-only">Sort by Kuota Komputer</span>
          {{
            asc: <ChevronUp />,
            desc: <ChevronDown />,
          }[column.getIsSorted() as string] || <ChevronsUpDown />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original.kapasitas.komputer;
      return <span className="pl-2">{value}</span>;
    },
  },
  {
    id: 'Jadwal Terkait',
    accessorKey: '_count.jadwal',
    accessorFn: (row) => row._count.jadwal,
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          Jadwal Terkait
          <span className="sr-only">Sort by Jadwal Terkait</span>
          {{
            asc: <ChevronUp />,
            desc: <ChevronDown />,
          }[column.getIsSorted() as string] || <ChevronsUpDown />}
        </Button>
      );
    },
    cell: ({ row }) => {
      const value = row.original._count.jadwal;
      return <span className="pl-2">{value}</span>;
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const ruangan = row.original;

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
            <EditFormRuanganButton ruangan={ruangan} />
            <DeleteConfirmationButton ruangan={[ruangan]} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
