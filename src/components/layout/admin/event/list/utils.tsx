import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Table } from '@tanstack/react-table';
import { useGetCookie } from 'cookies-next/client';
import { ChevronDown, Columns, Download, ListFilter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Event } from './columns';

interface FilterEventInputProps<TData> {
  table: Table<TData>;
}

export function FilterEventInput<TData>({
  table,
}: FilterEventInputProps<TData>) {
  return (
    <Input
      placeholder="Cari..."
      value={table.getState().globalFilter ?? ''}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className="max-w-sm"
    />
  );
}

export function SelectRowsActionButton<TData>({
  table,
}: FilterEventInputProps<TData>) {
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

export function FilterByAdminButton<TData>({
  table,
}: FilterEventInputProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter />
          Admin
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Admin..." />
          <CommandList>
            <CommandEmpty>No admin found.</CommandEmpty>
            <CommandGroup>
              {Array.from(
                new Map(
                  table
                    .getCoreRowModel()
                    .rows.map((row) => [row.getValue('admin_nama'), row]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table.getColumn('admin_nama')?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('admin_nama')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('admin_nama'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('admin_nama')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('admin_nama')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('admin_nama')]
                              : prev.filter(
                                  (c: string) =>
                                    c !== row.getValue('admin_nama'),
                                ),
                          );
                      }}
                      id={`filter-admin-${row.id}`}
                    />
                    <label className="ml-2" htmlFor={`filter-admin-${row.id}`}>
                      {row.getValue('admin_nama') as string}
                    </label>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
export function FilterByJenisEventButton<TData>({
  table,
}: FilterEventInputProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter />
          Jenis
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search jenis event..." />
          <CommandList>
            <CommandEmpty>No jenis event found.</CommandEmpty>
            <CommandGroup>
              {Array.from(
                new Map(
                  table
                    .getCoreRowModel()
                    .rows.map((row) => [row.getValue('jenis'), row]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table.getColumn('jenis')?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('jenis')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('jenis'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('jenis')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('jenis')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('jenis')]
                              : prev.filter(
                                  (c: string) => c !== row.getValue('jenis'),
                                ),
                          );
                      }}
                      id={`filter-admin-${row.id}`}
                    />
                    <label className="ml-2" htmlFor={`filter-admin-${row.id}`}>
                      {row.getValue('jenis') as string}
                    </label>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function FilterColumnsButton<TData>({
  table,
}: FilterEventInputProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          Columns
          <Columns />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
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
