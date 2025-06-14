'use client';

import Calendar from '@/components/layout/shared/calendar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalDescription,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
} from '@/components/ui/expansions/responsive-modal';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { EventChangeArg, EventSourceInput } from '@fullcalendar/core/index.js';
import { useGetCookie } from 'cookies-next/client';
import { Check, ChevronsUpDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function AdvancedCalendar() {
  const _cookies = useGetCookie();
  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [selectedJadwal, setSelectedJadwal] = useState<Jadwal | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [me, setMe] = useState<Me | null>(null);

  const getMe = useCallback(async () => {
    const res = await fetch(`/api/asisten/me`, {
      headers: {
        authorization: `Bearer ${_cookies('token')}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(`Error: ${json.message || 'Gagal mengambil data diri'}`);
      setMe(null);
      return;
    }
    setMe(json.data);
  }, [_cookies]);

  const getJadwalList = useCallback(async () => {
    const res = await fetch(`/api/asisten/jadwal`, {
      headers: {
        authorization: `Bearer ${_cookies('token')}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(`Error: ${json.message || 'Gagal mengambil jadwal'}`);
      setJadwalList([]);
    }
    setJadwalList(json.data);
  }, [_cookies]);

  useEffect(() => {
    getJadwalList();
    getMe();
  }, [getJadwalList, getMe]);

  const handleJadwalChange = async ({
    jadwal_id,
    tanggal_mulai,
    jam_mulai,
    jam_selesai,
    ruang_id,
    info,
  }: {
    jadwal_id: number;
    tanggal_mulai: string;
    jam_mulai: string;
    jam_selesai: string;
    ruang_id: number;
    info: EventChangeArg;
  }) => {
    const res = await fetch(`/api/asisten/jadwal`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${_cookies('token')}`,
      },
      body: JSON.stringify({
        where: {
          jadwal_id,
        },
        update: {
          tanggal_mulai,
          jam_mulai,
          jam_selesai,
          ruang_id,
        },
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      toast.error(`Error: ${json.message || 'Gagal mengubah jadwal'}`);
      info.revert(); // Revert the change if error occurs
      return;
    }
    toast.success('jadwal berhasil diubah');
    getJadwalList(); // Refresh the jadwal list
    setSelectedJadwal(null); // Clear selected jadwal
  };

  return (
    <>
      <Calendar
        className="h-full max-w-full!"
        events={
          jadwalList?.map((jadwal) => ({
            title: `#${jadwal.id} ${jadwal.kelas.nama}`,
            start: jadwal.mulai,
            end: jadwal.selesai,
            color: jadwal.kelas.asisten.id === me?.id ? '#3b82f6' : '#10b981',
            editable: jadwal.kelas.asisten.id === me?.id,
            className: cn(
              'cursor-pointer',
              jadwal.is_dilaksanakan && '[&>div]:line-through',
            ),
            extendedProps: {
              ...jadwal,
            },
          })) as EventSourceInput
        }
        eventResizableFromStart={true}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }}
        eventClick={(info) => {
          const jadwal = info.event.extendedProps as Jadwal;
          setSelectedJadwal(jadwal);
          setOpenDetail(true);
          info.jsEvent.preventDefault(); // Prevent default click behavior
        }}
        eventOverlap={(stillEvent, movingEvent) => {
          const jadwal1 = stillEvent.extendedProps as Jadwal;
          const jadwal2 = movingEvent?.extendedProps as Jadwal;
          // Prevent overlap if both events are from the same class and are not
          // marked as 'is_dilaksanakan'
          return (
            jadwal1.kelas.id !== jadwal2.kelas.id ||
            jadwal1.is_dilaksanakan ||
            jadwal2.is_dilaksanakan
          );
        }}
        eventChange={(info) => {
          const jadwal = info.event.extendedProps as Jadwal;
          const tanggalMulai = getDateFromDateTime(info.event.start!);
          const jamMulai = getTimeFromDate(info.event.start!);
          const jamSelesai = getTimeFromDate(info.event.end!);
          handleJadwalChange({
            jadwal_id: jadwal.id,
            tanggal_mulai: tanggalMulai,
            jam_mulai: jamMulai,
            jam_selesai: jamSelesai,
            ruang_id: jadwal.ruangan.id,
            info,
          });
        }}
      />
      {selectedJadwal && (
        <JadwalDetail
          me={me}
          getJadwalList={getJadwalList}
          jadwal={selectedJadwal}
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
        />
      )}
    </>
  );
}

