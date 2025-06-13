import OverviewLaporan from '@/components/layout/asisten/overview-top-asisten';
import AdvancedCalendar from '@/components/layout/shared/advanced-calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { extractDate, extractTime } from '@/lib/utils';
import {
  BookOpen,
  Calendar,
  CalendarClock,
  Shapes,
  Timer,
  UserPen,
  Users,
  Warehouse,
} from 'lucide-react';
import { cookies } from 'next/headers';

export default async function AsistenPage() {
  const _cookies = await cookies();
  const res = await fetch(`${process.env.APP_URL}/api/asisten/overview`, {
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
              <CardTitle>Penilaian</CardTitle>
              <CardDescription>
                Jumlah praktikan yang belum dinilai
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="mr-1 text-6xl font-medium">
                {overview.jumlah_praktikan_belum_dinilai}
              </span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="relative pr-16">
              <div className="absolute top-0 right-6 flex items-center justify-center rounded-full bg-secondary p-3">
                <UserPen className="size-6 text-secondary-foreground" />
              </div>
              <CardTitle>Pertemuan</CardTitle>
              <CardDescription>
                Sisa pertemuan yang belum dilakukan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="mr-1 text-6xl font-medium">
                {overview.sisa_pertemuan_praktikum}
              </span>
            </CardContent>
          </Card>
          <Card className="gap-4">
            <CardHeader className="relative pr-16">
              <div className="absolute top-0 right-6 flex items-center justify-center rounded-full bg-secondary p-3">
                <Shapes className="size-6 text-secondary-foreground" />
              </div>
              <CardTitle>Informasi Kelas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Shapes className="size-4 text-primary" />
                <span className="text-muted-foreground">
                  {overview.kelas.nama}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Warehouse className="size-4 text-primary" />
                <span className="text-muted-foreground">
                  {overview.ruang.nama}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="size-4 text-primary" />
                <span className="line-clamp-1 text-muted-foreground">
                  {overview.mata_kuliah_praktikum.nama}
                </span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="relative pr-16">
              <div className="absolute top-0 right-6 flex items-center justify-center rounded-full bg-secondary p-3">
                <CalendarClock className="size-6 text-secondary-foreground" />
              </div>
              <CardTitle>Jadwal</CardTitle>
              <CardDescription>Jadwal praktikum selanjutnya</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              {overview.jadwal_selanjutnya ? (
                <>
                  <div className="flex items-center gap-3">
                    <Calendar className="size-4 text-primary" />
                    <span className="text-muted-foreground">
                      {extractDate(overview.jadwal_selanjutnya.mulai)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Timer className="size-4 text-primary" />
                    <span className="text-muted-foreground">
                      {extractTime(overview.jadwal_selanjutnya.mulai)} -{' '}
                      {extractTime(overview.jadwal_selanjutnya.selesai)}
                    </span>
                  </div>
                </>
              ) : (
                <>Jadwal sudah selesai</>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="m-8">
        <div className="flex gap-8">
          <AdvancedCalendar jadwalList={overview.jadwal_sendiri} />
          <OverviewLaporan data={overview.top_praktikan} />
        </div>
      </section>
    </>
  );
}

export interface Data {
  jumlah_praktikan_belum_dinilai: number;
  sisa_pertemuan_praktikum: number;
  kelas: Kelas;
  ruang: Kelas;
  mata_kuliah_praktikum: MataKuliahPraktikum;
  jadwal_selanjutnya: Jadwal;
  jadwal_sendiri: JadwalSendiri[];
  top_praktikan: TopPraktikan[];
}

export interface TopPraktikan {
  id: number;
  nim: string;
  nama: string;
  total_nilai: number;
}

export interface Jadwal {
  id: number;
  mulai: Date;
  selesai: Date;

  is_dilaksanakan: boolean;
}

export interface JadwalSendiri {
  ruang: Kelas;
  kelas: Kelas;
  mata_kuliah_praktikum: MataKuliahPraktikum;
  asisten: Asisten;
  detail: Jadwal;
}

export interface Asisten {
  id: number;
  nim: string;
  nama: string;
}

export interface Kelas {
  id: number;
  nama: string;
}

export interface MataKuliahPraktikum {
  id: number;
  kode: string;
  nama: string;
}
