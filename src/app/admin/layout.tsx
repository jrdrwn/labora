import Header from '@/components/layout/shared/header';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
            href: '/admin',
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
      <main className="h-svh pt-16">{children}</main>
    </>
  );
}
