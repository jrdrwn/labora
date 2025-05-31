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
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  judul: z.string().min(1, 'Judul harus diisi'),
  bukti_pertemuaan: z.string().url('Bukti pertemuan harus berupa URL'),
  jadwal_praktikum_id: z.coerce
    .number()
    .min(1, 'Jadwal Praktikum harus dipilih'),
});

interface CreateFormKehadiranProps {
  jadwal_praktikum_id: number;
}

export default function CreateFormKehadiran({
  data,
}: {
  data: CreateFormKehadiranProps;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      judul: '',
      jadwal_praktikum_id: data.jadwal_praktikum_id || 0,
      bukti_pertemuaan: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await fetch('/api/asisten/penilaian', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = await res.json();
    if (res.status === 200) {
      // Handle success, e.g., show a success message or redirect
      console.log('Kehadiran created successfully:', json);
    } else {
      // Handle error, e.g., show an error message
      console.error('Error creating kehadiran:', json);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="judul"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Judul</FormLabel>
              <FormControl>
                <Input placeholder="Masukkan judul" {...field} />
              </FormControl>
              <FormDescription>
                Judul kehadiran yang akan dibuat.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* bukti pertemuan, create access to file or camera  */}
        <FormField
          control={form.control}
          name="bukti_pertemuaan"
          render={({}) => (
            <FormItem>
              <FormLabel>Bukti Pertemuan</FormLabel>
              <FormControl>
                <Input placeholder="Upload bukti pertemuan" type="file" />
              </FormControl>
              <FormDescription>
                Bukti pertemuan yang akan diunggah.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
