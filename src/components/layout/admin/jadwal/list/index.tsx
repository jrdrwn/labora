import { cookies } from 'next/headers';

import { columns, Jadwal } from './columns';
import { DataTable } from './data-table';

export default async function ListJadwal() {
  const _cookies = await cookies();
  const res = await fetch(`${process.env.APP_URL}/api/admin/jadwal`, {
    headers: {
      authorization: `Bearer ${_cookies.get('token')?.value}`,
    },
  });
  const json = await res.json();
  const data = json.data as Jadwal[];
  return <DataTable data={data} columns={columns} />;
}
