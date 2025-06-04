import { cookies } from 'next/headers';
import { Asisten, columns } from './columns';
import { DataTable } from './data-table';

export default async function ListAsisten() {
    const _cookies = await cookies();
    const res = await fetch(`${process.env.APP_URL}/api/admin/asisten`, {
      headers: {
        authorization: `Bearer ${_cookies.get('token')?.value}`,
      },
    });
    const json = await res.json();
    const data = json.data as Asisten[];
  return <DataTable data={data} columns={columns} />;
}
