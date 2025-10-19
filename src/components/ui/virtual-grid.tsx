import React from 'react';
import { FixedSizeGrid as Grid, GridChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualGridProps<T> {
  items: T[];
  columnCount: number;
  rowHeight: number;
  columnWidth: number;
  renderItem: (item: T, rowIndex: number, columnIndex: number) => React.ReactNode;
  className?: string;
  overscanRowCount?: number;
  overscanColumnCount?: number;
}

export function VirtualGrid<T>({
  items,
  columnCount,
  rowHeight,
  columnWidth,
  renderItem,
  className = '',
  overscanRowCount = 2,
  overscanColumnCount = 2,
}: VirtualGridProps<T>) {
  const rowCount = Math.ceil(items.length / columnCount);

  const Cell = ({ columnIndex, rowIndex, style }: GridChildComponentProps) => {
    const index = rowIndex * columnCount + columnIndex;
    if (index >= items.length) return null;

    return (
      <div style={style} className="p-2">
        {renderItem(items[index], rowIndex, columnIndex)}
      </div>
    );
  };

  return (
    <div className={`h-full w-full ${className}`}>
      <AutoSizer>
        {({ height, width }) => (
          <Grid
            columnCount={columnCount}
            columnWidth={columnWidth}
            height={height}
            rowCount={rowCount}
            rowHeight={rowHeight}
            width={width}
            overscanRowCount={overscanRowCount}
            overscanColumnCount={overscanColumnCount}
          >
            {Cell}
          </Grid>
        )}
      </AutoSizer>
    </div>
  );
}
