import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface ResponsiveTableProps {
  data: any[];
  columns: {
    key: string;
    label: string;
    render?: (value: any, row: any) => React.ReactNode;
    mobileHidden?: boolean;
    important?: boolean;
  }[];
  className?: string;
  mobileCardView?: boolean;
}

const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  columns,
  className,
  mobileCardView = true
}) => {
  const isMobile = useIsMobile();

  // Mobile card view
  if (isMobile && mobileCardView) {
    const importantColumns = columns.filter(col => col.important);
    const otherColumns = columns.filter(col => !col.important && !col.mobileHidden);

    return (
      <div className={cn('space-y-3', className)}>
        {data.map((row, index) => (
          <Card key={index} className="animate-fade-in">
            <CardContent className="p-4">
              {/* Important fields displayed prominently */}
              {importantColumns.map(column => (
                <div key={column.key} className="mb-2">
                  <span className="font-medium text-lg">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
              
              {/* Other fields in a compact layout */}
              {otherColumns.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                  {otherColumns.map(column => (
                    <div key={column.key} className="space-y-1">
                      <span className="text-muted-foreground text-xs">{column.label}</span>
                      <div className="font-medium">
                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Desktop table view
  const visibleColumns = isMobile ? columns.filter(col => !col.mobileHidden) : columns;

  return (
    <div className={cn('overflow-x-auto', className)}>
      <Table>
        <TableHeader>
          <TableRow>
            {visibleColumns.map(column => (
              <TableHead key={column.key} className={isMobile ? 'text-xs' : ''}>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} className="animate-fade-in">
              {visibleColumns.map(column => (
                <TableCell key={column.key} className={isMobile ? 'text-xs py-2' : ''}>
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ResponsiveTable;
