import Header from '@/components/layout/shared/header';
import MainLayout from '@/components/layout/shared/main-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cookies } from 'next/headers';
import Link from 'next/link';

import LoginPage from './(login)/login/page';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _cookies = await cookies();
  if (!_cookies.get('token')?.value) {
    return <LoginPage />;
  }

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
      <MainLayout>{children}</MainLayout>
    </>
  );
}
