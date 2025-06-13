'use client';

import { ColumnDef } from '@tanstack/react-table';

export interface Laporan {
  asisten: Asisten;
  kelas: Kelas;
  mata_kuliah_praktikum: MataKuliahPraktikum;
}

export interface Asisten {
  id: number;
  nim: string;
  email: string;
  nama: string;
  status: string;
}

export interface Kelas {
  id: number;
  nama: string;
}

export interface MataKuliahPraktikum {
  id: number;
  nama: string;
  kode: string;
  kapasitas_praktikan: number;
}

export const columns: ColumnDef<Laporan>[] = [
  {
    accessorKey: 'asisten.nama',
    header: 'Asisten',
  },
  {
    accessorKey: 'kelas.nama',
    header: 'Kelas',
  },
  {
    accessorKey: 'mata_kuliah_praktikum.nama',
    header: 'Mata Kuliah Praktikum',
  },
];
