import OverviewLaporan from '@/components/layout/asisten/overview-top-asisten';
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

export default function AsistenPage() {
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
              <span className="mr-1 text-6xl font-medium">100</span>
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
              <span className="mr-1 text-6xl font-medium">100</span>
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
                <span className="text-muted-foreground">Nama Kelas AP-1</span>
              </div>
              <div className="flex items-center gap-3">
                <Warehouse className="size-4 text-primary" />
                <span className="text-muted-foreground">Data Science</span>
              </div>
              <div className="flex items-center gap-3">
                <BookOpen className="size-4 text-primary" />
                <span className="text-muted-foreground">
                  Algoritma Pemrograman
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
          <OverviewLaporan />
        </div>
      </section>
    </>
  );
}
