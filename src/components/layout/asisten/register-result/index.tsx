'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useGetCookie } from 'cookies-next/client';
import { AlertCircle, LinkIcon, User2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
}

interface Event {
  id: number;
  admin_id: number;
  jenis: string;
  mulai: string;
  selesai: string;
  is_aktif: boolean;
}

interface Kelas {
  id: number;
  nama: string;
  mata_kuliah: MataKuliah;
}

interface Asisten {
  id: number;
  nim: string;
  nama: string;
  email: string;
  status: string;
  mata_kuliah_pilihan: MataKuliah[];
  komitmen_url: string;
  dokumen_pendukung_url?: string;
  event: Event;
  kelas?: Kelas[];
}

export default function RegisterResultCard() {
  const _cookies = useGetCookie();
  const [asisten, setAsisten] = useState<Asisten | null>(null);

  useEffect(() => {
    if (_cookies('token')) {
      async function getAsisten() {
        const res = await fetch(`/api/asisten/me`, {
          headers: {
            authorization: `Bearer ${_cookies('token')}`,
          },
        });
        const json = await res.json();
        if (!res.ok) {
          toast.error(`Error: ${json.message || 'Gagal mengambil kelas'}`);
          setAsisten(null);
        }
        setAsisten(json.data);
      }

      getAsisten();
    }
  }, [_cookies]);

  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle>Hasil Pendaftaran</CardTitle>
        <CardDescription>
          Berikut adalah detail asisten yang telah terdaftar. Silahkan cek
          kembali data Anda.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {asisten && <DetailAsisten asisten={asisten} />}
      </CardContent>
    </Card>
  );
}

function DetailAsisten({ asisten }: { asisten: Asisten }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3">
          <User2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{asisten.nama}</h2>
          <span className="text-sm text-muted-foreground">{asisten.nim}</span>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <div className="mb-2">
            <span className="font-medium text-muted-foreground">Email</span>
            <div className="text-base">{asisten.email}</div>
          </div>
          <div className="mb-2">
            <span className="font-medium text-muted-foreground">Status</span>
            <div>
              <Badge
                variant={
                  asisten.status === 'diterima'
                    ? 'default'
                    : asisten.status === 'ditolak'
                      ? 'destructive'
                      : 'secondary'
                }
              >
                {asisten.status}
              </Badge>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <span className="font-medium text-muted-foreground">Komitmen</span>
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <Link
                href={asisten.komitmen_url}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-1 break-all text-primary underline"
              >
                {asisten.komitmen_url}
              </Link>
            </div>
          </div>
          <div className="mb-2">
            <span className="font-medium text-muted-foreground">
              Dokumen pendukung
            </span>
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <Link
                href={asisten?.dokumen_pendukung_url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="line-clamp-1 break-all text-primary underline"
              >
                {asisten?.dokumen_pendukung_url}
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div>
        <span className="font-medium text-muted-foreground">
          Mata Kuliah Pilihan
        </span>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kode</TableHead>
              <TableHead>Nama</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asisten.mata_kuliah_pilihan.map((mk) => {
              return (
                <TableRow key={mk.id}>
                  <TableCell>{mk.kode}</TableCell>
                  <TableCell>{mk.nama}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div>
        <span className="font-medium text-muted-foreground">Kelas</span>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Mata Kuliah</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {asisten?.kelas?.map((kelas) => {
              return (
                <TableRow key={kelas.id}>
                  <TableCell>{kelas.nama}</TableCell>
                  <TableCell>{kelas.mata_kuliah.nama}</TableCell>
                </TableRow>
              );
            })}
            {asisten?.kelas?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="text-center text-muted-foreground"
                >
                  Tidak ada kelas yang terdaftar
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Perhatian!</AlertTitle>
        <AlertDescription>
          Jadwal praktikum akan diumumkan melalui email dan website Labora.
          Pastikan Anda memeriksa email secara berkala.
        </AlertDescription>
      </Alert>
    </div>
  );
}
