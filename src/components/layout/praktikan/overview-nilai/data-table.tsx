'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Penilaian } from './columns';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination: {
        pageIndex: 0,
        pageSize: 8,
      },
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                <strong>Responsi:</strong>
              </TableCell>
                <TableCell colSpan={1} className="text-center">
                  {
                    (data as Penilaian[]).filter(data => data.detail.filter(detail => detail.tipe === 'responsi')[0]?.nilai)[0]?.detail[0].nilai
                  }
                </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} className="text-right">
                <strong>Total nilai:</strong>
              </TableCell>
                <TableCell colSpan={1} className="text-center">
                  {/* TODO: buat total nilai  */}
                  {
                    (data as Penilaian[]).filter(data => data.detail.filter(detail => detail.tipe === 'responsi')[0]?.nilai)[0]?.detail[0].nilai
                  }
                </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4"></div>
    </div>
  );
}
