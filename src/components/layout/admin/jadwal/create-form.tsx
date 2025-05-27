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
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const RUANG_ID_FAKE = [
  {
    id: 1,
    nama: 'Data Science 1',
    kuota: {
      komputer: 20,
    },
    admin: {
      id: 1,
      nama: 'admin',
      email: 'admin@example.com',
    },
  },
  {
    id: 2,
    nama: 'Data Science 2',
    kuota: {
      komputer: 20,
    },
    admin: {
      id: 1,
      nama: 'admin',
      email: 'admin@example.com',
    },
  },
  {
    id: 3,
    nama: 'Data Science 3',
    kuota: {
      komputer: 20,
    },
    admin: {
      id: 1,
      nama: 'admin',
      email: 'admin@example.com',
    },
  },
];

const KELAS_FAKE = [
  {
    id: 1,
    nama: 'BASDAT 1-A',
    kuota_praktikan: 10,
    asisten: {
      id: 5,
      nama: 'JORDI IRAWAN',
      nim: '223010503002',
    },
    matakuliahpraktikum: {
      id: 1,
      nama: 'Pemrograman Dasar',
      kode: 'PM001',
    },
  },
  {
    id: 2,
    nama: 'BASDAT 1-B',
    kuota_praktikan: 10,
    asisten: {
      id: 5,
      nama: 'JORDI IRAWAN',
      nim: '223010503002',
    },
    matakuliahpraktikum: {
      id: 1,
      nama: 'Pemrograman Dasar',
      kode: 'PM001',
    },
  },
  {
    id: 3,
    nama: 'BASDAT 1-B',
    kuota_praktikan: 10,
    asisten: {
      id: 5,
      nama: 'JORDI IRAWAN',
      nim: '223010503002',
    },
    matakuliahpraktikum: {
      id: 1,
      nama: 'Pemrograman Dasar',
      kode: 'PM001',
    },
  },
];

const formSchema = z.object({
  ruang_id: z.coerce.number().min(1, 'Ruang ID harus diisi'),
  kelas_praktikum_id: z.coerce
    .number()
    .min(1, 'Kelas Praktikum ID harus diisi'),
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

function CreateFormJadwal() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ruang_id: 1,
      kelas_praktikum_id: 1,
      jam_mulai: '00:00',
      jam_selesai: '23:23',
      jumlah_pertemuan: 1,
      tanggal_mulai: '2023-10-01',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log('Form submitted:', data);
    // Handle form submission logic here
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
                        ? RUANG_ID_FAKE.find(
                            (ruang) => ruang.id === field.value,
                          )?.nama
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
                        {RUANG_ID_FAKE.map((ruang) => (
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
                        ? KELAS_FAKE.find((kelas) => kelas.id === field.value)
                            ?.nama
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
                        {KELAS_FAKE.map((kelas) => (
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
  return (
    <ResponsiveModal>
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
        <CreateFormJadwal />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
