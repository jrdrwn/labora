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

import { columns, Praktikan } from './columns';
import { DataTable } from './data-table';

export default function OverviewLaporan(
  { data }: { data: Praktikan[] } = { data: [] },
) {
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
          <Link href="/asisten/penilaian">
            <Button variant="outline" size="sm">
              Lihat semua
            </Button>
          </Link>
        </CardAction>
      </CardFooter>
    </Card>
  );
}
