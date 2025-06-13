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
import Link from 'next/link';

import { columns, Laporan } from './columns';
import { DataTable } from './data-table';

export default function OverviewLaporan({ laporan }: { laporan: Laporan[] }) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Laporan</CardTitle>
        <CardDescription>
          Asisten yang sudah menyelesaikan semua jadwal praktikum
        </CardDescription>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={laporan} />
      </CardContent>
      <CardFooter className="justify-end">
        <CardAction>
          <Link href="/admin/laporan">
            <Button variant="outline" size="sm">
              Lihat semua
            </Button>
          </Link>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
