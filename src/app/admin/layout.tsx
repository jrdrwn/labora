import Prefix from '@/components/layout/admin/core/Prefix';
import Header from '@/components/layout/shared/header';
import MainLayout from '@/components/layout/shared/main-layout';
import { cookies } from 'next/headers';

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
        prefix={<Prefix />}
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
