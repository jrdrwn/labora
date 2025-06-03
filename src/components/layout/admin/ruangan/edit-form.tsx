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

import { Ruangan } from './list/columns';

const formSchema = z.object({
  where: z.object({
    ruang_id: z.number().int().min(1),
  }),
  update: z.object({
    nama: z.string().min(1).optional(),
    kapasitas: z.object({
      komputer: z.coerce.number().int().min(0).default(0).optional(),
    }),
  }),
});

function EditFormRuangan({
  defaultValues,
  onOpenChange,
}: {
  defaultValues: Ruangan;
  onOpenChange: (open: boolean) => void;
}) {
  const _cookies = useGetCookie();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      where: {
        ruang_id: defaultValues.id,
      },
      update: {
        nama: defaultValues.nama,
        kapasitas: {
          komputer: defaultValues.kapasitas?.komputer || 0,
        },
      },
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await fetch('/api/admin/ruangan', {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          ruang_id: data.where.ruang_id,
        },
        update: {
          nama: data.update.nama,
          kapasitas: data.update.kapasitas,
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
          name="update.nama"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Ruangan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama ruangan" {...field} />
              </FormControl>
              <FormDescription>Nama ruangan yang akan diedit.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="update.kapasitas.komputer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kuota Komputer</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Masukkan kuota komputer"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Kuota komputer yang tersedia di ruangan ini.
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

export default function EditFormRuanganButton({
  ruangan,
}: {
  ruangan: Ruangan;
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
          <ResponsiveModalTitle>Edit Ruangan</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Edit details for #{ruangan.id} - {ruangan.nama}.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <EditFormRuangan
          defaultValues={ruangan}
          onOpenChange={handleOpenChange}
        />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
