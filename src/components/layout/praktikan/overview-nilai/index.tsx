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

import { columns, PenilaianKehadiran } from './columns';
import { DataTable } from './data-table';

export default function OverviewNilai({
  data,
}: {
  data: PenilaianKehadiran[];
}) {
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
