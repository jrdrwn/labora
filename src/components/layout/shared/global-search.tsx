import { Input } from '@/components/ui/input';

import { TProps } from './constants';

export function GlobalSearchInput<TData>({ table }: TProps<TData>) {
  return (
    <Input
      placeholder="Cari..."
      value={table.getState().globalFilter ?? ''}
      onChange={(event) => table.setGlobalFilter(event.target.value)}
      className="max-w-sm"
    />
  );
}
