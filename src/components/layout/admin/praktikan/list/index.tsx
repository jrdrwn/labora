import { columns, Praktikan } from './columns';
import { DataTable } from './data-table';

export default function ListPraktikan() {
  const data: Praktikan[] = [
    ...Array<Praktikan>(50)
      .fill({
        id: 0,
        nama: '',
        email: '',
        nim: '',
        kelaspraktikumpraktikan: [
          {
            id: 0,
            perangkat: '',
            kelaspraktikum: {
              id: 0,
              nama: '',
              asisten: {
                id: 0,
                nama: '',
                email: '',
              },
            },
          },
        ],
      })
      .map(
        (_, i) =>
          ({
            id: i + 1,
            nama: `Praktikan ${i + 1}`,
            email: `praktikan${i + 1}@mail.com`,
            nim: `22301050300${i + 1}`,
            kelaspraktikumpraktikan: [
              {
                id: i + 1,
                perangkat: ['laptop', 'komputer'][
                  Math.floor(Math.random() * 2)
                ],
                kelaspraktikum: {
                  id: i + 1,
                  nama: `Kelas Praktikum ${i + 1}`,
                  asisten: {
                    id: i + 1,
                    nama: `Asisten ${i + 1}`,
                    email: `asisten${i + 1}@mail.com`,
                  },
                },
              },
              {
                id: i + 1 + 50,
                perangkat: ['laptop', 'komputer'][
                  Math.floor(Math.random() * 2)
                ],
                kelaspraktikum: {
                  id: i + 1,
                  nama: `Kelas Praktikum ${i + 1}`,
                  asisten: {
                    id: i + 1,
                    nama: `Asisten ${i + 1}`,
                    email: `asisten${i + 1}@mail.com`,
                  },
                },
              },
            ],
          }) as Praktikan,
      ),
  ];
  return <DataTable data={data} columns={columns} />;
}
