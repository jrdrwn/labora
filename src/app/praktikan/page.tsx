import OverviewNilai from '@/components/layout/praktikan/overview-nilai';
import Calendar from '@/components/layout/shared/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BookOpen,
  CalendarClock,
  Shapes,
  UserPen,
  Users,
  Warehouse,
} from 'lucide-react';
import { cookies } from 'next/headers';

export interface Kelas {
  id: number;
  nama: string;
  mata_kuliah: MataKuliah;
}

export interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
}
export default async function PraktikanPage() {
  const _cookies = await cookies();
  let kelas: undefined | string | Kelas = _cookies.get('kelas')?.value;
  let overview: Data;
  if (kelas) {
    kelas = JSON.parse(kelas as string) as Kelas;

    const res = await fetch(
      `${process.env.APP_URL}/api/praktikan/overview/${kelas.id}`,
      {
        headers: {
          authorization: `Bearer ${_cookies.get('token')?.value}`,
        },
      },
    );
    const json = await res.json();
    if (!res.ok) {
      throw new Error(`Error: ${json.message || 'Gagal mengambil overview'}`);
    }

    overview = json.data;
  } else {
    return (
      <div className="m-8">
        <h1 className="text-2xl font-bold">Pilih kelas terlebih dahulu</h1>
        <p className="text-muted-foreground">
          Silakan pilih kelas pada menu di atas untuk melihat overview.
        </p>
      </div>
    );
  }

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
                Total penilaian yang telah diberikan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <span className="mr-1 text-6xl font-medium">
                {overview.total_nilai}
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
            <CardContent>
              <span className="mr-1 text-6xl font-medium">100</span>
            </CardContent>
          </Card>
        </div>
      </section>
      <section className="m-8">
        <div className="flex gap-8">
          <Calendar />
          <OverviewNilai
            data={overview.penilaian.map((penilaian) => ({
              id: penilaian.id,
              detail: penilaian.detail,
              jadwal: {
                id: penilaian.jadwal.id,
                mulai: new Date(penilaian.jadwal.mulai),
                selesai: new Date(penilaian.jadwal.selesai),
              },
            }))}
          />
        </div>
      </section>
    </>
  );
}

export interface Data {
  total_nilai: number;
  sisa_pertemuan_praktikum: number;
  kelas: Kelas;
  ruang: Kelas;
  mata_kuliah_praktikum: MataKuliahPraktikum;
  jadwal_selanjutnya: Jadwal;
  jadwal_sendiri: JadwalSendiri[];
  penilaian: Penilaian[];
}

export interface Jadwal {
  id: number;
  mulai: Date;
  selesai: Date;
  status?: string;
}

export interface JadwalSendiri {
  ruang: Kelas;
  kelas: Kelas;
  mata_kuliah_praktikum: MataKuliahPraktikum;
  asisten: Asisten;
  jadwal: Jadwal;
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

export interface Penilaian {
  id: number;
  jadwal: Jadwal;
  detail: Detail[];
}

export interface Detail {
  id: number;
  tipe: string;
  nilai: number;
}
