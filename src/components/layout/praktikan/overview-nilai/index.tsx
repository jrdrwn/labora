import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { columns, Penilaian } from './columns';
import { DataTable } from './data-table';

export default function OverviewNilai() {
  const data: Penilaian[] = [
    ...Array<Penilaian>(21)
      .fill({
        id: 0,
        jadwal: {
          id: 0,
          mulai: new Date(),
          selesai: new Date(),
        },
        detail: [
          {
            id: 0,
            tipe: 'pretest',
            nilai: 0,
          },
          {
            id: 0,
            tipe: 'praktikum',
            nilai: 0,
          },
          {
            id: 0,
            tipe: 'laporan',
            nilai: 0,
          }
        ],
      })
      .map(
        (_, i) =>
          ({
            id: i + 1,
            jadwal: {
              id: i + 1,
              mulai: new Date(Date.now() - i * 24 * 60 * 60 * 1000), // Simulate different dates
              selesai: new Date(Date.now() - i * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
            },
            detail: [
              {
                id: 1,
                tipe: 'pretest',
                nilai: Math.floor(Math.random() * 100), // Random pretest score
              },
              {
                id: 2,
                tipe: 'praktikum',
                nilai: Math.floor(Math.random() * 100), // Random praktikum score
              },
              {
                id: 3,
                tipe: 'laporan',
                nilai: Math.floor(Math.random() * 100), // Random laporan score
              },
            ],
          }) as Penilaian,
      ),
      {
    id: 22,
    jadwal: {
      id: 22,
      mulai: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // Simulate a date 21 days ago
      selesai: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // 2 hours later
    },
    detail: [
      {
        id: 1,
        tipe: 'responsi',
        nilai: 85, // Example pretest score
      },
    ],
  } as Penilaian,
  ];
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Penilaian setiap pertemuan</CardTitle>
        <CardDescription>
          Daftar penilaian yang telah diberikan pada setiap pertemuan praktikum.
          Nilai responsi akan ditampilkan di bawah tabel.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={data} />
      </CardContent>
      <CardFooter className="justify-end">
        <CardAction>
          <Button variant="outline" size="sm">
            Lihat semua
          </Button>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
