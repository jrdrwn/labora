'use client';

import Calendar from '@/components/layout/shared/calendar';
import { EventSourceInput } from '@fullcalendar/core/index.js';

export default function JadwalPage() {
  const events = JADWAL_PRAKTIKUM_FAKE.map((jadwal) => ({
    title: jadwal.kelaspraktikum.nama,
    start: jadwal.mulai,
    end: jadwal.selesai,
    color: jadwal.kelaspraktikum.asisten.id === 1 ? '#3b82f6' : '#10b981',
    editable: jadwal.kelaspraktikum.asisten.id === 1, // Hanya asisten 1 yang bisa mengedit
    className: 'cursor-pointer',
    extendedProps: {
      ...jadwal,
    },
    overlap: false,
  })) as EventSourceInput;
  return (
    <section className="m-8 flex flex-col gap-4 pb-8">
      <Calendar
        className="h-full max-w-full!"
        events={events}
        eventClick={(info) => {
          const jadwal = info.event.extendedProps as JadwalPraktikum;
          alert(
            `Jadwal Praktikum:\n\nKelas: ${jadwal.kelaspraktikum.nama}\nAsisten: ${jadwal.kelaspraktikum.asisten.nama} (${jadwal.kelaspraktikum.asisten.nim})\nMata Kuliah: ${jadwal.kelaspraktikum.matakuliahpraktikum.nama}\nRuang: ${jadwal.ruang.nama}\nMulai: ${new Date(jadwal.mulai).toLocaleString()}\nSelesai: ${new Date(jadwal.selesai).toLocaleString()}`,
          );
        }}
        eventChange={(info) => {
          const jadwal = info.event.extendedProps as JadwalPraktikum;
          alert(
            `Jadwal Praktikum diubah:\n\nKelas: ${jadwal.kelaspraktikum.nama}\nAsisten: ${jadwal.kelaspraktikum.asisten.nama} (${jadwal.kelaspraktikum.asisten.nim})\nMata Kuliah: ${jadwal.kelaspraktikum.matakuliahpraktikum.nama}\nRuang: ${jadwal.ruang.nama}\nMulai: ${new Date(jadwal.mulai).toLocaleString()}\nSelesai: ${new Date(jadwal.selesai).toLocaleString()}`,
          );
        }}
      />
    </section>
  );
}

interface JadwalPraktikum {
  id: number;
  mulai: string;
  selesai: string;
  status: string | null;
  ruang: {
    id: number;
    nama: string;
  };
  kelaspraktikum: {
    id: number;
    nama: string;
    asisten: {
      id: number;
      nama: string;
      nim: string;
    };
    matakuliahpraktikum: {
      id: number;
      kode: string;
      nama: string;
    };
  };
}

const JADWAL_PRAKTIKUM_FAKE: JadwalPraktikum[] = [
  // Asisten 1: Budi Santoso
  {
    id: 1,
    mulai: '2025-05-01T08:00:00.000Z',
    selesai: '2025-05-01T10:00:00.000Z',
    status: 'aktif',
    ruang: { id: 1, nama: 'Lab Komputer 1' },
    kelaspraktikum: {
      id: 1,
      nama: 'Kelas A',
      asisten: { id: 1, nama: 'Budi Santoso', nim: '223010501001' },
      matakuliahpraktikum: { id: 1, kode: 'PM001', nama: 'Pemrograman Dasar' },
    },
  },
  {
    id: 2,
    mulai: '2025-05-08T08:00:00.000Z',
    selesai: '2025-05-08T10:00:00.000Z',
    status: 'aktif',
    ruang: { id: 1, nama: 'Lab Komputer 1' },
    kelaspraktikum: {
      id: 1,
      nama: 'Kelas A',
      asisten: { id: 1, nama: 'Budi Santoso', nim: '223010501001' },
      matakuliahpraktikum: { id: 1, kode: 'PM001', nama: 'Pemrograman Dasar' },
    },
  },
  {
    id: 3,
    mulai: '2025-05-15T08:00:00.000Z',
    selesai: '2025-05-15T10:00:00.000Z',
    status: 'aktif',
    ruang: { id: 1, nama: 'Lab Komputer 1' },
    kelaspraktikum: {
      id: 1,
      nama: 'Kelas A',
      asisten: { id: 1, nama: 'Budi Santoso', nim: '223010501001' },
      matakuliahpraktikum: { id: 1, kode: 'PM001', nama: 'Pemrograman Dasar' },
    },
  },

  // Asisten 2: Siti Aminah
  {
    id: 4,
    mulai: '2025-05-02T09:00:00.000Z',
    selesai: '2025-05-02T11:00:00.000Z',
    status: 'aktif',
    ruang: { id: 2, nama: 'Lab Komputer 2' },
    kelaspraktikum: {
      id: 2,
      nama: 'Kelas B',
      asisten: { id: 2, nama: 'Siti Aminah', nim: '223010501002' },
      matakuliahpraktikum: { id: 2, kode: 'BD001', nama: 'Basis Data' },
    },
  },
  {
    id: 5,
    mulai: '2025-05-09T09:00:00.000Z',
    selesai: '2025-05-09T11:00:00.000Z',
    status: 'aktif',
    ruang: { id: 2, nama: 'Lab Komputer 2' },
    kelaspraktikum: {
      id: 2,
      nama: 'Kelas B',
      asisten: { id: 2, nama: 'Siti Aminah', nim: '223010501002' },
      matakuliahpraktikum: { id: 2, kode: 'BD001', nama: 'Basis Data' },
    },
  },
  {
    id: 6,
    mulai: '2025-05-16T09:00:00.000Z',
    selesai: '2025-05-16T11:00:00.000Z',
    status: 'aktif',
    ruang: { id: 2, nama: 'Lab Komputer 2' },
    kelaspraktikum: {
      id: 2,
      nama: 'Kelas B',
      asisten: { id: 2, nama: 'Siti Aminah', nim: '223010501002' },
      matakuliahpraktikum: { id: 2, kode: 'BD001', nama: 'Basis Data' },
    },
  },

  // Asisten 3: Rizky Pratama
  {
    id: 7,
    mulai: '2025-05-03T13:00:00.000Z',
    selesai: '2025-05-03T15:00:00.000Z',
    status: 'aktif',
    ruang: { id: 3, nama: 'Lab Data Science' },
    kelaspraktikum: {
      id: 3,
      nama: 'Kelas C',
      asisten: { id: 3, nama: 'Rizky Pratama', nim: '223010501003' },
      matakuliahpraktikum: { id: 3, kode: 'DS001', nama: 'Data Science' },
    },
  },
  {
    id: 8,
    mulai: '2025-05-10T13:00:00.000Z',
    selesai: '2025-05-10T15:00:00.000Z',
    status: 'aktif',
    ruang: { id: 3, nama: 'Lab Data Science' },
    kelaspraktikum: {
      id: 3,
      nama: 'Kelas C',
      asisten: { id: 3, nama: 'Rizky Pratama', nim: '223010501003' },
      matakuliahpraktikum: { id: 3, kode: 'DS001', nama: 'Data Science' },
    },
  },
  {
    id: 9,
    mulai: '2025-05-17T13:00:00.000Z',
    selesai: '2025-05-17T15:00:00.000Z',
    status: 'aktif',
    ruang: { id: 3, nama: 'Lab Data Science' },
    kelaspraktikum: {
      id: 3,
      nama: 'Kelas C',
      asisten: { id: 3, nama: 'Rizky Pratama', nim: '223010501003' },
      matakuliahpraktikum: { id: 3, kode: 'DS001', nama: 'Data Science' },
    },
  },
];
