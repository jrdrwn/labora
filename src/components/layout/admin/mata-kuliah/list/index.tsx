import { columns, MataKuliah } from './columns';
import { DataTable } from './data-table';

export default function ListMataKuliah() {
  const data: MataKuliah[] = [
    ...Array<MataKuliah>(50)
      .fill({
        id: 0,
        nama: '',
        kode: '',
        admin: { id: 0, nama: '', email: '' },
      })
      .map((_, i) => ({
        id: i + 1,
        nama: `Mata Kuliah ${i + 1}`,
        kode: `MK${i + 1}`,
        admin: {
          id: i + 1,
          nama: `Admin ${i + 1}`,
          email: `admin${i + 1}` + '@example.com',
        },
      })),
  ];
  return <DataTable data={data} columns={columns} />;
}
