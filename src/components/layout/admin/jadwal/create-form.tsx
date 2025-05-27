// TODO: belum disesuaikan untuk jadwal
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

const MATA_KULIAH_FAKE = [
  { id: 1, nama: 'Matematika Dasar', kode: 'MK001' },
  { id: 2, nama: 'Fisika Dasar', kode: 'MK002' },
  { id: 3, nama: 'Kimia Dasar', kode: 'MK003' },
];

const formSchema = z.object({
  nama: z.string().min(1, 'Nama kelas harus diisi'),
  kuota_praktikan: z.coerce
    .number()
    .min(1, 'Kuota praktikan harus lebih dari 0'),
  mata_kuliah_praktikum: z.coerce
    .number()
    .min(1, 'Mata kuliah praktikum harus dipilih'),
});

function CreateFormKelas() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      kuota_praktikan: 20,
      mata_kuliah_praktikum: 1,
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
          name="nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kelas</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama" {...field} />
              </FormControl>
              <FormDescription>
                Nama kelas yang akan ditambahkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kuota_praktikan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kuota Praktikan</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Masukkan kuota" {...field} />
              </FormControl>
              <FormDescription>
                Berapa kuota yang akan ditambahkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mata_kuliah_praktikum"
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
                        ? MATA_KULIAH_FAKE.find(
                            (mata_kuliah) => mata_kuliah.id === field.value,
                          )?.nama
                        : 'Select Mata Kuliah'}
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
                        {MATA_KULIAH_FAKE.map((mata_kuliah) => (
                          <CommandItem
                            value={mata_kuliah.id.toString()}
                            key={mata_kuliah.id}
                            onSelect={(value) => {
                              form.setValue(
                                'mata_kuliah_praktikum',
                                Number(value),
                              );
                            }}
                          >
                            {mata_kuliah.nama} ({mata_kuliah.kode})
                            <Check
                              className={cn(
                                'ml-auto',
                                mata_kuliah.id === field.value
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
                ID mata kuliah praktikum yang akan ditambahkan.
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
          Create Kelas
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader className="mb-4">
          <ResponsiveModalTitle>Create New Kelas</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Fill in the details to create a new kelas.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <CreateFormKelas />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
