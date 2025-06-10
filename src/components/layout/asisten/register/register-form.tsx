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
import { useGetCookie } from 'cookies-next/client';
import { BadgeAlert, BadgeCheck, Loader2, User2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  mata_kuliah_praktikum: z.array(
    z.string().min(1, 'Pilih minimal 1 mata kuliah'),
  ),
  komitmen_url: z.string().url('Masukkan URL yang valid'),
  dokumen_pendukung_url: z.string().optional(),
});

interface MataKuliah {
  id: number;
  nama: string;
  kode: string;
}

interface Event {
  id: number;
  admin_id: number;
  jenis: string;
  mulai: string;
  selesai: string;
  is_aktif: boolean;
}

interface Kelas {
  id: number;
  nama: string;
  mata_kuliah: MataKuliah;
}

interface Asisten {
  id: number;
  nim: string;
  nama: string;
  email: string;
  status: string;
  mata_kuliah_pilihan: MataKuliah[];
  komitmen_url: string;
  event: Event;
  kelas?: Kelas[];
}

function DetailAsisten({ asisten }: { asisten: Asisten }) {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-primary/10 p-3">
          <User2 className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h2 className="text-xl font-bold">{asisten.nama}</h2>
          <span className="text-sm text-muted-foreground">{asisten.nim}</span>
        </div>
      </div>
      <FormItem>
        <FormLabel>Email</FormLabel>
        <Input disabled defaultValue={asisten.email} />
      </FormItem>
    </>
  );
}
export default function RegisterForm() {
  const _cookies = useGetCookie();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [asisten, setAsisten] = useState<Asisten | null>(null);
  const [mataKuliah, setMataKuliah] = useState<MataKuliah[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mata_kuliah_praktikum: [],
      komitmen_url: '',
      dokumen_pendukung_url: '',
    },
  });

  useEffect(() => {
    if (_cookies('token')) {
      async function getAsisten() {
        const res = await fetch(`/api/asisten/me`, {
          headers: {
            authorization: `Bearer ${_cookies('token')}`,
          },
        });
        const json = await res.json();
        if (!res.ok) {
          toast.error(`Error: ${json.message || 'Gagal mengambil kelas'}`);
          setAsisten(null);
        }
        form.setValue(
          'mata_kuliah_praktikum',
          json.data.mata_kuliah_pilihan.map((mk: MataKuliah) => mk.kode),
        );
        form.setValue('komitmen_url', json.data.komitmen_url);
        form.setValue(
          'dokumen_pendukung_url',
          json.data.dokumen_pendukung_url || '',
        );
        setAsisten(json.data);
      }

      async function getMataKuliah() {
        const res = await fetch('/api/asisten/mata-kuliah', {
          headers: {
            authorization: `Bearer ${_cookies('token')}`,
          },
        });
        const json = await res.json();
        if (!res.ok) {
          toast.error(
            `Error: ${json.message || 'Gagal mengambil mata kuliah'}`,
          );
          setMataKuliah([]);
        }
        setMataKuliah(json.data);
      }

      getAsisten();
      getMataKuliah();
    }
  }, [_cookies, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const res = await fetch('/api/asisten/register', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('Pendaftaran berhasil', {
        icon: <BadgeCheck />,
      });
      router.push('/asisten');
      router.refresh();
    } else {
      toast.error('Pendaftaran gagal: ' + json?.status, {
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
            {asisten && <DetailAsisten asisten={asisten} />}
            <FormField
              control={form.control}
              name="mata_kuliah_praktikum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mata Kuliah Praktikum</FormLabel>

                  <FormControl>
                    <MultiSelect
                      options={mataKuliah.map((mk) => ({
                        value: mk.kode.toString(),
                        label: (
                          <>
                            {mk.kode} <br /> {mk.nama}
                          </>
                        ),
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
              name="dokumen_pendukung_url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dokumen pendukung</FormLabel>
                  <FormControl>
                    <Input placeholder="Ketik URL Anda" {...field} />
                  </FormControl>
                  <FormDescription>
                    Masukkan URL dokumen pendukung Anda sebagai asisten.
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
                    <Input
                      type="file"
                      id='komitmen_url'
                      placeholder="Ketik URL komitmen Anda"
                      onChange={async (e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const file = e.target.files[0];
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('name', file.name);
                        try {
                        const res = await fetch('/api/asisten/upload', {
                          method: 'POST',
                          body: formData,
                          headers: {
                          'authorization': `Bearer ${_cookies('token')}`,
                          },
                        });
                        const json = await res.json();
                        if (json.status) {
                          const url = json.data.url;
                          field.onChange(url);
                        } else {
                          toast.error(json.message || 'Gagal mengunggah file');
                        }
                        } catch (err: any ) {
                        toast.error('Gagal mengunggah file: ' + err.message);
                        }
                      }
                      }}
                    />
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
