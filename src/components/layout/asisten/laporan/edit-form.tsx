'use client';

import { Button } from '@/components/ui/button';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCookie } from 'cookies-next/client';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Laporan } from './list/columns';

const formSchema = z.object({
  where: z.object({
    laporan_id: z.number().int().min(1, 'ID laporan harus diisi'),
  }),
  update: z.object({
    judul: z.string().min(1, 'Judul laporan harus diisi'),
    bukti_pertemuan_url: z.string().url('URL harus valid'),
  }),
});

function EditFormLaporan({
  defaultValues,
  onOpenChange,
}: {
  defaultValues: Laporan;
  onOpenChange: (open: boolean) => void;
}) {
  const _cookies = useGetCookie();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      where: {
        laporan_id: defaultValues.id,
      },
      update: {
        judul: defaultValues.judul,
        bukti_pertemuan_url: defaultValues.bukti_pertemuan_url,
      },
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await fetch('/api/asisten/laporan', {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          laporan_id: data.where.laporan_id,
        },
        update: {
          judul: data.update.judul || '',
          bukti_pertemuan_url: data.update.bukti_pertemuan_url || '',
        },
      }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('Laporan berhasil diperbarui');
      form.reset();
      router.refresh();
      onOpenChange(false);
    } else {
      toast.error(`Error: ${json.message || 'Gagal memperbarui Laporan'}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="update.judul"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul pertemuan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan judul" {...field} />
              </FormControl>
              <FormDescription>
                Judul laporan yang akan ditambahkan. Pastikan judul sesuai
                dengan pertemuan yang dilaporkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="update.bukti_pertemuan_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bukti Pertemuan URL</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan url" {...field} />
              </FormControl>
              <FormDescription>
                URL bukti pertemuan yang akan ditambahkan. Pastikan URL valid.
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

export default function EditFormLaporanButton({
  laporan,
}: {
  laporan: Laporan;
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
          <ResponsiveModalTitle>Edit laporan</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Fill in the details to edit a laporan.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <EditFormLaporan
          defaultValues={laporan}
          onOpenChange={handleOpenChange}
        />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
