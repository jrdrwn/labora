'use client';

import { Button } from '@/components/ui/button';
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
import { PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  nama: z.string().min(1, 'Nama ruangan harus diisi'),
  kuota: z.object({
    komputer: z.coerce.number().min(1, 'Kuota komputer harus lebih dari 0'),
  }),
});

function CreateFormRuangan() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nama: '',
      kuota: {
        komputer: 1,
      },
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
              <FormLabel>Nama Ruangan</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan nama ruangan" {...field} />
              </FormControl>
              <FormDescription>
                Nama ruangan yang akan ditambahkan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="kuota.komputer"
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

export default function CreateFormRuanganButton() {
  return (
    <ResponsiveModal>
      <ResponsiveModalTrigger asChild>
        <Button>
          <PlusCircle />
          Create Ruangan
        </Button>
      </ResponsiveModalTrigger>
      <ResponsiveModalContent>
        <ResponsiveModalHeader className="mb-4">
          <ResponsiveModalTitle>Create New Ruangan</ResponsiveModalTitle>
          <ResponsiveModalDescription>
            Fill in the details to create a new ruangan.
          </ResponsiveModalDescription>
        </ResponsiveModalHeader>
        <CreateFormRuangan />
      </ResponsiveModalContent>
    </ResponsiveModal>
  );
}
