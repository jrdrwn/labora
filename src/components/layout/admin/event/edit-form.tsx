'use client';

import { Button } from '@/components/ui/button';
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DateTimePicker } from '@/components/ui/expansions/datetime-picker';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useGetCookie } from 'cookies-next/client';
import { Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Event } from './list/columns';

const formSchema = z.object({
  where: z.object({
    event_id: z.coerce.number().int().positive(),
  }),
  update: z.object({
    is_aktif: z.boolean(),
    mulai: z.coerce.date(),
    selesai: z.coerce.date(),
  }),
});

function EditFormEvent({
  defaultValues,
  onOpenChange,
}: {
  defaultValues: Event;
  onOpenChange: (open: boolean) => void;
}) {
  const _cookies = useGetCookie();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      where: {
        event_id: defaultValues.id,
      },
      update: {
        is_aktif: defaultValues.is_aktif,
        mulai: defaultValues.mulai,
        selesai: defaultValues.selesai,
      },
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const res = await fetch('/api/admin/event', {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          event_id: data.where.event_id,
        },
        update: {
          is_aktif: data.update.is_aktif,
          mulai: data.update.mulai,
          selesai: data.update.selesai,
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
          name="update.is_aktif"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={(value: string) =>
                  field.onChange(value === 'true')
                }
                defaultValue={String(field.value)}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih jenis event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="true">Aktif</SelectItem>
                  <SelectItem value="false">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Jenis event yang akan diedit.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="update.mulai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mulai</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={new Date(field.value)}
                  onChange={field.onChange}
                  granularity="minute"
                />
              </FormControl>
              <FormDescription>Tanggal mulai event.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="update.selesai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selesai</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={new Date(field.value)}
                  onChange={field.onChange}
                  granularity="minute"
                />
              </FormControl>
              <FormDescription>Tanggal selesai event.</FormDescription>
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

export default function EditFormEventButton({ event }: { event: Event }) {
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
          <ResponsiveModalTitle>Edit Event</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Edit details for #{event.id} - {event.jenis}.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <EditFormEvent defaultValues={event} onOpenChange={handleOpenChange} />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
