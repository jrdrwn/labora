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

import { columns, Praktikan } from './columns';
import { DataTable } from './data-table';

export default function OverviewLaporan() {
  const data: Praktikan[] = [
    ...Array<Praktikan>(21)
      .fill({
        id: 0,
        nim: 'NIM',
        nama: 'Nama',
        total_nilai: 0,
      })
      .map(
        (_, i) =>
          ({
            id: i + 1,
            nim: `NIM ${i + 1}`,
            nama: `Nama ${i + 1}`,
            total_nilai: Math.floor(Math.random() * 100), // Random total nilai for demonstration
          }) as Praktikan,
      ),
  ];
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Top 10 Praktikan</CardTitle>
        <CardDescription>
          Daftar praktikan dengan total nilai tertinggi pada praktikum ini.
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
