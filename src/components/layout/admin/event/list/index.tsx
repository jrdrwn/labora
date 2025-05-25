import { columns, Event } from './columns';
import { DataTable } from './data-table';

export default function ListEvent() {
  const data: Event[] = [
    {
      id: 1,
      nama: 'Pendaftaran Praktikan',
      jenis: 'pendaftaran_praktikan',
      mulai: new Date('2025-01-01'),
      selesai: new Date('2025-02-01'),
      admin: { id: 1, nama: 'Jordi Irawan', email: 'admin@email.com' },
    },
    {
      id: 2,
      nama: 'Pendaftaran Asisten',
      jenis: 'pendaftaran_asisten',
      mulai: new Date('2025-02-01'),
      selesai: new Date('2025-03-01'),
      admin: { id: 1, nama: 'Jordi Irawan', email: 'admin@email.com' },
    },
    {
      id: 3,
      nama: 'Praktikum',
      jenis: 'praktikum',
      mulai: new Date('2025-03-01'),
      selesai: new Date('2025-06-01'),
      admin: { id: 1, nama: 'Jordi Irawan', email: 'admin@email.com' },
    },
  ];
  return <DataTable data={data} columns={columns} />;
}
