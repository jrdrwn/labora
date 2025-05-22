import OverviewLaporan from '@/components/layout/admin/overview-laporan';
import Calendar from '@/components/layout/shared/calendar';
import Header from '@/components/layout/shared/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shapes, UserPen, Users, Warehouse } from 'lucide-react';
import Link from 'next/link';

import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function AdminPage() {
  return (
    <>
      <Header
        suffix={'Labora'}
        prefix={
          <>
            <Link href={'/admin/event'}>
              <Button variant={'secondary'} className="rounded-full">
                Event
              </Button>
            </Link>
            <Button variant={'outline'} className="rounded-full px-2">
              Admin
              <Avatar className="size-6">
                <AvatarImage
                  src={
                    'https://images.unsplash.com/photo-1733621770053-9b1a5f433a8c'
                  }
                />
                <AvatarFallback>LB</AvatarFallback>
              </Avatar>
            </Button>
          </>
        }
        menus={[
          {
            title: 'Overview',
            href: '/admin/overview',
          },
          {
            title: 'Ruangan',
            href: '/admin/ruangan',
          },
          {
            title: 'Mata Kuliah',
            href: '/admin/mata-kuliah',
          },
          {
            title: 'Kelas',
            href: '/admin/kelas',
          },
          {
            title: 'Jadwal',
            href: '/admin/jadwal',
          },
          {
            title: 'Asisten',
            href: '/admin/asisten',
          },
          {
            title: 'Praktikan',
            href: '/admin/praktikan',
          },
          {
            title: 'Laporan',
            href: '/admin/laporan',
          },
        ]}
      />
      <main className="h-svh pt-16">
        <section className="m-8">
          <div className="grid grid-cols-4 gap-8">
            <Card>
              <CardHeader className="relative pr-16">
                <div className="absolute top-0 right-6 flex items-center justify-center rounded-full bg-secondary p-3">
                  <Users className="size-6 text-secondary-foreground" />
                </div>
                <CardTitle>Praktikan</CardTitle>
                <CardDescription>
                  Jumlah praktikan yang terdaftar
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
                <CardTitle>Asisten</CardTitle>
                <CardDescription>
                  Jumlah asisten yang lulus seleksi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <span className="mr-1 text-6xl font-medium">100</span>
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
                <span className="mr-1 text-6xl font-medium">100</span>
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
      </main>
    </>
  );
}
