import React from 'react';
import { FixedSizeList as List, ListChildComponentProps } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscanCount?: number;
  containerHeight?: number;
  getItemKey?: (item: T) => string | number;
}

export function VirtualList<T>({
  items,
  itemHeight,
  renderItem,
  className = '',
  overscanCount = 3,
  containerHeight,
  getItemKey,
}: VirtualListProps<T>) {
  const Row = ({ index, style }: ListChildComponentProps) => (
    <div style={style} className="px-2">
      {renderItem(items[index], index)}
    </div>
  );

  const itemKey = (index: number) => {
    return getItemKey ? getItemKey(items[index]) : index;
  };

  if (containerHeight) {
    // Fixed height mode
    return (
      <div className={`w-full ${className}`} style={{ height: containerHeight }}>
        <List
          height={containerHeight}
          itemCount={items.length}
          itemSize={itemHeight}
          width="100%"
          overscanCount={overscanCount}
          itemKey={itemKey}
        >
          {Row}
        </List>
      </div>
    );
  }

  // Auto-sized mode
  return (
    <div className={`h-full w-full ${className}`}>
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width={width}
            overscanCount={overscanCount}
            itemKey={itemKey}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
}
