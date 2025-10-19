import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface Column<T> {
  key: string;
  header: string;
  width?: number;
  render: (item: T) => React.ReactNode;
}

interface OptimizedTableProps<T> {
  data: T[];
  columns: Column<T>[];
  rowHeight?: number;
  overscanCount?: number;
  className?: string;
  onRowClick?: (item: T, index: number) => void;
}

export function OptimizedTable<T>({
  data,
  columns,
  rowHeight = 52,
  overscanCount = 5,
  className = '',
  onRowClick,
}: OptimizedTableProps<T>) {
  const Row = useMemo(
    () =>
      ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const item = data[index];
        return (
          <div style={style}>
            <TableRow
              className={onRowClick ? 'cursor-pointer hover:bg-accent' : ''}
              onClick={() => onRowClick?.(item, index)}
            >
              {columns.map((column) => (
                <TableCell key={column.key} style={{ width: column.width }}>
                  {column.render(item)}
                </TableCell>
              ))}
            </TableRow>
          </div>
        );
      },
    [data, columns, onRowClick]
  );

  return (
    <div className={`rounded-md border ${className}`}>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key} style={{ width: column.width }}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
      </Table>
      <div className="h-[600px]">
        <AutoSizer>
          {({ height, width }) => (
            <List
              height={height}
              itemCount={data.length}
              itemSize={rowHeight}
              width={width}
              overscanCount={overscanCount}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
