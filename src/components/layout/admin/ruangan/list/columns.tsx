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
import EditFormRuanganButton from '../edit-form';

export type AdminRuangan = {
  id: number;
  nama: string;
  email: string;
};

export type Ruangan = {
  id: number;
  nama: string;
  kapasitas: Record<string, number>;
  admin: AdminRuangan;
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
    header: 'Admin Ruangan',
    filterFn: (row, id, value) => {
      if (!Array.isArray(value) || value.length === 0) return true;
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'kuota.komputer',
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
            <DropdownMenuItem
              onClick={(_e) => {
                navigator.clipboard.writeText(ruangan.id.toString());
                toast('ID copied to clipboard', {
                  description: `Ruangan ID ${ruangan.id} has been copied.`,
                });
              }}
            >
              <Copy />
              Copy ID
            </DropdownMenuItem>
            <DeleteConfirmationButton ruangan={[ruangan]} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
