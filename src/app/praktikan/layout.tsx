import Header from '@/components/layout/shared/header';
import MainLayout from '@/components/layout/shared/main-layout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PraktikanLayout({
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
            <Button variant={'secondary'} className="rounded-full">
              Ganti Perangkat
            </Button>
            <Button variant={'secondary'} className="rounded-full">
              Ganti Kelas
            </Button>
            <Link href={'/praktikan/event'}>
              <Button variant={'secondary'} className="rounded-full">
                Event
              </Button>
            </Link>
            <Button variant={'outline'} className="rounded-full px-2">
              Praktikan
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
            href: '/praktikan',
          },
          {
            title: 'Jadwal Praktikum',
            href: '/praktikan/jadwal',
          },
        ]}
      />
      <MainLayout>{children}</MainLayout>
    </>
  );
}
