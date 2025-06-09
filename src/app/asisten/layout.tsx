import Prefix from '@/components/layout/asisten/core/Prefix';
import Header from '@/components/layout/shared/header';
import MainLayout from '@/components/layout/shared/main-layout';
import { cookies } from 'next/headers';

import LoginPage from './login/page';
import RegisterResultPage from './register-result/page';
import RegisterPage from './register/page';

export default async function AsistenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _cookies = await cookies();
  if (!_cookies.get('token')?.value) {
    return <LoginPage />;
  }

  const res = await fetch(`${process.env.APP_URL}/api/asisten/event`, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${_cookies.get('token')?.value}`,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    if (res.status === 401) {
      return <LoginPage />;
    }
    throw new Error(json.message || 'Gagal mengambil event');
  }
  const event = json.data as Event[];
  if (!event.find((e) => e.is_aktif)) {
    return (
      <MainLayout>
        <div className="flex h-screen items-center justify-center">
          <h1 className="text-2xl font-bold text-red-500">
            Tidak ada event aktif
          </h1>
        </div>
      </MainLayout>
    );
  }
  const jenis = event.find((e) => e.is_aktif)?.jenis;
  switch (jenis) {
    case 'pendaftaran_asisten':
      return <RegisterPage />;
    case 'pendaftaran_praktikan':
      return <RegisterResultPage />;
    case 'praktikum':
    default:
      return (
        <>
          <Header
            suffix={'Labora'}
            prefix={<Prefix />}
            menus={[
              {
                title: 'Overview',
                href: '/asisten',
              },
              {
                title: 'Laporan',
                href: '/asisten/laporan',
              },
              {
                title: 'Kehadiran',
                href: '/asisten/kehadiran',
              },
              {
                title: 'Penilaian',
                href: '/asisten/penilaian',
              },
              {
                title: 'Jadwal',
                href: '/asisten/jadwal',
              },
            ]}
          />
          <MainLayout>{children}</MainLayout>
        </>
      );
  }
}

export interface Event {
  id: number;
  admin_id: number;
  jenis: string;
  mulai: Date;
  selesai: Date;
  is_aktif: boolean;
}
