import { cookies } from 'next/headers';

import { columns, Kelas } from './columns';
import { DataTable } from './data-table';

export default async function ListKelas() {
  const _cookies = await cookies();
  const res = await fetch(`${process.env.APP_URL}/api/admin/kelas`, {
    headers: {
      authorization: `Bearer ${_cookies.get('token')?.value}`,
    },
  });
  const json = await res.json();
  const data = json.data as Kelas[];
  return <DataTable data={data} columns={columns} />;
}
