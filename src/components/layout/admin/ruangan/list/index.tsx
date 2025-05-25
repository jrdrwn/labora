import { columns, Ruangan } from './columns';
import { DataTable } from './data-table';

export default function ListRuangan() {
  const data: Ruangan[] = [
    ...Array<Ruangan>(50)
      .fill({
        id: 0,
        nama: '',
        kuota: {},
        admin: { id: 0, nama: '', email: '' },
      })
      .map((_, i) => ({
        id: i + 1,
        nama: `Ruangan ${i + 1}`,
        kuota: {
          komputer: i + 10,
        },
        admin: {
          id: i + 1,
          nama: `Admin ${i + 1}`,
          email: `admin${i + 1}` + '@example.com',
        },
      })),
  ];
  return <DataTable data={data} columns={columns} />;
}
