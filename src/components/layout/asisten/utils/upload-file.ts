import { toast } from "sonner";

export default  async function uploadFile (token: string, id: string,  file: File) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', `${id}-${file.name}`);
      try {
        const res = await fetch('/api/asisten/upload', {
          method: 'POST',
          body: formData,
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        const json = await res.json();
        if (json.status) {
          return json.data.url
        } else {
          toast.error(json.message || 'Gagal mengunggah file');
        }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error('Gagal mengunggah file: ' + err.message);
      }
  };