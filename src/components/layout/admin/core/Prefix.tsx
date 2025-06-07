import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronsUpDown, LogOut } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function getEvent(): Promise<Event[]> {
  const _cookies = await cookies();
  const res = await fetch(`${process.env.APP_URL}/api/admin/event`, {
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${_cookies.get('token')?.value}`,
    },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.message || 'Gagal mengambil event');
  }
  return json.data;
}

export default async function Prefix() {
  const event = await getEvent();
  return (
    <>
      <Link href={'/admin/event'}>
        <Button variant={'outline'} className="cursor-pointer rounded-full">
          Event:{' '}
          {event
            .find((e) => e.is_aktif)
            ?.jenis.split('_')
            .join(' ') || 'Tidak ada event aktif'}
          <ChevronsUpDown />
        </Button>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
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
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <Link href={'/'}>
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export interface Event {
  id: number;
  is_aktif: boolean;
  jenis: string;
  mulai: Date;
  selesai: Date;
  admin: Admin;
}

export interface Admin {
  id: number;
  nama: string;
  email: string;
}
