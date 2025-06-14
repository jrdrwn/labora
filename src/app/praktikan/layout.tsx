import Prefix from '@/components/layout/praktikan/core/Prefix';
import Header from '@/components/layout/shared/header';
import MainLayout from '@/components/layout/shared/main-layout';
import { cookies } from 'next/headers';

import LoginPage from './login/page';
import RegisterPage from './register/page';

export default async function PraktikanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const _cookies = await cookies();
  if (!_cookies.get('token')?.value) {
    return <LoginPage />;
  }

  const res = await fetch(`${process.env.APP_URL}/api/praktikan/event`, {
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
      return (
        <MainLayout>
          <div className="flex h-screen items-center justify-center">
            <h1 className="text-2xl font-bold text-red-500">
              Pendaftaran asisten sedang berlangsung, silakan tunggu hingga
              selesai.
            </h1>
          </div>
        </MainLayout>
      );
    case 'pendaftaran_praktikan':
      return <RegisterPage />;
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
                href: '/praktikan',
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
