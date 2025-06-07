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

interface FilterkelasInputProps<TData> {
  table: Table<TData>;
}

export function FilterKelasInput<TData>({
  table,
}: FilterkelasInputProps<TData>) {
  return (
    <Input
      placeholder="Filter Judul..."
      value={(table.getColumn('judul')?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn('judul')?.setFilterValue(event.target.value)
      }
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
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}

export function FilterByMataKuliahButton<TData>({
  table,
}: FilterkelasInputProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter />
          Mata Kuliah
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search MataKuliah..." />
          <CommandList>
            <CommandEmpty>No mata kuliah found.</CommandEmpty>
            <CommandGroup>
              {Array.from(
                new Map(
                  table
                    .getCoreRowModel()
                    .rows.map((row) => [row.getValue('mata_kuliah_nama'), row]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table.getColumn('mata_kuliah_nama')?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('mata_kuliah_nama')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('mata_kuliah_nama'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('mata_kuliah_nama')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('mata_kuliah_nama')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('mata_kuliah_nama')]
                              : prev.filter(
                                  (c: string) =>
                                    c !== row.getValue('mata_kuliah_nama'),
                                ),
                          );
                      }}
                      id={`filter-mata-kuliah-${row.id}`}
                    />
                    <label
                      className="ml-2"
                      htmlFor={`filter-mata-kuliah-${row.id}`}
                    >
                      {row.getValue('mata_kuliah_nama') as string}
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
export function FilterByAsistenButton<TData>({
  table,
}: FilterkelasInputProps<TData>) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter />
          Asisten
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Asisten..." />
          <CommandList>
            <CommandEmpty>No asisten found.</CommandEmpty>
            <CommandGroup>
              {Array.from(
                new Map(
                  table
                    .getCoreRowModel()
                    .rows.map((row) => [row.getValue('asisten_nama'), row]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(
                          table.getColumn('asisten_nama')?.getFilterValue(),
                        )
                          ? (
                              table
                                .getColumn('asisten_nama')
                                ?.getFilterValue() as string[]
                            ).includes(row.getValue('asisten_nama'))
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (table
                            .getColumn('asisten_nama')
                            ?.getFilterValue() as string[]) || [];
                        table
                          .getColumn('asisten_nama')
                          ?.setFilterValue(
                            checked
                              ? [...prev, row.getValue('asisten_nama')]
                              : prev.filter(
                                  (c: string) =>
                                    c !== row.getValue('asisten_nama'),
                                ),
                          );
                      }}
                      id={`filter-asisten-${row.id}`}
                    />
                    <label
                      className="ml-2"
                      htmlFor={`filter-asisten-${row.id}`}
                    >
                      {(row.getValue('asisten_nama') as string) ?? '-'}
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
