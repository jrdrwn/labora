'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { setCookie, useGetCookie } from 'cookies-next/client';
import { ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function Prefix() {
  return (
    <>
      <GantiKelasButton />
      <Button variant={'secondary'} className="rounded-full">
        Event
      </Button>
      <Button variant={'outline'} className="rounded-full px-2">
        Praktikan
        <Avatar className="size-6">
          <AvatarImage
            src={'https://images.unsplash.com/photo-1733621770053-9b1a5f433a8c'}
          />
          <AvatarFallback>LB</AvatarFallback>
        </Avatar>
      </Button>
    </>
  );
}

function GantiKelasButton() {
  const _cookies = useGetCookie();
  const router = useRouter();
  const [currentKelas, setCurrentKelas] = useState<Kelas | null>(null);
  const [kelas, setKelas] = useState<Kelas[]>([]);
  useEffect(() => {
    async function getPreKelas() {
      const res = await fetch('/api/praktikan/kelas', {
        headers: {
          authorization: `Bearer ${_cookies('token')}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(`Error: ${json.message || 'Gagal mengambil kelas'}`);
        setKelas([]);
      }
      const kelasCookie = _cookies('kelas');
      if (kelasCookie) {
        const parsedKelas = JSON.parse(kelasCookie) as Kelas;
        setCurrentKelas(parsedKelas);
      } else {
        setCookie('kelas', JSON.stringify(json.data[0] || null));
        toast.info(
          'Kelas belum dipilih, menggunakan kelas pertama sebagai default',
        );
        router.refresh();
        setCurrentKelas(json.data[0] || null);
      }
      setKelas(json.data);
    }
    getPreKelas();
  }, [_cookies, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'secondary'} className="rounded-full">
          {currentKelas
            ? `${currentKelas.nama} (${currentKelas.mata_kuliah.kode} - ${currentKelas.mata_kuliah.nama})`
            : 'Pilih Kelas'}
          <span className="sr-only">Ganti kelas</span>
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel>Ganti kelas</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {kelas.map((k) => (
          <DropdownMenuItem
            key={k.id}
            onClick={() => {
              setCurrentKelas(k);
              setCookie('kelas', JSON.stringify(k));
              toast.success(`Berhasil ganti kelas ke ${k.nama}`);
              router.refresh();
            }}
          >
            {k.nama} ({k.mata_kuliah.kode} - {k.mata_kuliah.nama})
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
export interface Kelas {
  id: number;
  nama: string;
  mata_kuliah: MataKuliah;
}

export interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
}
