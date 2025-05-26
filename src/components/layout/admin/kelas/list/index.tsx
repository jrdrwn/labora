import { columns, Kelas } from './columns';
import { DataTable } from './data-table';

export default function ListKelas() {
  const data: Kelas[] = [
    ...Array<Kelas>(50)
      .fill({
        id: 0,
        nama: '',
        kuota_praktikan: 0,
        matakuliahpraktikum: { id: 0, nama: '', kode: '' },
        asisten: { id: 0, nama: '', nim: '' },
      })
      .map((_, i) => ({
        id: i + 1,
        nama: `Kelas ${i + 1}`,
        kuota_praktikan: 30,
        matakuliahpraktikum: {
          id: i + 1,
          nama: `Mata Kuliah ${i + 1}`,
          kode: `MK${i + 1}`,
        },
        asisten:
          i < 5
            ? { id: i + 1, nama: `Asisten ${i + 1}`, nim: `NIM${i + 1}` }
            : null,
      })),
  ];
  return <DataTable data={data} columns={columns} />;
}
