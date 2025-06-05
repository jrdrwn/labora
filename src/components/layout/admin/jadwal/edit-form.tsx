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
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCookie } from 'cookies-next/client';
import { Check, ChevronsUpDown, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Jadwal, Ruangan } from './list/columns';

const formSchema = z.object({
  where: z.object({
    jadwal_id: z.coerce.number().min(0, 'Jadwal ID harus diisi'),
  }),
  update: z.object({
    ruang_id: z.coerce.number().min(1, 'Ruang ID harus diisi').optional(),
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
    tanggal_mulai: z
      .string()
      .regex(
        /^\d{4}-\d{2}-\d{2}$/,
        'Tanggal harus dalam format YYYY-MM-DD (contoh: 2023-10-01)',
      ),
  }),
});

export interface EditJadwal {
  ruang_id?: number;
  jam_mulai: string;
  jam_selesai: string;
  tanggal_mulai: string;
}
function getTimeFromDate(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0'); // Pastikan 2 digit
  const minutes = date.getMinutes().toString().padStart(2, '0'); // Pastikan 2 digit
  return `${hours}:${minutes}`;
}

function getDateFromDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Bulan dimulai dari 0
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function EditFormJadwal({
  defaultValues,
  onOpenChange,
}: {
  defaultValues: Jadwal;
  onOpenChange: (open: boolean) => void;
}) {
  const _cookies = useGetCookie();
  const router = useRouter();
  const [ruangan, setRuangan] = useState<Ruangan[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      where: {
        jadwal_id: defaultValues.id,
      },
      update: {
        ruang_id: defaultValues.ruangan.id || 0,
        jam_mulai: getTimeFromDate(new Date(defaultValues.mulai)),
        jam_selesai: getTimeFromDate(new Date(defaultValues.selesai)),
        tanggal_mulai: getDateFromDateTime(new Date(defaultValues.mulai)),
      },
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

    getRuangan();
  }, [_cookies]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await fetch('/api/admin/jadwal', {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          jadwal_id: data.where.jadwal_id,
        },
        update: {
          ruang_id: data.update.ruang_id,
          jam_mulai: data.update.jam_mulai,
          jam_selesai: data.update.jam_selesai,
          tanggal_mulai: data.update.tanggal_mulai,
        },
      }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('Ruangan berhasil diperbarui');
      form.reset();
      router.refresh();
      onOpenChange(false);
    } else {
      toast.error(`Error: ${json.message || 'Gagal memperbarui ruangan'}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="update.ruang_id"
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
                              form.setValue('update.ruang_id', Number(value));
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
              <FormDescription>Ruangan yang akan diedit.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex w-full items-start gap-4">
          <FormField
            control={form.control}
            name="update.tanggal_mulai"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Tanggal mulai pertemuan</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormDescription>
                  Tanggal mulai pertemuan kelas praktikum.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="update.jam_mulai"
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
            name="update.jam_selesai"
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

        <Button type="submit" className="w-full">
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default function EditFormJadwalButton({ jadwal }: { jadwal: Jadwal }) {
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };
  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
      <ResponsiveModalTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Pencil />
          Edit
        </DropdownMenuItem>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader className="mb-4">
          <ResponsiveModalTitle>Edit Jadwal</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Fill in the details to edit jadwal.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <EditFormJadwal
          defaultValues={jadwal}
          onOpenChange={handleOpenChange}
        />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
