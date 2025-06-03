import { cookies } from 'next/headers';

import { columns, Ruangan } from './columns';
import { DataTable } from './data-table';

export default async function ListRuangan() {
  const _cookies = await cookies();
  const res = await fetch(`${process.env.APP_URL}/api/admin/ruangan`, {
    headers: {
      authorization: `Bearer ${_cookies.get('token')?.value}`,
    },
  });
  const json = await res.json();
  const data = json.data as Ruangan[];
  return <DataTable data={data} columns={columns} />;
}
