import { cookies } from 'next/headers';
import { columns, MataKuliah } from './columns';
import { DataTable } from './data-table';

export default async function ListMataKuliah() {
    const _cookies = await cookies();
    const res = await fetch(`${process.env.APP_URL}/api/admin/mata-kuliah`, {
      headers: {
        authorization: `Bearer ${_cookies.get('token')?.value}`,
      },
    });
    const json = await res.json();
    const data = json.data as MataKuliah[];

  return <DataTable data={data} columns={columns} />;
}
