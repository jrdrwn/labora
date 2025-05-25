'use client';

import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  nama: z.string().min(1, 'Nama event harus diisi'),
  jenis: z.enum(['pendaftaran_asisten', 'pendaftaran_praktikan', 'praktikum']),
  mulai: z.coerce.date(),
  selesai: z.coerce.date(),
});

function CreateFormEvent() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      jenis: 'praktikum',
      mulai: new Date(),
      selesai: new Date(),
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
              <FormLabel>Nama Event</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama event" {...field} />
              </FormControl>
              <FormDescription>
                Nama event yang akan ditambahkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="jenis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jenis Event</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih jenis event" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pendaftaran_asisten">
                    Pendaftaran Asisten
                  </SelectItem>
                  <SelectItem value="pendaftaran_praktikan">
                    Pendaftaran Praktikan
                  </SelectItem>
                  <SelectItem value="praktikum">Praktikum</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Jenis event yang akan ditambahkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mulai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mulai</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value}
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
          name="selesai"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Selesai</FormLabel>
              <FormControl>
                <DateTimePicker
                  value={field.value}
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

export default function CreateFormEventButton() {
  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>
        <Button>
          <PlusCircle />
          Create Event
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader className="mb-4">
          <ResponsiveModalTitle>Create New Event</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Fill in the details to create a new event.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <CreateFormEvent />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
