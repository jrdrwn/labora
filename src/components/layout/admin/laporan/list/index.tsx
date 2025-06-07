import { cookies } from 'next/headers';

import { columns, LaporanList } from './columns';
import { DataTable } from './data-table';

export default async function ListLaporan() {
  const _cookies = await cookies();
  const res = await fetch(`${process.env.APP_URL}/api/admin/laporan`, {
    headers: {
      authorization: `Bearer ${_cookies.get('token')?.value}`,
    },
  });
  const json = await res.json();
  const data = json.data as LaporanList[];
  return <DataTable data={data} columns={columns} />;
}
