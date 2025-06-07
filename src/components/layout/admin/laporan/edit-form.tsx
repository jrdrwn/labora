'use client';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
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
import { useGetCookie } from 'cookies-next/client';
import { Check, ChevronsUpDown, Pencil, RefreshCcw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { LaporanList } from './list/columns';

interface Kelas {
  id: number;
  nama: string;
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

const formSchema = z.object({
  where: z.object({
    asisten_id: z.coerce.number().int().min(1, {
      message: 'ID asisten harus diisi',
    }),
  }),
  update: z.object({
    status: z.string(),
    kelas_id: z.coerce.number().nullable(),
  }),
});

function EditFormAsisten({
  defaultValues,
  onOpenChange,
}: {
  defaultValues: LaporanList;
  onOpenChange: (open: boolean) => void;
}) {
  const _cookies = useGetCookie();
  const router = useRouter();
  const [kelas, setKelas] = useState<Kelas[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      where: {
        asisten_id: defaultValues.id,
      },
      update: {
        status: defaultValues.status,
        kelas_id: defaultValues.kelas?.[0]?.id || 0,
      },
    },
  });

  useEffect(() => {
    async function getKelas() {
      const res = await fetch(
        `/api/admin/asisten/kelas?asisten_id=${defaultValues.id}`,
        {
          headers: {
            authorization: `Bearer ${_cookies('token')}`,
          },
        },
      );
      const json = await res.json();
      if (!res.ok) {
        toast.error(`Error: ${json.message || 'Gagal mengambil kelas'}`);
        setKelas([]);
      }
      setKelas(json.data);
    }

    getKelas();
  }, [_cookies, defaultValues.id]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await fetch('/api/admin/asisten', {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          asisten_id: data.where.asisten_id,
        },
        update: {
          status: data.update.status,
          kelas_id: data.update.kelas_id || null,
        },
      }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('Asisten berhasil diperbarui');
      form.reset();
      router.refresh();
      onOpenChange(false);
    } else {
      toast.error(`Error: ${json.message || 'Gagal memperbarui Asisten'}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-center gap-2">
          <FormField
            control={form.control}
            name="update.kelas_id"
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
                          ? kelas.find((kelas) => kelas.id === field.value)
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
                        {defaultValues.mata_kuliah_pilihan.map((mk) => {
                          return (
                            <Fragment key={mk.id}>
                              <CommandGroup key={mk.id} heading={mk.nama}>
                                {kelas
                                  .filter(
                                    (kelas) => kelas.mata_kuliah.id === mk.id,
                                  )
                                  .map((kelas) => (
                                    <CommandItem
                                      value={kelas.id.toString()}
                                      key={kelas.id}
                                      onSelect={(value) => {
                                        form.setValue(
                                          'update.kelas_id',
                                          Number(value),
                                        );
                                      }}
                                    >
                                      ({kelas.id}) {kelas.nama} (
                                      {kelas.asisten
                                        ? `#${kelas.asisten.id} - ${kelas.asisten.nama}`
                                        : 'Belum ada asisten'}
                                      )
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
                              <CommandSeparator />
                            </Fragment>
                          );
                        })}
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
            name="update.status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl className="w-full">
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="diterima">Diterima</SelectItem>
                    <SelectItem value="ditolak">Ditolak</SelectItem>
                    <SelectItem value="diproses">Diproses</SelectItem>
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
        <div className="flex w-full gap-2">
          <Button
            type="button"
            size={'icon'}
            onClick={() => {
              form.reset();
              form.setValue('update.kelas_id', null);
              form.setValue('update.status', 'diproses');
            }}
          >
            <RefreshCcw />
            <span className="sr-only">Reset Kelas</span>
          </Button>
          <Button type="submit" className="flex-1">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default function EditFormAsistenButton({
  asisten,
}: {
  asisten: LaporanList;
}) {
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
          <ResponsiveModalTitle>Edit Asisten</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Edit details for #{asisten.id} - {asisten.nama}.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <EditFormAsisten
          defaultValues={asisten}
          onOpenChange={handleOpenChange}
        />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
