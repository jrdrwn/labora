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
import { setCookie } from 'cookies-next/client';
import {
  BadgeAlert,
  BadgeCheck,
  Check,
  ChevronsUpDown,
  Loader2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const DATA_FAKE = [
  {
    id: 1,
    nama: 'Matematika Dasar',
    kode: 'MK001',
    kelas_praktikum: [
      {
        id: 1,
        nama: 'MD - Kelas A',
        jadwal: {
          hari: 'Senin',
          jam: '08:00 - 10:00',
          ruang: 'Ruang Praktikum 1',
        },
        asisten: {
          id: 1,
          nama: 'Budi Santoso',
          nim: '223010501001',
        },
        kuota: {
          tersisa: 10,
          total: 20,
          komputer: 5,
        },
      },
      {
        id: 2,
        nama: 'MD - Kelas B',
        jadwal: {
          hari: 'Selasa',
          jam: '10:00 - 12:00',
          ruang: 'Ruang Praktikum 2',
        },
        asisten: {
          id: 2,
          nama: 'Siti Aminah',
          nim: '223010501002',
        },
        kuota: {
          tersisa: 10,
          total: 20,
          komputer: 5,
        },
      },
      {
        id: 3,
        nama: 'MD - Kelas C',
        jadwal: {
          hari: 'Rabu',
          jam: '13:00 - 15:00',
          ruang: 'Ruang Praktikum 3',
        },
        asisten: {
          id: 3,
          nama: 'Andi Wijaya',
          nim: '223010501003',
        },
        kuota: {
          tersisa: 10,
          total: 20,
          komputer: 5,
        },
      },
    ],
  },
  {
    id: 2,
    nama: 'Fisika Dasar',
    kode: 'MK002',
    kelas_praktikum: [
      {
        id: 1,
        nama: 'Kelas A',
        jadwal: {
          hari: 'Senin',
          jam: '08:00 - 10:00',
          ruang: 'Ruang Praktikum 1',
        },
        asisten: {
          id: 1,
          nama: 'Budi Santoso',
          nim: '223010501001',
        },
        kuota: {
          tersisa: 10,
          total: 20,
          komputer: 5,
        },
      },
      {
        id: 2,
        nama: 'Kelas B',
        jadwal: {
          hari: 'Selasa',
          jam: '10:00 - 12:00',
          ruang: 'Ruang Praktikum 2',
        },
        asisten: {
          id: 2,
          nama: 'Siti Aminah',
          nim: '223010501002',
        },
        kuota: {
          tersisa: 10,
          total: 20,
          komputer: 5,
        },
      },
      {
        id: 3,
        nama: 'Kelas C',
        jadwal: {
          hari: 'Rabu',
          jam: '13:00 - 15:00',
          ruang: 'Ruang Praktikum 3',
        },
        asisten: {
          id: 3,
          nama: 'Andi Wijaya',
          nim: '223010501003',
        },
        kuota: {
          tersisa: 10,
          total: 20,
          komputer: 5,
        },
      },
    ],
  },
  {
    id: 3,
    nama: 'Kimia Dasar',
    kode: 'MK003',
    kelas_praktikum: [
      {
        id: 1,
        nama: 'Kelas A',
        jadwal: {
          hari: 'Senin',
          jam: '08:00 - 10:00',
          ruang: 'Ruang Praktikum 1',
        },
        asisten: {
          id: 1,
          nama: 'Budi Santoso',
          nim: '223010501001',
        },
        kuota: {
          tersisa: 10,
          total: 20,
          komputer: 5,
        },
      },
      {
        id: 2,
        nama: 'Kelas B',
        jadwal: {
          hari: 'Selasa',
          jam: '10:00 - 12:00',
          ruang: 'Ruang Praktikum 2',
        },
        asisten: {
          id: 2,
          nama: 'Siti Aminah',
          nim: '223010501002',
        },
        kuota: {
          tersisa: 10,
          total: 20,
          komputer: 5,
        },
      },
      {
        id: 3,
        nama: 'Kelas C',
        jadwal: {
          hari: 'Rabu',
          jam: '13:00 - 15:00',
          ruang: 'Ruang Praktikum 3',
        },
        asisten: {
          id: 3,
          nama: 'Andi Wijaya',
          nim: '223010501003',
        },
        kuota: {
          tersisa: 10,
          total: 20,
          komputer: 5,
        },
      },
    ],
  },
];

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
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      kelas_praktikum_id: 0,
      mata_kuliah_praktikum_id: 0,
      perangkat: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
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
    return;
    setLoading(true);
    const res = await fetch('/api/asisten/register', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = (await res.json()) as {
      status: boolean;
      data: { token: string };
      message: string;
    };
    if (res.status === 200) {
      setCookie('token', json.data.token);
      toast('Login Berhasil', {
        icon: <BadgeCheck />,
      });
      router.push('/asisten');
    } else {
      toast('Login Gagal', {
        icon: <BadgeAlert />,
      });
    }
    setLoading(false);
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
                      {DATA_FAKE.find(
                        (d) => d.id === data.mataKuliahPraktikumId,
                      )?.nama || 'Unknown Matkul'}
                    </TableCell>
                    <TableCell>{data.perangkat}</TableCell>
                    <TableCell>
                      {DATA_FAKE.find(
                        (d) => d.id === data.mataKuliahPraktikumId,
                      )?.kelas_praktikum.find(
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
                            ? DATA_FAKE.find((data) => data.id === field.value)
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
                            {DATA_FAKE.map((data) => (
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
                    onValueChange={field.onChange}
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
                            ? DATA_FAKE.find(
                                (data) =>
                                  data.id ===
                                  form.watch('mata_kuliah_praktikum_id'),
                              )?.kelas_praktikum.find(
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
                            {DATA_FAKE.find(
                              (data) =>
                                data.id ===
                                form.watch('mata_kuliah_praktikum_id'),
                            )?.kelas_praktikum.map((kelas) => (
                              <CommandItem
                                value={kelas.id.toString()}
                                key={kelas.id}
                                onSelect={(value) => {
                                  form.setValue(
                                    'kelas_praktikum_id',
                                    Number(value),
                                  );
                                }}
                              >
                                Nama: {kelas.nama}
                                <br />
                                Kuota: {kelas.kuota.tersisa}/{kelas.kuota.total}
                                <br />
                                Kuota Komputer: {kelas.kuota.komputer}
                                <br />
                                Jadwal: {kelas.jadwal.hari} - {kelas.jadwal.jam}
                                <br />
                                Ruang: {kelas.jadwal.ruang}
                                <br />
                                Asisten: {kelas.asisten.nama} (
                                {kelas.asisten.nim})
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
