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
import { Table } from '@tanstack/react-table';
import { ChevronDown, Columns, Download, ListFilter } from 'lucide-react';

import DeleteConfirmationButton from '../delete-confirmation';
import { Jadwal } from './columns';

interface FilterkelasInputProps<TData> {
  table: Table<TData>;
}

export function FilterKelasPraktikumInput<TData>({
  table,
}: FilterkelasInputProps<TData>) {
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
}: FilterkelasInputProps<TData>) {
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
            <DeleteConfirmationButton
              listJadwal={table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original as Jadwal)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

export function FilterByRuanganButton<TData>({
  table,
}: FilterkelasInputProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter />
          Ruangan
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Ruangan..." />
          <CommandList>
            <CommandEmpty>No ruangan found.</CommandEmpty>
            <CommandGroup>
              {Array.from(
                new Map(
                  table
                    .getCoreRowModel()
                    .rows.map((row) => [row.getValue('ruangan_nama'), row]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table.getColumn('ruangan_nama')?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('ruangan_nama')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('ruangan_nama'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('ruangan_nama')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('ruangan_nama')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('ruangan_nama')]
                              : prev.filter(
                                  (c: string) =>
                                    c !== row.getValue('ruangan_nama'),
                                ),
                          );
                      }}
                      id={`filter-ruangan-${row.id}`}
                    />
                    <label
                      className="ml-2"
                      htmlFor={`filter-ruangan-${row.id}`}
                    >
                      {row.getValue('ruangan_nama') as string}
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
export function FilterByKelasButton<TData>({
  table,
}: FilterkelasInputProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter />
          Kelas
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Kelas..." />
          <CommandList>
            <CommandEmpty>No kelas found.</CommandEmpty>
            <CommandGroup>
              {Array.from(
                new Map(
                  table
                    .getCoreRowModel()
                    .rows.map((row) => [row.getValue('kelas_nama'), row]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table.getColumn('kelas_nama')?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('kelas_nama')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('kelas_nama'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('kelas_nama')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('kelas_nama')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('kelas_nama')]
                              : prev.filter(
                                  (c: string) =>
                                    c !== row.getValue('kelas_nama'),
                                ),
                          );
                      }}
                      id={`filter-kelas-${row.id}`}
                    />
                    <label className="ml-2" htmlFor={`filter-kelas-${row.id}`}>
                      {(row.getValue('kelas_nama') as string) ?? '-'}
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
export function FilterByStatusButton<TData>({
  table,
}: FilterkelasInputProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter />
          Status
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Status..." />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {Array.from(
                new Map(
                  table
                    .getCoreRowModel()
                    .rows.map((row) => [row.getValue('is_dilaksanakan'), row]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table.getColumn('is_dilaksanakan')?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('is_dilaksanakan')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('is_dilaksanakan'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('is_dilaksanakan')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('is_dilaksanakan')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('is_dilaksanakan')]
                              : prev.filter(
                                  (c: string) =>
                                    c !== row.getValue('is_dilaksanakan'),
                                ),
                          );
                      }}
                      id={`filter-dilaksanakan-${row.id}`}
                    />
                    <label
                      className="ml-2"
                      htmlFor={`filter-dilaksanakan-${row.id}`}
                    >
                      {row.getValue('is_dilaksanakan') ? 'Sudah' : 'Belum'}
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
}: FilterkelasInputProps<TData>) {
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
