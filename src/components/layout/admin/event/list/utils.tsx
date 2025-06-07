import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { useGetCookie } from 'cookies-next/client';
import { ChevronDown, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { TProps } from '../../../shared/constants';
import { Event } from './columns';

export function SelectRowsActionButton<TData>({ table }: TProps<TData>) {
  return (
    <>
      {table.getFilteredSelectedRowModel().rows.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              Actions
              <Badge>
                {table.getFilteredSelectedRowModel().rows.length} selected
              </Badge>
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Download />
              Export
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

export const StatusSwitch = ({ event }: { event: Event }) => {
  const _cookies = useGetCookie();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(event.is_aktif);
  }, [event.is_aktif]);

  const toggleStatus = async (newStatus: boolean) => {
    const res = await fetch('/api/admin/event', {
      method: 'PUT',
      headers: {
        'authorization': `Bearer ${_cookies('token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        where: {
          event_id: event.id,
        },
        update: {
          is_aktif: newStatus,
          mulai: event.mulai,
          selesai: event.selesai,
        },
      }),
    });
    const json = await res.json();
    if (res.ok) {
      toast.success('Event berhasil diperbarui');
      router.refresh();
    } else {
      toast.error(`Error: ${json.message || 'Event memperbarui ruangan'}`);
      setChecked(!newStatus); // Revert the switch state if the update fails
    }
  };

  return (
    <Switch
      checked={checked}
      onCheckedChange={(value) => {
        // Handle switch change logic here
        setChecked(value);
        toggleStatus(value);
      }}
      aria-label="Toggle event status"
    />
  );
};
