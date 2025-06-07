import AdvancedCalendar from '@/components/layout/admin/overview/advanced-calendar';
import OverviewLaporan from '@/components/layout/admin/overview/overview-laporan';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shapes, UserPen, Users, Warehouse } from 'lucide-react';
import { cookies } from 'next/headers';

export default async function AdminPage() {
  const _cookies = await cookies();
  const res = await fetch(`${process.env.APP_URL}/api/admin/overview`, {
    headers: {
      authorization: `Bearer ${_cookies.get('token')?.value}`,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Error: ${json.message || 'Gagal mengambil overview'}`);
  }
  const overview: Data = json.data;
  return (
    <>
      <section className="m-8">
        <div className="grid grid-cols-4 gap-8">
          <Card>
            <CardHeader className="relative pr-16">
              <div className="absolute top-0 right-6 flex items-center justify-center rounded-full bg-secondary p-3">
                <Users className="size-6 text-secondary-foreground" />
              </div>
              <CardTitle>Praktikan</CardTitle>
              <CardDescription>Jumlah praktikan yang terdaftar</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="mr-1 text-6xl font-medium">
                {overview.total_praktikan}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="relative pr-16">
              <div className="absolute top-0 right-6 flex items-center justify-center rounded-full bg-secondary p-3">
                <UserPen className="size-6 text-secondary-foreground" />
              </div>
              <CardTitle>Asisten</CardTitle>
              <CardDescription>
                Jumlah asisten yang lulus seleksi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="mr-1 text-6xl font-medium">
                {overview.total_asisten}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="relative pr-16">
              <div className="absolute top-0 right-6 flex items-center justify-center rounded-full bg-secondary p-3">
                <Shapes className="size-6 text-secondary-foreground" />
              </div>
              <CardTitle>Kelas</CardTitle>
              <CardDescription>
                Jumlah kelas praktikum yang dibuat
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="mr-1 text-6xl font-medium">
                {overview.total_kelas}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="relative pr-16">
              <div className="absolute top-0 right-6 flex items-center justify-center rounded-full bg-secondary p-3">
                <Warehouse className="size-6 text-secondary-foreground" />
              </div>
              <CardTitle>Ruangan</CardTitle>
              <CardDescription>Jumlah ruangan yang tersedia</CardDescription>
            </CardHeader>
            <CardContent>
              <span className="mr-1 text-6xl font-medium">
                {overview.total_ruangan}
              </span>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="m-8">
        <div className="flex gap-8">
          <AdvancedCalendar jadwalList={overview.jadwal} />
          <OverviewLaporan laporan={overview.laporan} />
        </div>
      </section>
    </>
  );
}

export interface Data {
  total_praktikan: number;
  total_asisten: number;
  total_kelas: number;
  total_ruangan: number;
  jadwal: Jadwal[];
  laporan: Laporan[];
}

export interface Jadwal {
  ruang: Kelas;
  kelas: Kelas;
  mata_kuliah_praktikum: MataKuliahPraktikum;
  asisten: JadwalAsisten;
  detail: Detail;
}

export interface JadwalAsisten {
  id: number;
  nim: string;
  nama: string;
}

export interface Detail {
  id: number;
  mulai: Date;
  selesai: Date;
  is_dilaksanakan: boolean;
}

export interface Kelas {
  id: number;
  nama: string;
}

export interface MataKuliahPraktikum {
  id: number;
  kode: string;
  nama: string;
  kapasitas_praktikan: number;
}

export interface Laporan {
  asisten: LaporanAsisten;
  kelas: Kelas;
  mata_kuliah_praktikum: MataKuliahPraktikum;
}

export interface LaporanAsisten {
  id: number;
  nim: string;
  email: string;
  nama: string;
  status: string;
}
