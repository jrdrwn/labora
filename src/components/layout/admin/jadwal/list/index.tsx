import { columns, Jadwal } from './columns';
import { DataTable } from './data-table';

export default function ListJadwal() {
  const data: Jadwal[] = [
    ...Array<Jadwal>(2)
      .fill({
        id: 0,
        mulai: new Date(),
        selesai: new Date(),
        status: null,
        kelaspraktikum: { id: 0, nama: '' },
        ruang: { id: 0, nama: ''},
      })
      .map((_, i) => ({
        id: i + 1,
        mulai: new Date(2023, 9, 1, 8, 0, 0),
        selesai: new Date(2024, 9, 1, 10, 0, 0),
        status: i % 2 === 0 ? 'belum_dilaksanakan' : 'telah_dilaksanakan',
        kelaspraktikum: { id: i + 1, nama: `Kelas ${i + 1}` },
        ruang: { id: i + 1, nama: `Ruang ${i + 1}` },
      })),
  ];
  return <DataTable data={data} columns={columns} />;
}
