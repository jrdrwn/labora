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

import { columns, Laporan } from './columns';
import { DataTable } from './data-table';

export default function OverviewLaporan() {
  const data: Laporan[] = [
    ...Array<Laporan>(21)
      .fill({
        asisten: '',
        kelas: '',
        mata_kuliah_praktikum: '',
      })
      .map((_, i) => ({
        asisten: `Asisten ${i}`,
        kelas: `Kelas ${i}`,
        mata_kuliah_praktikum: `Mata Kuliah Praktikum ${i}`,
      })),
  ];
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Top 10 Laporan</CardTitle>
        <CardDescription>
          Asisten yang sudah menyelesaikan semua jadwal praktikum
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
