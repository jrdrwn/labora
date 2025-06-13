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

import EditFormEventButton from '../edit-form';
import { StatusSwitch } from './utils';

export type AdminEvent = {
  id: number;
  nama: string;
  email: string;
};

export type JenisEvent =
  | 'pendaftaran_praktikan'
  | 'pendaftaran_asisten'
  | 'praktikum';

export type Event = {
  id: number;
  is_aktif: boolean;
  jenis: JenisEvent;
  mulai: Date;
  selesai: Date;
  admin: AdminEvent;
};

export const columns: ColumnDef<Event>[] = [
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
    id: 'status',
    accessorKey: 'is_aktif',
    header: 'Status',
    cell: ({ row }) => {
      return <StatusSwitch event={row.original} />;
    },
  },
  {
    id: 'admin',
    accessorKey: 'admin.nama',
    header: 'Admin',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'jenis',
    accessorFn: (row) => row.jenis.split('_').join(' '),
    header: 'Jenis',
    cell: ({ row }) => {
      const jenis = row.original.jenis;
      return <span className="capitalize">{jenis.split('_').join(' ')}</span>;
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
      const event = row.original;

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
            <EditFormEventButton event={event} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
