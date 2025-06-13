'use client';

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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ListFilter } from 'lucide-react';

import { TProps } from './constants';

export function FilterBy<TData>({
  value,
  label,
  table,
}: TProps<TData> & { value: string; label?: string }) {
  if (label === undefined) {
    label = value.charAt(0).toUpperCase() + value.slice(1);
  }
  const column = table.getColumn(value);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <ListFilter />
          {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder={`Search ${label}...`} />
          <CommandList>
            <CommandEmpty>No {label} found.</CommandEmpty>
            <CommandGroup>
              {Array.from(
                new Map(
                  table
                    .getCoreRowModel()
                    .rows.map((row) => [row.getValue(value), row]),
                ).values(),
              ).map((row) => {
                return (
                  <CommandItem key={row.id}>
                    <Checkbox
                      key={row.id}
                      onSelect={(e) => e.preventDefault()}
                      checked={
                        Array.isArray(column?.getFilterValue())
                          ? (column?.getFilterValue() as string[]).includes(
                              row.getValue(value),
                            )
                          : false
                      }
                      onCheckedChange={(checked) => {
                        const prev =
                          (column?.getFilterValue() as string[]) || [];
                        column?.setFilterValue(
                          checked
                            ? [...prev, row.getValue(value)]
                            : prev.filter(
                                (c: string) => c !== row.getValue(value),
                              ),
                        );
                      }}
                      id={`filter-${value}-${row.id}`}
                    />
                    <label
                      className="ml-2"
                      htmlFor={`filter-${value}-${row.id}`}
                    >
                      {row.getValue(value) as string}
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
