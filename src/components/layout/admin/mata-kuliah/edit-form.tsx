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

import { MataKuliah } from './list/columns';

const formSchema = z.object({
  where: z.object({
    mata_kuliah_id: z.coerce
      .number()
      .int()
      .positive('ID mata kuliah harus diisi'),
  }),
  update: z.object({
    nama: z.string().min(1, 'Nama mata kuliah harus diisi'),
    kode: z.string().min(1, 'Kode mata kuliah harus diisi'),
  }),
});

function EditFormMataKuliah({
  defaultValues,
  onOpenChange,
}: {
  defaultValues: MataKuliah;
  onOpenChange: (open: boolean) => void;
}) {
  const _cookies = useGetCookie();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      where: {
        mata_kuliah_id: defaultValues.id,
      },
      update: {
        nama: defaultValues.nama,
        kode: defaultValues.kode,
      },
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await fetch('/api/admin/mata-kuliah', {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          mata_kuliah_id: data.where.mata_kuliah_id,
        },
        update: {
          nama: data.update.nama,
          kode: data.update.kode,
        },
      }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('Mata kuliah berhasil diperbarui');
      form.reset();
      router.refresh();
      onOpenChange(false);
    } else {
      toast.error(`Error: ${json.message || 'Gagal memperbarui mata kuliah'}`);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="update.nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Mata Kuliah</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama" {...field} />
              </FormControl>
              <FormDescription>
                Nama mata kuliah yang akan diedit.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="update.kode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kode</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan kode" {...field} />
              </FormControl>
              <FormDescription>Kode yang akan diedit.</FormDescription>
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

export default function EditFormMataKuliahButton({
  matakuliah,
}: {
  matakuliah: MataKuliah;
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
          Edit Mata Kuliah
        </DropdownMenuItem>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader className="mb-4">
          <ResponsiveModalTitle>Edit Mata Kuliah</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Fill in the details to edit a mata kuliah.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <EditFormMataKuliah
          defaultValues={matakuliah}
          onOpenChange={handleOpenChange}
        />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
