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
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
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
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronsUpDown, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Asisten } from './list/columns';

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
  status: z.string(),
  kelas_id: z.coerce.number().min(1, {
    message: 'Kelas harus dipilih',
  }),
  asisten_id: z.coerce.number().min(1, {
    message: 'Asisten harus dipilih',
  }),
});

function EditFormAsisten({ defaultValues }: { defaultValues: Asisten }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      status: defaultValues.status,
      kelas_id: defaultValues.kelaspraktikum[0]?.id || 0,
      asisten_id: defaultValues.id,
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    console.log('Form submitted:', data);
    // Handle form submission logic here
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2">
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
                  Kelas praktikum yang akan jadi tanggung jawab asisten.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="diterima">Diterima</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Status asisten untuk kelas ini.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default function EditFormAsistenButton({
  asisten,
}: {
  asisten: Asisten;
}) {
  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil />
          Edit
        </DropdownMenuItem>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader className="mb-4">
          <ResponsiveModalTitle>Edit Asisten</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Edit details for #{asisten.id} - {asisten.nama}.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <EditFormAsisten defaultValues={asisten} />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