function getTimeFromDate(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getDateFromDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function JadwalDetail({
  me,
  jadwal,
  openDetail,
  setOpenDetail,
  getJadwalList,
}: {
  me: Me | null;
  jadwal: Jadwal;
  openDetail?: boolean;
  setOpenDetail?: (open: boolean) => void;
  getJadwalList: () => Promise<void>;
}) {
  const _cookies = useGetCookie();
  const router = useRouter()
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);
  const [selectedRuanganId, setSelectedRuanganId] = useState<number | null>(
    jadwal.ruangan.id,
  );

  const getRuangan = useCallback(async () => {
    if (jadwal.kelas.asisten.id !== me?.id) {
      setRuangan([]);
      return;
    }
    const res = await fetch(`/api/asisten/ruangan`, {
      headers: {
        authorization: `Bearer ${_cookies('token')}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(`Error: ${json.message || 'Gagal mengambil jadwal'}`);
      setRuangan([]);
    }
    setRuangan(json.data);
  }, [_cookies, jadwal.kelas.asisten.id, me?.id]);

  useEffect(() => {
    getRuangan();
  }, [getRuangan]);

  const handleJadwalChange = async ({
    jadwal_id,
    tanggal_mulai,
    jam_mulai,
    jam_selesai,
    ruang_id,
  }: {
    jadwal_id: number;
    tanggal_mulai: string;
    jam_mulai: string;
    jam_selesai: string;
    ruang_id: number;
  }) => {
    const res = await fetch(`/api/asisten/jadwal`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${_cookies('token')}`,
      },
      body: JSON.stringify({
        where: {
          jadwal_id,
        },
        update: {
          tanggal_mulai,
          jam_mulai,
          jam_selesai,
          ruang_id,
        },
      }),
    });

    const json = await res.json();
    if (!res.ok) {
      toast.error(`Error: ${json.message || 'Gagal mengubah jadwal'}`);
      setSelectedRuanganId(jadwal.ruangan.id);
      return;
    }
    toast.success('jadwal berhasil diubah');
    getJadwalList(); // Refresh the jadwal list
    router.refresh(); // Refresh the page to reflect changes
  };

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
                {jadwal.kelas.asisten.nama}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({jadwal.kelas.asisten.nim})
                </span>
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">
                Mata Kuliah
              </div>
              <div className="font-medium">{jadwal.kelas.mata_kuliah.nama}</div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Ruang</div>
              {jadwal.kelas.asisten.id === me?.id ? (
                <>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        size={'sm'}
                        variant={'outline'}
                        role="combobox"
                        className={cn(
                          'w-full justify-between',
                          !selectedRuanganId && 'text-muted-foreground',
                        )}
                      >
                        {selectedRuanganId
                          ? ruangan.find(
                              (ruang) => ruang.id === selectedRuanganId,
                            )?.nama
                          : 'Select Ruangan'}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search Ruangan" />
                        <CommandList>
                          <CommandEmpty>No Ruangan found.</CommandEmpty>
                          <CommandGroup>
                            {ruangan.map((ruang) => (
                              <CommandItem
                                value={ruang.id.toString()}
                                key={ruang.id}
                                onSelect={(value) => {
                                  setSelectedRuanganId(+value);
                                  handleJadwalChange({
                                    jadwal_id: jadwal.id,
                                    tanggal_mulai: getDateFromDateTime(
                                      new Date(jadwal.mulai),
                                    ),
                                    jam_mulai: getTimeFromDate(
                                      new Date(jadwal.mulai),
                                    ),
                                    jam_selesai: getTimeFromDate(
                                      new Date(jadwal.selesai),
                                    ),
                                    ruang_id: +value,
                                  });
                                }}
                              >
                                <span>
                                  ID: {ruang.id}
                                  <br />
                                  NAMA: {ruang.nama}
                                  <br />
                                  KAPASITAS: {ruang.kapasitas.mahasiswa}{' '}
                                  Mahasiswa
                                  <br />
                                  KAPASITAS KOMPUTER: {ruang.kapasitas.komputer}{' '}
                                  Komputer
                                </span>
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    ruang.id === selectedRuanganId
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </>
              ) : (
                <>
                  <div className="font-medium">{jadwal.ruangan.nama}</div>
                </>
              )}
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Mulai</div>
              <div className="font-medium">
                {new Date(jadwal.mulai).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Selesai</div>
              <div className="font-medium">
                {new Date(jadwal.selesai).toLocaleString()}
              </div>
            </div>
            <div>
              <div className="mb-1 text-sm text-muted-foreground">Status</div>
              <Badge variant={jadwal.is_dilaksanakan ? 'default' : 'secondary'}>
                {jadwal.is_dilaksanakan ? 'Dilaksanakan' : 'Belum Dilaksanakan'}
              </Badge>
            </div>
          </div>
        </div>
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}

export interface Me {
  id: number;
  nim: string;
  nama: string;
  email: string;
  status: string;
  mata_kuliah_pilihan: MataKuliah[];
  komitmen_url: string;
  event: Event;
  kelas: Kela[];
}

export interface Event {
  id: number;
  admin_id: number;
  jenis: string;
  mulai: Date;
  selesai: Date;
  is_aktif: boolean;
}

export interface Kela {
  id: number;
  nama: string;
  mata_kuliah: MataKuliah;
}

export interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
}

export interface Jadwal {
  id: number;
  mulai: Date;
  selesai: Date;
  is_dilaksanakan: boolean;
  ruangan: Ruangan;
  kelas: Kelas;
}

export interface Kelas {
  id: number;
  nama: string;
  asisten: Asisten;
  mata_kuliah: MataKuliah;
}

export interface Asisten {
  id: number;
  nama: string;
  nim: string;
}

export interface MataKuliah {
  id: number;
  kode: string;
  nama: string;
}

export interface Ruangan {
  id: number;
  nama: string;
  kapasitas: Record<string, number>; // Assuming kapasitas is a record of string keys and number values
}
