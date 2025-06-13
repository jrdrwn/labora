'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Praktikan = {
  id: number;
  nim: string;
  nama: string;
  total_nilai: number;
};

export const columns: ColumnDef<Praktikan>[] = [
  {
    accessorKey: 'nim',
    header: 'NIM',
  },
  {
    accessorKey: 'nama',
    header: 'Nama',
  },
  {
    accessorKey: 'total_nilai',
    header: 'Total Nilai',
  },
];
