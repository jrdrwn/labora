'use client';

import Calendar from '@/components/layout/shared/calendar';
import { Badge } from '@/components/ui/badge';
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from '@/components/ui/expansions/responsive-modal';
import { cn } from '@/lib/utils';
import { EventSourceInput } from '@fullcalendar/core/index.js';
import { useState } from 'react';

export default function AdvancedCalendar({
  jadwalList,
}: {
  jadwalList?: Jadwal[];
}) {
  const [selectedJadwal, setSelectedJadwal] = useState<Jadwal | null>(null);
  const [openDetail, setOpenDetail] = useState(false);

  return (
    <>
      <Calendar
        className="h-full max-w-full!"
        events={
          jadwalList?.map((jadwal) => ({
            title: `${jadwal.kelas.nama}`,
            start: jadwal.detail.mulai,
            end: jadwal.detail.selesai,
            color: '#10b981',
            editable: false,
            className: cn(
              'cursor-pointer',
              jadwal.detail.is_dilaksanakan && '[&>div]:line-through',
            ),
            extendedProps: {
              ...jadwal,
            },
            overlap: false,
          })) as EventSourceInput
        }
        eventClick={(info) => {
          const jadwal = info.event.extendedProps as Jadwal;
          setSelectedJadwal(jadwal);
          setOpenDetail(true);
          info.jsEvent.preventDefault();
        }}
      />
      {selectedJadwal && (
        <JadwalDetail
          jadwal={selectedJadwal}
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
        />
      )}
    </>
  );
}

function JadwalDetail({
  jadwal,
  openDetail,
  setOpenDetail,
}: {
  jadwal: Jadwal;
  openDetail?: boolean;
  setOpenDetail?: (open: boolean) => void;
}) {
  return (
    <ResponsiveModal open={openDetail || false} onOpenChange={setOpenDetail}>
      <ResponsiveModalContent>
        <ResponsiveModalHeader>
          <ResponsiveModalTitle>Detail Jadwal Praktikum</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Berikut adalah detail jadwal praktikum yang dipilih.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <div className="pt-4">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Kelas</div>
              <div className="font-medium">{jadwal.kelas.nama}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Asisten</div>
              <div className="font-medium">
                {jadwal.asisten.nama}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({jadwal.asisten.nim})
                </span>
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">
                Mata Kuliah
              </div>
              <div className="font-medium">
                {jadwal.mata_kuliah_praktikum.nama}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Ruang</div>
              <div className="font-medium">{jadwal.ruang.nama}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Mulai</div>
              <div className="font-medium">
                {new Date(jadwal.detail.mulai).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Selesai</div>
              <div className="font-medium">
                {new Date(jadwal.detail.selesai).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Status</div>
              <Badge
                variant={
                  jadwal.detail.is_dilaksanakan ? 'default' : 'secondary'
                }
              >
                {jadwal.detail.is_dilaksanakan
                  ? 'Dilaksanakan'
                  : 'Belum Dilaksanakan'}
              </Badge>
            </div>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

export interface Jadwal {
  ruang: Kelas;
  kelas: Kelas;
  mata_kuliah_praktikum: MataKuliahPraktikum;
  asisten: Asisten;
  detail: Detail;
}

export interface Asisten {
  id: number;
  nim: string;
  nama: string;
}

export interface Detail {
  id: number;
  mulai: Date;
  selesai: Date;
  is_dilaksanakan: boolean;
}

export interface Kelas {
  id: number;
  nama: string;
}

export interface MataKuliahPraktikum {
  id: number;
  kode: string;
  nama: string;
}
