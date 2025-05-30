'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MultiSelect } from '@/components/ui/expansions/multi-select';
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
import { setCookie } from 'cookies-next/client';
import { BadgeAlert, BadgeCheck, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const MATA_KULIAH_FAKE = [
  { id: 1, nama: 'Matematika Dasar', kode: 'MK001' },
  { id: 2, nama: 'Fisika Dasar', kode: 'MK002' },
  { id: 3, nama: 'Kimia Dasar', kode: 'MK003' },
];

const formSchema = z.object({
  mata_kuliah_praktikum: z.array(
    z.string().min(1, 'Pilih minimal 1 mata kuliah'),
  ),
  komitmen_url: z.string().url('Masukkan URL yang valid'),
});

interface Asisten {
  id: number;
  nama: string;
  nim: string;
  email: string;
}
function DetailAsisten({ asisten }: { asisten: Asisten }) {
  return (
    <>
      <FormItem>
        <FormLabel>Nama</FormLabel>
        <Input disabled defaultValue={asisten.nama} />
      </FormItem>
      <FormItem>
        <FormLabel>NIM</FormLabel>
        <Input disabled defaultValue={asisten.nim} />
      </FormItem>
      <FormItem>
        <FormLabel>Email</FormLabel>
        <Input disabled defaultValue={asisten.email} />
      </FormItem>
    </>
  );
}
export default function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mata_kuliah_praktikum: [],
      komitmen_url: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('Form submitted with values:', values);
    return;
    setLoading(true);
    const res = await fetch('/api/asisten/register', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const json = (await res.json()) as {
      status: boolean;
      data: { token: string };
      message: string;
    };
    if (res.status === 200) {
      setCookie('token', json.data.token);
      toast('Login Berhasil', {
        icon: <BadgeCheck />,
      });
      router.push('/asisten');
    } else {
      toast('Login Gagal', {
        icon: <BadgeAlert />,
      });
    }
    setLoading(false);
  }
  return (
    <Card className="mx-auto">
      <CardHeader>
        <CardTitle>Register</CardTitle>
        <CardDescription>
          Silahkan register terlebih dahulu untuk menjadi asisten{' '}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <DetailAsisten
              asisten={{
                id: 1,
                nama: 'John Doe',
                nim: '123456789',
                email: 'jrdsfsdfsdf@mail.com',
              }}
            />
            <FormField
              control={form.control}
              name="mata_kuliah_praktikum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mata Kuliah Praktikum</FormLabel>

                  <FormControl>
                    <MultiSelect
                      options={MATA_KULIAH_FAKE.map((mk) => ({
                        value: mk.kode.toString(),
                        label: `${mk.kode} - ${mk.nama}`,
                      }))}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Pilih mata kuliah praktikum"
                    />
                  </FormControl>

                  <FormDescription>
                    Mata kuliah yang Anda pilih akan menjadi mata kuliah yang
                    Anda asuh sebagai asisten.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="komitmen_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Komitmen</FormLabel>
                  <FormControl>
                    <Input placeholder="Ketik URL komitmen Anda" {...field} />
                  </FormControl>
                  <FormDescription>
                    Masukkan URL dokumen komitmen Anda sebagai asisten.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="animate-spin" />}
              Register
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
