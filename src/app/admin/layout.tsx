import Prefix from '@/components/layout/admin/core/Prefix';
import Header from '@/components/layout/shared/header';
import MainLayout from '@/components/layout/shared/main-layout';
import { cookies } from 'next/headers';

import LoginPage from './login/page';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _cookies = await cookies();
  if (!_cookies.get('token')?.value) {
    return <LoginPage />;
  }

  const res = await fetch(`${process.env.APP_URL}/api/admin/event`, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${_cookies.get('token')?.value}`,
    },
  });
  if (res.status === 401) {
    return <LoginPage />;
  }
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Gagal mengambil event');
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
