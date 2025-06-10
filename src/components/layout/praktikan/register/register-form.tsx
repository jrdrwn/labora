'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCookie } from 'cookies-next/client';
import {
  BadgeAlert,
  BadgeCheck,
  Check,
  ChevronsUpDown,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

export interface PreKelas {
  id: number;
  nama: string;
  kode: string;
  kelas: Kelas[];
}

export interface Kelas {
  praktikan_kelas: PraktikanKelas[];
  id: number;
  nama: string;
  kapasitas_praktikan: number;
  jadwal: Jadwal[];
  asisten: Asisten;
}

export interface Asisten {
  id: number;
  nama: string;
  nim: string;
}

export interface Jadwal {
  id: number;
  mulai: Date;
  selesai: Date;
  is_dilaksanakan: boolean;
  ruangan: Ruangan;
}

export interface Ruangan {
  id: number;
  nama: string;
  kapasitas: Kapasitas;
}

export interface Kapasitas {
  komputer: number;
}

export interface PraktikanKelas {
  id: number;
  perangkat: string;
  praktikan_id: number;
}

export interface Me {
  event_id: number;
  kelas: Kela[];
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
  perangkat: string;
}

const formSchema = z.object({
  mata_kuliah_praktikum_id: z.coerce.number().min(1, {
    message: 'Mata Kuliah Praktikum harus dipilih',
  }),
  perangkat: z.string().nonempty({
    message: 'Perangkat harus dipilih',
  }),
  kelas_praktikum_id: z.coerce.number().min(1, {
    message: 'Kelas Praktikum harus dipilih',
  }),
});

export default function RegisterForm() {
  const [prevData, setPrevData] = useState<{
    [key: string]: {
      mataKuliahPraktikumId: number;
      perangkat: string;
      kelasPraktikumId: number;
    };
  }>({});
  const _cookies = useGetCookie();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [_praktikan, setPraktikan] = useState<Me | null>(null);
  const [preKelas, setPreKelas] = useState<PreKelas[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kelas_praktikum_id: 0,
      mata_kuliah_praktikum_id: 0,
      perangkat: 'laptop',
    },
  });

  const getPraktikan = useCallback(async () => {
    const res = await fetch(`/api/praktikan/me`, {
      headers: {
        authorization: `Bearer ${_cookies('token')}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(`Error: ${json.message || 'Gagal mengambil kelas'}`);
      setPraktikan(null);
      return;
    }
    json.data.kelas.forEach((kelas: Kela) => {
      setPrevData((prev) => ({
        ...prev,
        [kelas.mata_kuliah.id]: {
          mataKuliahPraktikumId: kelas.mata_kuliah.id,
          perangkat: kelas.mata_kuliah.perangkat,
          kelasPraktikumId: kelas.id,
        },
      }));
    });
    setPraktikan(json.data);
  }, [_cookies]);

  const getPreKelas = useCallback(async () => {
    const res = await fetch('/api/praktikan/kelas/pre', {
      headers: {
        authorization: `Bearer ${_cookies('token')}`,
      },
    });
    const json = await res.json();
    if (!res.ok) {
      toast.error(`Error: ${json.message || 'Gagal mengambil mata kuliah'}`);
      setPreKelas([]);
      return;
    }
    setPreKelas(json.data);
  }, [_cookies]);

  useEffect(() => {
    if (_cookies('token')) {
      getPraktikan();
      getPreKelas();
    }
  }, [_cookies, getPraktikan, getPreKelas]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await fetch('/api/praktikan/register', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
    });
    setLoading(false);
    if (res.ok) {
      toast('Pendaftaran Berhasil', {
        icon: <BadgeCheck />,
      });
      form.trigger();
      setPrevData((prev) => ({
        ...prev,
        [values.mata_kuliah_praktikum_id]: {
          mataKuliahPraktikumId: values.mata_kuliah_praktikum_id,
          perangkat: values.perangkat,
          kelasPraktikumId: values.kelas_praktikum_id,
        },
      }));
      form.reset();
      getPreKelas();
      getPraktikan();
      router.refresh();
    } else {
      if (res.status === 400) {
        const json = await res.json();
        toast.error(`Pendaftaran gagal: ${json.message}`, {
          icon: <BadgeAlert />,
        });
        return;
      }
      toast.error(`Pendaftaran gagal`, {
        icon: <BadgeAlert />,
      });
    }
  }
  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Silahkan register terlebih dahulu untuk memulai praktikum
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* <DetailPraktikan
              asisten={{
                id: 1,
                nama: 'John Doe',
                nim: '123456789',
                email: 'jrdsfsdfsdf@mail.com',
              }}
            /> */}
            <Table>
              <TableCaption>
                Untuk mengedit data sebelumnya, klik pada baris
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Matkul</TableHead>
                  <TableHead>Perangkat</TableHead>
                  <TableHead>Kelas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(prevData).map(([key, data]) => (
                  <TableRow
                    key={key}
                    onClick={(event) => {
                      event.preventDefault();
                      form.setValue(
                        'mata_kuliah_praktikum_id',
                        data.mataKuliahPraktikumId,
                      );
                      form.setValue('perangkat', data.perangkat);
                      form.setValue(
                        'kelas_praktikum_id',
                        data.kelasPraktikumId,
                      );
                    }}
                  >
                    <TableCell>
                      {preKelas.find((d) => d.id === data.mataKuliahPraktikumId)
                        ?.nama || 'Unknown Matkul'}
                    </TableCell>
                    <TableCell>{data.perangkat}</TableCell>
                    <TableCell>
                      {preKelas
                        .find((d) => d.id === data.mataKuliahPraktikumId)
                        ?.kelas.find(
                          (kelas) => kelas.id === data.kelasPraktikumId,
                        )?.nama || 'Unknown Kelas'}
                    </TableCell>
                  </TableRow>
                ))}
                {prevData && Object.keys(prevData).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
                      Belum ada data yang terdaftar
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <FormField
              control={form.control}
              name="mata_kuliah_praktikum_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mata Kuliah Praktikum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? preKelas.find((data) => data.id === field.value)
                                ?.nama
                            : 'Select Mata Kuliah Praktikum'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search Mata Kuliah" />
                        <CommandList>
                          <CommandEmpty>No Mata Kuliah found.</CommandEmpty>
                          <CommandGroup>
                            {preKelas.map((data) => (
                              <CommandItem
                                value={data.id.toString()}
                                key={data.id}
                                onSelect={(value) => {
                                  form.setValue(
                                    'mata_kuliah_praktikum_id',
                                    Number(value),
                                  );
                                }}
                              >
                                {data.kode} - {data.nama}
                                <Check
                                  className={cn(
                                    'ml-auto',
                                    data.id === field.value
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

                  <FormDescription>
                    Pilih mata kuliah untuk melihat kelas praktikum yang
                    tersedia.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="perangkat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Perangkat</FormLabel>

                  <Select
                    onValueChange={(e) => {
                      field.onChange(e);
                      form.setValue('kelas_praktikum_id', 0);
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih perangkat yang Anda gunakan" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="laptop">
                        Laptop / Komputer Pribadi
                      </SelectItem>
                      <SelectItem value="komputer_lab">Komputer Lab</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pilih perangkat yang Anda gunakan untuk praktikum.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="kelas_praktikum_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kelas Praktikum</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value && 'text-muted-foreground',
                          )}
                        >
                          {field.value
                            ? preKelas
                                .find(
                                  (data) =>
                                    data.id ===
                                    form.watch('mata_kuliah_praktikum_id'),
                                )
                                ?.kelas.find(
                                  (kelas) => kelas.id === field.value,
                                )?.nama
                            : 'Select Kelas Praktikum'}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput placeholder="Search Kelas Praktikum" />
                        <CommandList>
                          <CommandEmpty>No Kelas Praktikum found.</CommandEmpty>
                          <CommandGroup>
                            {preKelas
                              .find(
                                (data) =>
                                  data.id ===
                                  form.watch('mata_kuliah_praktikum_id'),
                              )
                              ?.kelas.map((kelas) => (
                                <CommandItem
                                  value={kelas.id.toString()}
                                  key={kelas.id}
                                  disabled={
                                    kelas.jadwal[0]?.ruangan.kapasitas.komputer -
                                    kelas.praktikan_kelas.filter(
                                      (pk) => pk.perangkat === 'komputer_lab',
                                    ).length === 0 && form.watch('perangkat') === 'komputer_lab' || kelas.praktikan_kelas.length >= kelas.kapasitas_praktikan
                                  }
                                  onSelect={(value) => {
                                    form.setValue(
                                      'kelas_praktikum_id',
                                      Number(value),
                                    );
                                  }}
                                >
                                  Nama: {kelas.nama}
                                  <br />
                                  Kapasitas: {kelas.praktikan_kelas.length}/
                                  {kelas.kapasitas_praktikan}
                                  <br />
                                  Komputer Tersedia:{' '}
                                  {kelas.jadwal[0]?.ruangan.kapasitas.komputer -
                                    kelas.praktikan_kelas.filter(
                                      (pk) => pk.perangkat === 'komputer_lab',
                                    ).length}
                                  /{kelas.jadwal[0]?.ruangan.kapasitas.komputer}
                                  <br />
                                  Jumlah pertemuan: {kelas.jadwal.length}
                                  <br />
                                  Tanggal mulai: {extractDate(kelas.jadwal[0].mulai)}
                                  <br />
                                  Hari: {extractDay(kelas.jadwal[0].mulai)}
                                  <br />
                                  Jam: {extractTime(kelas.jadwal[0].mulai)} - {extractTime(kelas.jadwal[0].selesai)}
                                  <br />
                                  Ruangan: {kelas.jadwal[0].ruangan.nama}
                                  <br />
                                  {/* <br />
                                  {/* Perangkat: {kelas.perangkat} */}
                                  {/* Kuota: {kelas.kuota.tersisa}/{kelas.kuota.total}
                                <br />
                                Kuota Komputer: {kelas.kuota.komputer}
                                <br />
                                <br />
                                Ruang: {kelas.jadwal.ruang}
                                <br /> */}
                                  Asisten: {kelas?.asisten?.nama} (
                                  {kelas?.asisten?.nim})
                                  <Check
                                    className={cn(
                                      'ml-auto',
                                      kelas.id === field.value
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

                  <FormDescription>
                    Pilih kelas praktikum yang tersedia.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="animate-spin" />}
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function extractDay(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const days = [
    'Minggu',
    'Senin',
    'Selasa',
    'Rabu',
    'Kamis',
    'Jumat',
    'Sabtu',
  ];
  return days[d.getDay()];
}

/**
 * Extract date in format YYYY-MM-DD from Date or ISO string
 */
export function extractDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  // timezone handling to +0700
  d.setHours(d.getHours() + 7);
  // return date in YYYY-MM-DD format
  return d.toISOString().slice(0, 10);
}

/**
 * Extract time in format HH:mm from Date or ISO string
 */
export function extractTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  // timezone handling to +0700
  d.setHours(d.getHours() + 7);
  return d.toISOString().slice(11, 16);
}