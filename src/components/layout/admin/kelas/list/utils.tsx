import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown, Download } from 'lucide-react';

import { TProps } from '../../../shared/constants';
import DeleteConfirmationButton from '../delete-confirmation';
import { Kelas } from './columns';

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
            <DeleteConfirmationButton
              listKelas={table
                .getFilteredSelectedRowModel()
                .rows.map((row) => row.original as Kelas)}
            />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
