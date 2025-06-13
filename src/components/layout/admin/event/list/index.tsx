import { cookies } from 'next/headers';

import { columns, Event } from './columns';
import { DataTable } from './data-table';

export default async function ListEvent() {
  const _cookies = await cookies();
  const res = await fetch(`${process.env.APP_URL}/api/admin/event`, {
    headers: {
      authorization: `Bearer ${_cookies.get('token')?.value}`,
    },
  });
  const json = await res.json();
  const data = json.data as Event[];
  return <DataTable data={data} columns={columns} />;
}
