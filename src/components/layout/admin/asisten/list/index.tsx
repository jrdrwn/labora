import { Asisten, columns } from './columns';
import { DataTable } from './data-table';

export default function ListAsisten() {
  const data: Asisten[] = [
    ...Array<Asisten>(50)
      .fill({
        id: 0,
        nama: '',
        email: '',
        kelaspraktikum: [],
        komitmen_url: '',
        nim: '',
        status: '',
        pre_mata_kuliah_praktikum: [],
      })
      .map((_, i) => ({
        id: i + 1,
        nama: `Asisten ${i + 1}`,
        email: `asisten${i + 1}@mail.com`,
        nim: `NIM${i + 1}`,
        status: ['pending', 'ditolak', 'diterima'][
          Math.floor(Math.random() * 3)
        ],
        pre_mata_kuliah_praktikum: ['FA123', 'MA2342', 'K3232'].slice(
          0,
          Math.floor(Math.random() * 3) + 1,
        ),
        komitmen_url: `https://komitmen-url-${i + 1}.com`,
        kelaspraktikum: [
          {
            id: i + 1,
            nama: `Kelas Praktikum ${i + 1}`,
          },
        ],
      })),
  ];
  return <DataTable data={data} columns={columns} />;
}
