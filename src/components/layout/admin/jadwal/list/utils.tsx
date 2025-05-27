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
                    .rows.map((row) => [row.getValue('ruang_nama'), row]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table.getColumn('ruang_nama')?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('ruang_nama')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('ruang_nama'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('ruang_nama')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('ruang_nama')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('ruang_nama')]
                              : prev.filter(
                                  (c: string) =>
                                    c !== row.getValue('ruang_nama'),
                                ),
                          );
                      }}
                      id={`filter-ruangan-${row.id}`}
                    />
                    <label
                      className="ml-2"
                      htmlFor={`filter-ruangan-${row.id}`}
                    >
                      {row.getValue('ruang_nama') as string}
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
                    .rows.map((row) => [
                      row.getValue('kelaspraktikum_nama'),
                      row,
                    ]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table
                            .getColumn('kelaspraktikum_nama')
                            ?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('kelaspraktikum_nama')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('kelaspraktikum_nama'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('kelaspraktikum_nama')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('kelaspraktikum_nama')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('kelaspraktikum_nama')]
                              : prev.filter(
                                  (c: string) =>
                                    c !== row.getValue('kelaspraktikum_nama'),
                                ),
                          );
                      }}
                      id={`filter-kelas-${row.id}`}
                    />
                    <label className="ml-2" htmlFor={`filter-kelas-${row.id}`}>
                      {(row.getValue('kelaspraktikum_nama') as string) ?? '-'}
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
                    .rows.map((row) => [
                      row.getValue('status'),
                      row,
                    ]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table
                            .getColumn('status')
                            ?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('status')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('status'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('status')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('status')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('status')]
                              : prev.filter(
                                  (c: string) =>
                                    c !== row.getValue('status'),
                                ),
                          );
                      }}
                      id={`filter-status-${row.id}`}
                    />
                    <label className="ml-2" htmlFor={`filter-status-${row.id}`}>
                      {(row.getValue('status') as string) ?? '-'}
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
