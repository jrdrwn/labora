'use client';

import { ColumnDef } from '@tanstack/react-table';

export type Penilaian = {
  id: number;
  jadwal: {
    id: number;
    mulai: Date;
    selesai: Date;
  };
  detail: {
    id: number;
    tipe: string;
    nilai: number;
  }[];
};

export const columns: ColumnDef<Penilaian>[] = [
  {
    accessorKey: 'jadwal',
    header: 'Pertemuan',
    cell: ({ row }) => {
      const jadwal = row.original.jadwal;
      return `${jadwal.mulai.toLocaleDateString()} ${jadwal.mulai.toLocaleTimeString()} - ${jadwal.selesai.toLocaleTimeString()}`;
    },
  },
  {
    id: 'pretest',
    accessorKey: 'detail',
    header: 'Pretest',
    cell: ({ row }) => {
      const details = row.original.detail;
      return (
        details.filter((detail) => detail.tipe === 'pretest')[0].nilai || 0
      );
    },
  },
  {
    id: 'praktikum',
    accessorKey: 'detail',
    header: 'Praktikum',
    cell: ({ row }) => {
      const details = row.original.detail;
      return (
        details.filter((detail) => detail.tipe === 'praktikum')[0].nilai || 0
      );
    },
  },
  {
    id: 'laporan',
    accessorKey: 'detail',
    header: 'Laporan',
    cell: ({ row }) => {
      const details = row.original.detail;
      return (
        details.filter((detail) => detail.tipe === 'laporan')[0].nilai || 0
      );
    },
  },
];
