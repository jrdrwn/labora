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

interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
}

const formSchema = z.object({
  nama: z.string().min(0, 'Nama kelas harus diisi'),
  kapasitas_praktikan: z.coerce
    .number()
    .min(1, 'Kuota praktikan harus lebih dari 0'),
  mata_kuliah_id: z.coerce
    .number()
    .min(1, 'Mata kuliah praktikum harus dipilih'),
});

function CreateFormKelas({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  const _cookies = useGetCookie();
  const router = useRouter();
  const [mataKuliah, setMataKuliah] = useState<MataKuliah[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      kapasitas_praktikan: 20,
      mata_kuliah_id: 0,
    },
  });

  useEffect(() => {
    async function getMataKuliah() {
      const res = await fetch('/api/admin/mata-kuliah', {
        headers: {
          authorization: `Bearer ${_cookies('token')}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(`Error: ${json.message || 'Gagal mengambil mata kuliah'}`);
        setMataKuliah([]);
      }
      setMataKuliah(json.data);
    }

    getMataKuliah();
  }, [_cookies]);

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await fetch('/api/admin/kelas', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('kelas berhasil dibuat');
      form.reset();
      router.refresh();
      onOpenChange(false);
    } else {
      toast.error(`Error: ${json.message || 'Gagal membuat kelas'}`);
    }
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
          name="kapasitas_praktikan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kapasitas Praktikan</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Masukkan kapasitas"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Berapa kapasitas yang akan ditambahkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mata_kuliah_id"
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
                        ? mataKuliah.find(
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
                        {mataKuliah.map((mata_kuliah) => (
                          <CommandItem
                            value={mata_kuliah.id.toString()}
                            key={mata_kuliah.id}
                            onSelect={(value) => {
                              form.setValue('mata_kuliah_id', Number(value));
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
  const [open, setOpen] = useState(false);
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
  };
  return (
    <ResponsiveModal open={open} onOpenChange={handleOpenChange}>
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
        <CreateFormKelas onOpenChange={handleOpenChange} />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
