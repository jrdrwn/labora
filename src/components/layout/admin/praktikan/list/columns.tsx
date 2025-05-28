'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';

export type Asisten = {
  id: number;
  nama: string;
  email: string;
};

export type Kelas = {
  id: number;
  nama: string;
  asisten: Asisten;
};

export type KelasPraktikan = {
  id: number;
  perangkat: string;
  kelaspraktikum: Kelas;
};

export type Praktikan = {
  id: number;
  nama: string;
  nim: string;
  email: string;
  kelaspraktikumpraktikan: KelasPraktikan[];
};

export const columns: ColumnDef<Praktikan>[] = [
  {
    id: 'select',
    maxSize: 10,
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
    header: 'Jumlah Kelas Praktikum',
    cell: ({ row }) => {
      const kelas = row.original.kelaspraktikumpraktikan;
      return <span>{kelas.length}</span>;
    },
  },
  {
    id: 'expander',
    header: 'Detail',
    maxSize: 0,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        onClick={() => row.toggleExpanded()}
        aria-label="Toggle details"
      >
        {row.getIsExpanded() ? <ChevronUp /> : <ChevronDown />}
      </Button>
    ),
  },
];
