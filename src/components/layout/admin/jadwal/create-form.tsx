'use client';

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
  ResponsiveModalTrigger,
} from '@/components/ui/expansions/responsive-modal';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCookie } from 'cookies-next/client';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  ruang_id: z.coerce.number().min(0, 'Ruang ID harus diisi'),
  kelas_id: z.coerce.number().min(0, 'Kelas Praktikum ID harus diisi'),
  jam_mulai: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'Jam harus dalam format HH:mm (contoh: 20:18)',
    ),
  jam_selesai: z
    .string()
    .regex(
      /^([01]\d|2[0-3]):([0-5]\d)$/,
      'Jam harus dalam format HH:mm (contoh: 20:18)',
    ),
  jumlah_pertemuan: z.coerce.number().min(1, 'Jumlah pertemuan harus diisi'),
  tanggal_mulai: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Tanggal harus dalam format YYYY-MM-DD (contoh: 2023-10-01)',
    ),
});

interface Ruangan {
  id: number;
  nama: string;
  kuota: {
    komputer: number;
  };
  admin: {
    id: number;
    nama: string;
    email: string;
  };
}

interface Kelas {
  id: number;
  nama: string;
  kapasitas_praktikan: number;
  asisten: {
    id: number;
    nama: string;
    nim: string;
  };
  mata_kuliah: {
    id: number;
    nama: string;
    kode: string;
  };
}

function CreateFormJadwal({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const _cookies = useGetCookie();
  const router = useRouter();
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);
  const [kelas, setKelas] = useState<Kelas[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ruang_id: 0,
      kelas_id: 0,
      jam_mulai: '00:00',
      jam_selesai: '23:23',
      jumlah_pertemuan: 1,
      tanggal_mulai: new Date().toISOString().split('T')[0],
    },
  });

  useEffect(() => {
    async function getRuangan() {
      const res = await fetch('/api/admin/ruangan', {
        headers: {
          authorization: `Bearer ${_cookies('token')}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(`Error: ${json.message || 'Gagal mengambil mata kuliah'}`);
        setRuangan([]);
      }
      setRuangan(json.data);
    }

    async function getKelas() {
      const res = await fetch('/api/admin/kelas', {
        headers: {
          authorization: `Bearer ${_cookies('token')}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(`Error: ${json.message || 'Gagal mengambil kelas'}`);
        setKelas([]);
      }

      setKelas(json.data);
    }

    getRuangan();
    getKelas();
  }, [_cookies]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await fetch('/api/admin/jadwal', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('jadwal berhasil dibuat');
      form.reset();
      router.refresh();
      onOpenChange(false);
    } else {
      toast.error(`Error: ${json.message || 'Gagal membuat jadwal'}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="ruang_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ruangan</FormLabel>
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
                        ? ruangan.find((ruang) => ruang.id === field.value)
                            ?.nama
                        : 'Select Ruangan'}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
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
                              form.setValue('ruang_id', Number(value));
                            }}
                          >
                            {ruang.nama} ({ruang.id})
                            <Check
                              className={cn(
                                'ml-auto',
                                ruang.id === field.value
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
              <FormDescription>Ruangan yang akan ditambahkan.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="kelas_id"
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
                        ? kelas.find((kelas) => kelas.id === field.value)?.nama
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
                        {kelas.map((kelas) => (
                          <CommandItem
                            value={kelas.id.toString()}
                            key={kelas.id}
                            onSelect={(value) => {
                              form.setValue('kelas_id', Number(value));
                            }}
                          >
                            {kelas.nama} ({kelas.id})
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
                Kelas praktikum yang akan ditambahkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex w-full items-start gap-4">
          <FormField
            control={form.control}
            name="tanggal_mulai"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Tanggal mulai pertemuan</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Tanggal mulai pertemuan pertama kelas praktikum.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jam_mulai"
            render={({ field }) => (
              <FormItem className="w-1/4">
                <FormLabel>Mulai</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormDescription>Jam mulai event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="jam_selesai"
            render={({ field }) => (
              <FormItem className="w-1/4">
                <FormLabel>Selesai</FormLabel>
                <FormControl>
                  <Input
                    type="time"
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormDescription>Tanggal selesai event.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="jumlah_pertemuan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah pertemuan</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
              </FormControl>
              <FormDescription>
                Jumlah pertemuan kelas praktikum.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default function CreateFormKelasButton() {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };
  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <ResponsiveModalTrigger asChild>
        <Button>
          <PlusCircle />
          Create Jadwal
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader className="mb-4">
          <ResponsiveModalTitle>Create New Jadwal</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Fill in the details to create a new jadwal.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <CreateFormJadwal onOpenChange={handleOpenChange} />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
