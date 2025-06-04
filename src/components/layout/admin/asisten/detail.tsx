import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalTrigger,
} from '@/components/ui/expansions/responsive-modal';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Eye, LinkIcon, User2 } from 'lucide-react';
import Link from 'next/link';

import { Asisten } from './list/columns';

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
          <div className="mb-2">
            <span className="font-medium text-muted-foreground">
              Komitmen URL
            </span>
            <div className="flex items-center gap-1">
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
              <Link
                href={asisten.komitmen_url}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-primary underline"
              >
                {asisten.komitmen_url}
              </Link>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-2">
            <span className="font-medium text-muted-foreground">
              Mata Kuliah Pilihan
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {asisten.mata_kuliah_pilihan.map((mk) => (
                <Badge key={mk.id} variant="outline" className="text-xs">
                  {mk.kode} - {mk.nama}
                </Badge>
              ))}
            </div>
          </div>
          <div className="mb-2">
            <span className="font-medium text-muted-foreground">
              Kelas Praktikum
            </span>
            <div className="mt-1 flex flex-wrap gap-1">
              {asisten.kelas.length === 0 && (
                <Badge variant="secondary" className="text-xs">
                  Belum ada Kelas
                </Badge>
              )}
              {asisten.kelas.map((k) => (
                <Badge key={k.nama} variant="secondary" className="text-xs">
                  {k.nama}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DetailAsistenButton({ asisten }: { asisten: Asisten }) {
  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Eye />
          Detail
        </DropdownMenuItem>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader className="mb-4">
          <ResponsiveModalTitle>Detail Asisten</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Lihat detail lengkap dari asisten ini, termasuk informasi pribadi
            dan komitmen.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <DetailAsisten asisten={asisten} />
        <ResponsiveModalFooter className="mt-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Perhatian!</AlertTitle>
            <AlertDescription>
              {asisten.status === 'pending' && (
                <>
                  Asisten ini masih dalam status pending Pastikan untuk
                  memeriksa komitmen dan dokumen pendukung lainnya sebelum
                  mengambil keputusan.
                  <Separator />
                </>
              )}
              {asisten.status === 'ditolak' && (
                <>
                  Asisten ini telah ditolak
                  <Separator />
                </>
              )}
              Untuk memproses asisten ini silahkan menggunakan tombol yang
              tersedia di halaman daftar asisten.
            </AlertDescription>
          </Alert>
        </ResponsiveModalFooter>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
