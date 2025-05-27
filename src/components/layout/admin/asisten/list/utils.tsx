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


interface FilterRuanganInputProps<TData> {
  table: Table<TData>;
}

export function FilterRuanganInput<TData>({
  table,
}: FilterRuanganInputProps<TData>) {
  return (
    <Input
      placeholder="Filter Ruangan..."
      value={(table.getColumn('nama')?.getFilterValue() as string) ?? ''}
      onChange={(event) =>
        table.getColumn('nama')?.setFilterValue(event.target.value)
      }
      className="max-w-sm"
    />
  );
}

export function SelectRowsActionButton<TData>({
  table,
}: FilterRuanganInputProps<TData>) {
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
}: FilterRuanganInputProps<TData>) {
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

export function FilterColumnsButton<TData>({
  table,
}: FilterRuanganInputProps<TData>) {
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
